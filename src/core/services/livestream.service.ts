import {SaveLiveStream} from '../models/livestreamRequest'

const gapi = (window as any).gapi

export const authenticate =() =>{
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
        .then(function() { console.log("Sign-in successful"); },
              function(err:any) { console.error("Error signing in", err); });
  }

  export const loadClient =() =>{
    gapi.client.setApiKey("YOUR_API_KEY");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest", "v3")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err:any) { console.error("Error loading GAPI client for API", err); });
  }

  export const execute = async (payload: any) =>{
      try  {
        const broadcastRes = await gapi.client.youtube.liveBroadcasts.insert(payload);
        const stream = {
            "part": [
                "snippet,cdn,contentDetails"
              ],
            "resource": {
              "cdn": {
                "frameRate": payload.cdn.frameRate,
                "resolution": payload.cdn.resolution,
                "ingestionType": payload.cdn.ingestionType
              },
              "snippet": {
                "title": payload.snippet.title,
                "description": payload.snippet.description
              },
              "contentDetails": {
                "isReusable": true
              }
            }
          }
        const streamInsertResp = await gapi.client.youtube.liveStreams.insert(stream);
        const broadcastBind = await gapi.client.youtube.liveBroadcasts.bind({
            "id": broadcastRes.result.id != null?broadcastRes.result.id: "",
            "part": [
              "id"
            ],
            "streamId": streamInsertResp.result.id
          });
          const saveLiveStream  ={

          }
         
      }catch(e){
        console.error("Execute error", e);
      }
      
  }
  export const load =()=>{
    gapi.load("client:auth2", function() {
        gapi.auth2.init({client_id: "YOUR_CLIENT_ID"});
      });
  }