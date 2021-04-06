import {
  LiveStreamChurchResponse,
  SnippetStream,
  CdnStream,
  StatusStream,
  LiveBroadcast,
  ContentDetailStream,
  ILiveStream,
  ContentDetailBroadcast,
  SnippetBroadcast,StatusBroadcast
} from "../models/livestreamRequest";
import config from "utils/config";
import { ToastFunc } from "utils/Toast";
import { IResponse } from "core/models/Response";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { merge } from "lodash";
// import gapiTypes from "@types/"

const gapi = (window as any).gapi;

interface getAllBroadCastResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: LiveBroadcast[];
}
interface getAllBroadCastRequest {
  broadcastStatus: "all" | "active" | "completed" | "upcoming";
  broadcastType: "all" | "event" | "persistent";
  id: string[];
  mine: boolean;
}
interface BroadCastReturn {
  etag: string;
  items: {
    contentDetails: ContentDetailBroadcast;
    etags: string;
    id: string;
    kind: string;
    snippet: SnippetBroadcast;
    status:StatusBroadcast
  }[];
  kind: string;
  pageInfo: {
    totalResult: string;
    resultersPerPage: number;
  };
}
type PartType = "id" | "snippet" | "cdn" | "contentDetails" | "status";

// React.Dispatch<React.SetStateAction<"not-ready" | "starting" | "ready">>

interface ConstructorArgs {
  toast:ToastFunc;
  state:"not-ready" | "starting" | "ready" | "unauthenticated";
  setState:React.Dispatch<React.SetStateAction<"not-ready" | "starting" | "ready" | "unauthenticated">>
}

class Gapi {
  private gapi: any;
  private toast:ToastFunc
  public state:"not-ready" | "starting" | "ready" | "unauthenticated" = "not-ready";
  private setState:React.Dispatch<React.SetStateAction<"not-ready" | "starting" | "ready" | "unauthenticated">>;
  private baseUrl = `${process.env.REACT_APP_SERVER_URL}/LiveStreaming`;
  constructor({
    setState,state,toast
  }:ConstructorArgs) {
    this.gapi = (window as any).gapi;
    this.state = state
    this.setState = setState
    this.toast = toast
    this.load();
  }

  // Loads the google script
  private load = () => {
    this.state = "starting";
    this.gapi.load("client:auth2", () => {
      this.gapi.auth2
        .init({ client_id: config.googleClientId })
        .then(() => {
          this.loadClient();
        })
        .catch((err: any) => {
          console.log("this si the err", err);
          this.toast({
            messageType: "error",
            title: "Unable to complete google api loading",
            subtitle: `Error:${err.message}`,
          });
        });
    });
  };

  // Load the API for creating the broadcast
  private loadClient = () => {
    this.gapi.client.setApiKey(config.googleApiKey);
    return this.gapi.client
      .load(
        "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
        "v3"
      )
      .then(() => {
        if(!this.gapi.auth2.getAuthInstance().isSignedIn.get()){
          this.setState("unauthenticated")
        }else{
          this.setState("ready")
        }
      })
      .catch((err: any) => {
        this.toast({
          messageType: "error",
          title: "Something went wrong",
          subtitle: `Error:${err}`,
        });
      });
  };
  // Authenticate the user
  authenticate = () => {
    return new Promise((resolve,reject) => {
      if (this.state === "not-ready") {
        return resolve(this.toast({
          messageType: "info",
          title: "Google API is stil Loading",
          subtitle: "",
        }));
      }
      if (!this.gapi.auth2.getAuthInstance().isSignedIn.get()) {
        return resolve(this.gapi.auth2
          .getAuthInstance()
          .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
          .catch((err: any) => {
            this.toast({
              messageType: "info",
              title: "Unable to Authenticate",
              subtitle: `Error:${err.error}`,
            });
          }))
      } else {
        return resolve("");
      }
    })
  };

