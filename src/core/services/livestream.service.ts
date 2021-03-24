import {LiveStreamChurchResponse,SnippetStream,CdnStream,StatusStream, LiveBroadcast, ContentDetailStream} from '../models/livestreamRequest'
import config from "utils/config"
import { ToastFunc } from 'utils/Toast';
import { IResponse } from 'core/models/Response';
import axios, { AxiosRequestConfig,CancelTokenSource } from 'axios';
import {merge} from "lodash"

const gapi = (window as any).gapi


interface getAllBroadCastResponse {
  kind:string;
  etag:string;
  nextPageToken:string;
  prevPageToken:string;
  pageInfo:{
    totalResults:number;
    resultsPerPage:number
  },
  items:LiveBroadcast[]
}
interface getAllBroadCastRequest {
  broadcastStatus:"all" | "active" | "completed" | "upcoming";
  broadcastType:"all" | "event" | "persistent"
  id:string[];
  mine:boolean
}
type PartType = "id" | "snippet" | "cdn" | "contentDetails" | "status"
    
class Gapi {
  private gapi:any;
  private state:"not-ready" | "starting" | "ready" = "not-ready"
  private baseUrl = `${process.env.REACT_APP_SERVER_URL}/LiveStreaming`
  constructor(private toast:ToastFunc) {
    this.gapi = (window as any).gapi
    this.load()
  }


  // Loads the google script
  private load = () => {
    this.state = "starting"
    this.gapi.load("client:auth2",() => {
      this.gapi.auth2.init({client_id:config.googleClientId}).then(() => {
        this.loadClient()
      }).catch((err:any) => {
        console.log("this si the err",err)
        this.toast({
          messageType:"error",
          title:"Unable to complete google api loading",
          subtitle:`Error:${err.message}`
        })
      })
    })
  }

