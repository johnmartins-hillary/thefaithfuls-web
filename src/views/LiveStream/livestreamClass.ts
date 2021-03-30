import {ToastFunc} from "utils/Toast"

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
    checkedRef:HTMLInputElement;
    constraint?:IConstraint;
    state?:"stop" | "ready";
}

class LiveStream {
    private mediaRecorder:InstanceType<typeof MediaRecorder> | null;
    public constraint:IConstraint;
    private toast:ToastFunc;
    private videoRef:HTMLVideoElement;
    public audiobitrate:number;
    private checkedRef:HTMLInputElement;
    private state:"stop" | "start" | "streaming" | "ready" | "preparing" ;
    
    constructor(arg:constructorArgsType){
        const {audiobitrate,checkedRef,state,toast,videoRef,constraint} = arg
        this.toast = toast;
        this.videoRef = videoRef;
        this.audiobitrate = audiobitrate;
        this.checkedRef = checkedRef;
        this.state = state || "ready"
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
        navigator.mediaDevices.getUserMedia(this.constraint).then((stream) => {
            this.state = "streaming"
            this.showVideo(stream)
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start(250);
            const that = this
            this.mediaRecorder.onstop = (e) => {
                stream.getTracks().forEach(function(track){
                    that.state = "stop"
                    track.stop()
                })
                this.toast({
                    messageType:"info",
                    title:"The Media Recorder has stopped",
                    subtitle:""
                })
            }
            this.mediaRecorder.ondataavailable = function(e){
                
            }
            this.mediaRecorder.onerror = (evt) => {
                const error = evt.error;
                this.toast({
                    messageType:"error",
                    title:"Something went wrong",
                    subtitle:`Error:${error.name}`
                })
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
        if(!this.mediaRecorder){
            navigator.getUserMedia = (navigator.mediaDevices.getUserMedia ||
                (navigator.mediaDevices as any).mozGetUserMedia || 
                (navigator.mediaDevices as any).mszGetUserMedia || 
                (navigator.mediaDevices as any).webkitGetUserMedia)
            if(!navigator.getUserMedia){
                this.toast({
                    messageType:"info",
                    title:"No user media Available",
                    subtitle:`Unable to get user media`
                })
            }else{
                this.requestMedia()
            }
        }
    }
    timedCount = () => {
        if(this.checkedRef.checked){
            this.toast({
                messageType:"info",
                title:"Timed count state",
                subtitle:this.state
            })
            if(this.state === "ready"){
                this.connectToServer()
            }else{
                const t = setTimeout("timedCount",1000)
                this.connectToServer()
                
            }
        }
    }
}

export default LiveStream