  // Get the detail about a broadcast
  getBroadCastDetail = async (
    broadCastId: string
  ): Promise<BroadCastReturn | undefined> => {
    // console.log(this.gapi.client)
    if (this.gapi.client.youtube) {
      try {
        const response = await this.gapi.client.youtube.liveBroadcasts.list({
          part: ["snippet,contentDetails,status,id"],
          id: [broadCastId],
        });
        return response.result;
      } catch (err) {
        throw err;
      }
    }
  };
  // Get details about a stream
  getStreamDetail = async (streamId: string) => {
    if (this.gapi.client.youtube) {
      try {
        const response = await this.gapi.client.youtube.liveStreams.list({
          part: ["snippet,cdn,contentDetails,status"],
          id: streamId,
        });
        return response.result;
      } catch (err) {
        console.log(err)
        throw err;
      }
    }
  };
  // Create a broadcast
  createBroadCast = async (
    payload: Partial<LiveBroadcast>,
    { churchId, eventId }: { churchId: number; eventId: number }
  ) => {
    if (this.state !== "ready") {
      return this.toast({
        messageType: "info",
        title: "Google API is stil Loading",
        subtitle: "",
      });
    }
    try {
      // First Create a broadcast
      const broadcastRes = await gapi.client.youtube.liveBroadcasts.insert(
        payload
      );

      // Create a livestream
      const streamInsertResp = await this.createLiveStream({
        part: [...payload.part!, "cdn", "contentDetails"] as any,
        resource: {
          cdn: {
            frameRate: "60fps",
            resolution: "1080p",
            ingestionType: "rtmp",
          },
          snippet: {
            title: payload.snippet!.title,
            description: payload.snippet!.description,
          },
          contentDetails: {
            isReusable: true,
          },
          status: {
            streamStatus: "inactive",
          },
        },
      });
      // Bind both the broadcast and stream together
      const broadcastStreamBind = await this.bindStreamToBroadCast({
        broadCastId: broadcastRes.result.id != null ? broadcastRes.result.id : "",
        streamId: streamInsertResp.id,
      });

      const result = {
        broadcastId: broadcastRes.result.id,
        streamId: streamInsertResp.id,
        snippet: payload.snippet,
        contentDetails: streamInsertResp.contentDetails,
        status: {
          privacyStatus: broadcastRes.result.status.privacyStatus,
        },
        cdn: {
          resolution: streamInsertResp.cdn.resolution,
          frameRate: streamInsertResp.cdn.frameRate,
          ingestionType: streamInsertResp.cdn.ingestionType,
          ingestionAddress:
            streamInsertResp.cdn.ingestionInfo?.ingestionAddress,
          rtmpsIngestionAddress:
            streamInsertResp.cdn.ingestionInfo?.rtmpsIngestionAddress,
          rtmpsBackupIngestionAddress:
            streamInsertResp.cdn.ingestionInfo?.rtmpsBackupIngestionAddress,
          streamName: streamInsertResp.cdn.ingestionInfo?.streamName,
        },
        churchId: churchId,
        broadcastStatus:
          broadcastRes.result.status.lifeCycleStatuss || "UpComing",
      };

      const response = await this.createLiveFeed({
        ...(result as any),
        eventId,
      });
      return response;
    } catch (err) {
      this.toast({
        messageType: "error",
        title: "Unable to create new Broadcast",
        subtitle: `Error:${err.message}`,
      });
    }
  };

  // Create the media stream
  createLiveStream = async (arg: {
    part: PartType[];
    resource: {
      cdn?: CdnStream;
      snippet: SnippetStream;
      contentDetails?: ContentDetailStream;
      status: {
        streamStatus: "created" | "active" | "inactive" | "ready" | "error";
      };
    };
  }): Promise<ILiveStream> => {
    try {
      const newStreamRequest = merge(
        {
          part: ["snippet", "cdn", "contentDetails", "status"],
          resource: {
            cdn: {
              frameRate: "variable",
              resolution: "variable",
              ingestionType: "rtmp",
            },
            contentDetails: {
              isReusable: true,
            },
          },
        },
        arg
      );
      const response = await this.gapi.client.youtube.liveStreams.insert(
        newStreamRequest
      );
      return response.result;
    } catch (err) {
      throw err;
    }
  };

