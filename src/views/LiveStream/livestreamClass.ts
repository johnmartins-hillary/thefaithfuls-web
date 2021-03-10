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
    private state:"stop" | "ready";
    
    // toast:ToastFunc;
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
        console.log("Calling the show video function",stream)
        if("srcObject" in this.videoRef){
            console.log("this is the videoRef",this.videoRef.srcObject)
            this.videoRef.muted = true;
            this.videoRef.srcObject = stream
            console.log("this is the videoRef",this.videoRef.srcObject)
        }else{
            console.log("this is the stream",stream);

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

    showOutput = (str:string) => {
        // this.textAreaRef.value = "\n"+str;
        // this.textAreaRef.scrollTop = this.textAreaRef.scrollHeight;
    }
    requestMedia = () => {
        console.log("this is the constraint",this.constraint)
        navigator.mediaDevices.getUserMedia(this.constraint).then((stream) => {
            this.showVideo(stream)
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start(250);
            this.mediaRecorder.onstop = (e) => {
                this.toast({
                    messageType:"info",
                    title:"The Media Recorder has stopped",
                    subtitle:""
                })
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