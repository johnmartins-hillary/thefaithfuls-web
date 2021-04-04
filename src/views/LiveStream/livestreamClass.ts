import {ToastFunc} from "utils/Toast"
import io,{Socket} from "socket.io-client"
import { DefaultEventsMap } from "socket.io-client/build/typed-events";


interface videoSizeDetail {
    min:number;
    max:number;
    ideal:number
}
interface IConstraint{
    audio:{
        sampleRate:number;
        echoCancellation:boolean;
    }
    video:{
        width:videoSizeDetail;
        height:videoSizeDetail;
        framerate:number
    }
}

interface constructorArgsType {
    toast:ToastFunc;
    videoRef:HTMLVideoElement;
    audiobitrate:number;
    // checkedRef:HTMLInputElement;
    constraint?:IConstraint;
    alert:(arg:string) => void;
    state:"stopped" | "ready" | "streaming" | "paused";
}

const socketOptions = {
    secure: true,
    reconnection: true,
    reconnectionDelay: 1000,
    timeout: 15000,
    pingTimeout: 15000,
    pingInterval: 45000,
    query: { framespersecond: "15", audioBitrate: "22050" },
};
class LiveStream {
    private mediaRecorder:InstanceType<typeof MediaRecorder> | null;
    public constraint:IConstraint;
    private toast:ToastFunc;
    private videoRef:HTMLVideoElement;
    public audiobitrate:number;
    private socket:Socket<DefaultEventsMap, DefaultEventsMap>;
    // private checkedRef:HTMLInputElement;
    private state:"stopped" | "ready" | "streaming" | "paused" ;
    alert:(arg:string) => void
    
    constructor(arg:constructorArgsType){
        const {audiobitrate,state,toast,videoRef,constraint} = arg
        this.toast = toast;
        this.alert = arg.alert
        this.videoRef = videoRef;
        this.audiobitrate = audiobitrate;
        this.socket = io("http://127.0.0.1:3001",{
            secure: true, reconnection: true, 
            reconnectionDelay: 1000, timeout:15000, 
            // pingTimeout: 15000,
            //  pingInterval: 45000,
            query: {framespersecond: "15", audioBitrate: "22050"}})
        // this.checkedRef = checkedRef;
        this.state = state
        this.constraint = constraint ||  {
            audio:{
                echoCancellation:true,
                sampleRate:22050
            },
            video:{
                width:{
                    min:100,
                    ideal:240,
                    max:1920
                },
                height:{
                    min:100,
                    ideal:240,
                    max:1080
                },
                framerate:15
            }
        }
        console.log("this is the socket",this.socket)
        this.mediaRecorder = null
    }

    showVideo = (stream:MediaStream) => {
        if("srcObject" in this.videoRef){
            this.videoRef.muted = true;
            this.videoRef.srcObject = stream
        }else{
            (this.videoRef as any).src = window.URL.createObjectURL(stream)
        }
        const that = this
        this.videoRef.addEventListener("loadedmetadata",function(e){
            that.toast({
                messageType:"info",
                title:"Video is ready to be test streamed",
                subtitle:`Successfully setup video streaming @ ${this.width,this.height}`
            })
        },false)
    }

    requestMedia = () => {
        console.log("this is the socket",this.socket)
        navigator.getUserMedia = (navigator.mediaDevices.getUserMedia ||
            (navigator.mediaDevices as any).mozGetUserMedia || 
            (navigator.mediaDevices as any).mszGetUserMedia || 
            (navigator.mediaDevices as any).webkitGetUserMedia)
        if(!navigator.getUserMedia){
            return this.toast({
                messageType:"info",
                title:"No user media Available",
                subtitle:`Unable to get user media`
            })
        }
        navigator.mediaDevices.getUserMedia(this.constraint).then((stream) => {
            this.state = "streaming"
            this.showVideo(stream)
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start(250);
            const that = this
            this.mediaRecorder.onstop = (e) => {
                stream.getTracks().forEach(function(track){
                    track.stop()
                })
                that.state = "stopped"
                this.toast({
                    messageType:"info",
                    title:"The Media Recorder has stopped",
                    subtitle:""
                })
            }
            this.mediaRecorder.onpause = function (e) {}
            this.mediaRecorder.onerror = (evt) => {
                const error = evt.error;
                this.toast({
                    messageType:"error",
                    title:"Something went wrong",
                    subtitle:`Error:${error.name}`
                })
            }
            this.mediaRecorder.ondataavailable = (e) => {
                this.socket.emit("binarystream",e.data)
                this.state = "streaming"
            }
        }).catch(err => {
            this.toast({
                messageType:"error",
                title:"Something went wrong",
                subtitle:`Error:${err}`
            })
        })
    }

    stopStream = () => {
        if(this.mediaRecorder?.state === "recording"){
            this.mediaRecorder.stop()
        }
    }
    connectToServer = () => {
        if(this.mediaRecorder){
            return;
        }
        this.socket.on("connect_timeout", (timeout) => {
            this.alert("state on connection timeout= " + timeout);
            // output_message.innerHTML = "Connection timed out";
            // recordingCircle.style.fill = "gray";
        });
        this.socket.on("error", (error) => {
            this.alert("state on connection error= " + error);
            // output_message.innerHTML = "Connection error";
            // recordingCircle.style.fill = "gray";
        });
    
        this.socket.on("connect_error", () => {
            this.alert("state on connection error= " + this.state);
            // output_message.innerHTML = "Connection Failed";
            // recordingCircle.style.fill = "gray";
        });
    
        this.socket.on("message",  (m) => {
            alert(JSON.stringify(m,null,2))
            this.alert("state on message= " + this.state);
            this.alert("recv server message");
            this.alert("SERVER:" + m);
        });

        this.socket.on("fatal", (m) => {
            this.alert("Fatal ERROR: unexpected:" + m);
            //alert('Error:'+m);
            console.log("fatal socket error!!", m);
            console.log("state on fatal error= " + this.state);
            //already stopped and inactive
            console.log("media recorder restarted");
            // recordingCircle.style.fill = "gray";
    
            //mediaRecorder.start();
            //state="stop";
            //button_start.disabled=true;
            //button_server.disabled=false;
            //document.getElementById('button_start').disabled=true;
            //restart the server
    
            // if (oo.checked) {
            //     //timedCount();
            //     output_message.innerHTML = "server is reload!";
            //     console.log("server is reloading!");
            //     recordingCircle.style.fill = "gray";
            // }
            //should reload?
        });
    
        this.socket.on("ffmpeg_stderr", (m) => {
            //this is the ffmpeg output for each frame
            this.alert("FFMPEG:" + m);
        });
        this.socket.on("disconnect", (reason) => {
            console.log("state disconec= " + this.state);
            this.alert("ERROR: server disconnected!");
            console.log("ERROR: server disconnected!" + reason);
            // recordingCircle.style.fill = "gray";
            //reconnect the server
            this.connectToServer();
    
            //socket.open();
            //mediaRecorder.stop();
            //state="stop";
            //button_start.disabled=true;
            //button_server.disabled=false;
            //	document.getElementById('button_start').disabled=true;
            //var oo=document.getElementById("checkbox_Reconection");
            // if (oo.checked) {
            //     //timedCount();
            //     output_message.innerHTML = "server is reloading!";
            //     console.log("server is reloading!");
            // }
        });
    }
}

export default LiveStream