  // Load the API for creating the broadcast
  private loadClient = () => {
    gapi.client.setApiKey(config.googleApiKey)
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest", "v3").then(() => {
      this.state = "ready"
    }).catch((err:any) => {
      this.toast({
        messageType:"error",
        title:"Something went wrong",
        subtitle:`Error:${err}`
      })
    })
  }
  // Authenticate the user
  authenticate = () => {
    if(this.state !== "ready"){
      return(
        this.toast({
          messageType:"info",
          title:"Google API is stil Loading",
          subtitle:""
        })
      )
    }
    if(!(this.gapi.auth2.getAuthInstance().isSignedIn.get())){
     return this.gapi.auth2.getAuthInstance().signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
      .catch((err:any) => {
        this.toast({
          messageType:"info",
          title:"Unable to Authenticate",
          subtitle:`Error:${err.error}`
        })
      })
    }else{
      return Promise.resolve()
    }
  }

  getBroadCastDetail = async (broadCastId:string) => {
    if(this.gapi.client.youtube){
      try{
        const response = await this.gapi.client.youtube.liveBroadcasts.list({
          part: [
            "snippet,contentDetails,status,id"
          ],
          id: [
            broadCastId
          ]
        })
        return response.result
      }catch(err){
        throw err
      }
    }
  }
  getStreamDetail = async (streamId:string) => {
    if(this.gapi.client.youtube){
      try{
        const response = await this.gapi.client.youtube.liveStreams.list({
          part:["snippet,cdn,contentDetails,status"],
          id:streamId
        })
        return response.result
      }catch(err){
        throw err
      }
    }
  }
  createBroadCast = async (payload:Partial<LiveBroadcast>,churchId:number) => {
    if(this.state !== "ready"){
      return(
        this.toast({
          messageType:"info",
          title:"Google API is stil Loading",
          subtitle:""
        })
      )
    }
    try{
      // First Create a broadcast 
      const broadcastRes = await gapi.client.youtube.liveBroadcasts.insert(payload)
      
      // Create a livestream
      const streamInsertResp = await this.createLiveStream({
        "part":[...payload.part!,"cdn","contentDetails"] as any,
        "resource": {
          "cdn": {
            "frameRate": "60fps",
            "resolution": "1080p",
            "ingestionType": "rtmp"
          },
          snippet: {
            title: payload.snippet!.title,
            description: payload.snippet!.description
          },
          contentDetails: {
            isReusable: true
          },
          status:{
            streamStatus:"inactive"
          }
        }
      });
      // Bind both the broadcast and stream together
      const broadcastStreamBind = await this.bindStreamToBroadCast({
          id:broadcastRes.result.id != null ? broadcastRes.result.id : "",
          streamId:streamInsertResp.id
        })
      
      const result = {
        "broadcastId": broadcastRes.result.id,
        "streamId": streamInsertResp.id,
        "snippet":payload.snippet,
        "contentDetails":streamInsertResp.contentDetails,
        "status": {
          privacyStatus:broadcastRes.result.status.privacyStatus
        },
        "cdn":{
          "resolution": streamInsertResp.cdn.resolution,
          "frameRate": streamInsertResp.cdn.frameRate,
          "ingestionType": streamInsertResp.cdn.ingestionType,
          "ingestionAddress": streamInsertResp.cdn.ingestionInfo.ingestionAddress,  
          "rtmpsIngestionAddress": streamInsertResp.cdn.ingestionInfo.rtmpsIngestionAddress,
          "rtmpsBackupIngestionAddress":streamInsertResp.cdn.ingestionInfo.rtmpsBackupIngestionAddress,
          "streamName":streamInsertResp.cdn.ingestionInfo.streamName
        },
        "churchId": churchId,
        "broadcastStatus": broadcastRes.result.status.lifeCycleStatuss || "UpComing"
      }
      const response = await this.createLiveFeed(result as any)
      return response
    }catch(err){
      this.toast({
        messageType:"error",
        title:"Unable to create new Broadcast",
        subtitle:`Error:${err.message}`
      })
    }
  }
  // Create the media stream 
  private createLiveStream = async (arg:{
    "part":PartType[],
    "resource": {
      "cdn"?: CdnStream,
      "snippet": SnippetStream,
      "contentDetails"?: ContentDetailStream,
      "status":{
        "streamStatus": "created" | "active" | "inactive" | "ready" | "error"
      }
    }
  }):Promise<any> => {
    try{
      const newStreamRequest = merge({
        part:["snippet","cdn","contentDetails","status"],
        resource: {
          cdn: {
            frameRate: "60fps",
            resolution: "1080p",
            ingestionType: "rtmp"
          },
          contentDetails: {
            isReusable: true
          },
        }   
      },arg)
      const response = await this.gapi.client.youtube.liveStreams.insert(newStreamRequest)
      return response.result    
    }catch(err){
      throw err
    }
  }

  // For changing the status of the broadcast
  transitionBroadCast = async (arg:{
    broadcastStatus:"complete" | "live" | "testing";
    id:string;
    part:string
  }) => {
    try{
      const {broadcastStatus,id,part} = arg
      const response = await this.gapi.client.youtube.liveBroadcasts.transition({
        broadcastStatus,
        id,part
      })
      return response.result
    }catch(err){
      throw err
    }
  }

  private bindStreamToBroadCast = async (arg:{
    id:string;
    streamId:string
  }):Promise<any> => {
    try{
      const {id,streamId} = arg
      const response = await this.gapi.client.youtube.liveBroadcasts.bind({
        id,part:["snippet"],streamId
      })
      return response.result
    }catch(err){
      throw err
    }
  } 
  
  // get all the available broadcast
  getAllBroadCast = async (arg:getAllBroadCastRequest):Promise<getAllBroadCastResponse> => {
    try{
      const {broadcastStatus,mine,broadcastType,id} = arg;

      const response = await this.gapi.client.youtube.liveBroadcasts.list({
        ...(broadcastStatus && {broadcastStatus}),
        ...(mine && {mine}),
        ...(broadcastType && {broadcastType}),
        ...(id && {id})
      })
      return response
    }catch(err){
      throw err
    }
  }

  createLiveFeed = async (arg:LiveStreamChurchResponse):Promise<IResponse<any>> => {
    const url = `${this.baseUrl}/CreateLiveFeed`
    try{
      const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
      const response = await axios.post(url,arg,config)
      return response.data
    }catch(err){
      throw err
    }
}
// get Pending church broadcast from faithful server
  getChurchPendingBroadcast = async (churchId:number,cancelToken:CancelTokenSource):Promise<IResponse<LiveStreamChurchResponse[]>> => {
    const url = `${this.baseUrl}/GetPendingLiveBroadcast?churchId=${churchId}`
    try{
        const response = await axios.get(url,{
          cancelToken:cancelToken.token
        })
        return response.data
    }catch(err){
        throw err
    }
}

  changeBroadCastStatus = async (arg:{
    status:"testing" | "live",
    broadCastId:string;
    snippet:SnippetStream;
    cdn:CdnStream;
    streamStatus:StatusStream
  }) => {
    try{
      
      const {
        broadCastId,status,snippet,cdn,streamStatus
      } = arg
      const newStreamResponse = await this.createLiveStream({
         part:["snippet","cdn","contentDetails","status"],
         resource:{
           snippet,
           cdn,
           status:{
             streamStatus:"active"
           }
         }
      })
      console.log("this is the stream response",newStreamResponse)
      const bindBroadcastStream = await this.bindStreamToBroadCast({
        id:broadCastId,
        streamId:newStreamResponse.id
      })
      console.log("this is the bind broadcast result",bindBroadcastStream)
      const response = await this.gapi.client.youtube.liveBroadcasts.transition({
        broadcastStatus:status,
        id:bindBroadcastStream.id,
        part:["snippet","id","status"]
      })
      console.log("this is the response",response)
      return response
    }catch(err){
      throw err
    }
  }

}

export default Gapi