  // For changing the status of the broadcast
  transitionBroadCast = async (arg: {
    broadcastStatus: "complete" | "live" | "testing";
    broadCastId: string;
  }) => {
    try {
      const { broadcastStatus, broadCastId} = arg;
      const response = await this.gapi.client.youtube.liveBroadcasts.transition(
        {
          broadcastStatus,
          id:broadCastId,
          part: ["snippet,status,id"]
        }
      );
      return response.result;
    } catch (err) {
      const errResponse = JSON.parse(err.body)
      console.log(errResponse)
      throw errResponse
    }
  };

  bindStreamToBroadCast = async (arg: {
    broadCastId: string;
    streamId: string;
  }): Promise<any> => {
    try {
      const { broadCastId, streamId } = arg;
      const response = await this.gapi.client.youtube.liveBroadcasts.bind({
        id:broadCastId,
        part: ["snippet"],
        streamId,
      });
      return response.result;
    } catch (err) {
      const errResponse = JSON.parse(err.body)
      throw errResponse.error
    }
  };

  // get all the available broadcast
  getAllBroadCast = async (
    arg: getAllBroadCastRequest
  ): Promise<getAllBroadCastResponse> => {
    try {
      const { broadcastStatus, mine, broadcastType, id } = arg;

      const response = await this.gapi.client.youtube.liveBroadcasts.list({
        ...(broadcastStatus && { broadcastStatus }),
        ...(mine && { mine }),
        ...(broadcastType && { broadcastType }),
        ...(id && { id }),
      });
      return response;
    } catch (err) {
      throw err;
    }
  };

  createLiveFeed = async (
    arg: LiveStreamChurchResponse
  ): Promise<IResponse<any>> => {
    const url = `${this.baseUrl}/CreateLiveFeed`;
    try {
      const config: AxiosRequestConfig = {
        headers: { "Content-Type": "application/json-patch+json" },
      };
      const response = await axios.post(url, arg, config);
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  // get Pending church broadcast from faithful server
  getChurchPendingBroadcast = async (
    churchId: number,
    cancelToken: CancelTokenSource
  ): Promise<IResponse<LiveStreamChurchResponse[]>> => {
    const url = `${this.baseUrl}/GetPendingLiveBroadcast?churchId=${churchId}`;
    try {
      const response = await axios.get(url, {
        cancelToken: cancelToken.token,
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // Creates a new stream to bind to the broadcast
  changeBroadCastStatus = async (arg: {
    status: "testing" | "live";
    broadCastId: string;
    snippet: SnippetStream;
    cdn: CdnStream;
    streamStatus: StatusStream;
  }) => {
    try {
      const { broadCastId, status, snippet, cdn, streamStatus } = arg;
      const newStreamResponse = await this.createLiveStream({
        part: ["snippet", "cdn", "contentDetails", "status"],
        resource: {
          snippet,
          cdn,
          status: {
            streamStatus: "active",
          },
        },
      });
      console.log("this is the stream response", newStreamResponse);
      const bindBroadcastStream = await this.bindStreamToBroadCast({
        broadCastId: broadCastId,
        streamId: newStreamResponse.id,
      });
      console.log("this is the bind broadcast result", bindBroadcastStream);
      const response = await this.gapi.client.youtube.liveBroadcasts.transition(
        {
          broadcastStatus: status,
          id: bindBroadcastStream.id,
          part: ["snippet", "id", "status"],
        }
      );
      console.log("this is the response", response);
      return response;
    } catch (err) {
      throw err;
    }
  };
  
}

export default Gapi;
