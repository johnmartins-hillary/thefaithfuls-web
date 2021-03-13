import {SaveLiveStream} from '../models/livestreamRequest'
import config from "utils/config"
import { ToastFunc } from 'utils/Toast';
import { IResponse } from 'core/models/Response';
import axios, { AxiosRequestConfig } from 'axios';

const gapi = (window as any).gapi


class Gapi {
  private gapi:any;
  private baseUrl = `${process.env.REACT_APP_SERVER_URL}/LiveStreaming`
  constructor(private toast:ToastFunc) {
    this.gapi = (window as any).gapi
    this.load()
  }


  // Loads the google script
  private load = () => {
    this.gapi.load("client:auth2",() => {
      this.gapi.auth2.init({client_id:config.googleClientId}).then(() => {
        this.loadClient()
      }).catch((err:any) => {
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

  createBroadCast = async (payload:Partial<SaveLiveStream>,churchId:number) => {
    try{
      const broadcastRes = await gapi.client.youtube.liveBroadcasts.insert(payload)
      const stream = {
        "part":[...payload.part!,"cdn","contentDetails"],
        "resource": {
          "cdn": {
            "frameRate": payload.cdn?.frameRate || "60fps",
            "resolution": payload.cdn?.resolution || "1080p",
            "ingestionType": payload.cdn?.ingestionType || "rtmp"
          },
          "snippet": {
            "title": payload.snippet!.title,
            "description": payload.snippet!.description
          },
          "contentDetails": {
            "isReusable": true
          }
        }
      }
      
      
      const streamInsertResp = await this.gapi.client.youtube.liveStreams.insert(stream);
      const broadcastBind = await this.gapi.client.youtube.liveBroadcasts.bind({
        id:broadcastRes.result.id != null ? broadcastRes.result.id : "",
        part:[
          "id"
        ],
        streamId:streamInsertResp.result.id
      })
      // console.log("this is the deets",
      // JSON.stringify(broadcastRes.result,null,20),
      // JSON.stringify(streamInsertResp.result,null,2),
      // JSON.stringify(broadcastBind.result,null,2))
      const result = {
        "broadcastId": broadcastRes.result.id,
        "streamId": streamInsertResp.result.id,
        "snippet":payload.snippet,
        "contentDetails":streamInsertResp.result.contentDetails,
        "status": {
          privacyStatus:broadcastRes.result.status.privacyStatus
        },
        "cdn":{
          "resolution": streamInsertResp.result.cdn.resolution,
          "frameRate": streamInsertResp.result.cdn.frameRate,
          "ingestionType": streamInsertResp.result.cdn.ingestionType,
          "ingestionAddress": streamInsertResp.result.cdn.ingestionInfo.ingestionAddress,  
          "rtmpsIngestionAddress": streamInsertResp.result.cdn.ingestionInfo.rtmpsIngestionAddress,
          "rtmpsBackupIngestionAddress":streamInsertResp.result.cdn.ingestionInfo.rtmpsBackupIngestionAddress,
          "streamName":streamInsertResp.result.cdn.ingestionInfo.streamName
        },
        "churchId": churchId,
        "broadcastStatus": broadcastRes.result.status.lifeCycleStatuss || "UpComing"
      }
      const response = await this.createLiveFeed(result as any)
      return response
    }catch(err){
      console.log("there's been an err",err)
      this.toast({
        messageType:"error",
        title:"Unable to create new Broadcast",
        subtitle:`Error:${err.message}`
      })
    }

  }

  createLiveFeed = async (arg:SaveLiveStream):Promise<IResponse<any>> => {
    const url = `${this.baseUrl}/CreateLiveFeed`
    try{
        const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,arg,config)
        return response.data
    }catch(err){
        throw err
    }
}


}

export default Gapi

// export const authenticate =() =>{
//     return gapi.auth2.getAuthInstance()
//         .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
//         .then(function() { console.log("Sign-in successful"); },
//               function(err:any) { console.error("Error signing in", err); });
//   }

//   export const loadClient =() =>{
//     gapi.client.setApiKey("YOUR_API_KEY");
//     return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest", "v3")
//         .then(function() { console.log("GAPI client loaded for API"); },
//               function(err:any) { console.error("Error loading GAPI client for API", err); });
//   }

//   export const execute = async (payload: SaveLiveStream) =>{
//       try  {
//         const broadcastRes = await gapi.client.youtube.liveBroadcasts.insert(payload);
//         console.log("this is the result from broadcast res",broadcastRes)
//         // const stream = {
//         //     "part": [
//         //         "snippet,cdn,contentDetails"
//         //       ],
//         //     "resource": {
//         //       "cdn": {
//         //         "frameRate": payload.cdn.frameRate,
//         //         "resolution": payload.cdn.resolution,
//         //         "ingestionType": payload.cdn.ingestionType
//         //       },
//         //       "snippet": {
//         //         "title": payload.snippet.title,
//         //         "description": payload.snippet.description
//         //       },
//         //       "contentDetails": {
//         //         "isReusable": true
//         //       }
//         //     }
//         //   }
//         // const streamInsertResp = await gapi.client.youtube.liveStreams.insert(stream);
//         // console.log("this si the result from the streamInsertResp",streamInsertResp)
//         // const broadcastBind = await gapi.client.youtube.liveBroadcasts.bind({
//         //     "id": broadcastRes.result.id != null?broadcastRes.result.id: "",
//         //     "part": [
//         //       "id"
//         //     ],
//         //     "streamId": streamInsertResp.result.id
//         //   });
//         //   console.log("this si the result from broadcasr bind",broadcastBind)
                   
//       }catch(e){
//         console.error("Execute error", e);
//       }
      
//   }

//   export const load =()=>{
//     gapi.load("client:auth2", function() {
//         gapi.auth2.init({client_id: "YOUR_CLIENT_ID"});
//       });
//   }