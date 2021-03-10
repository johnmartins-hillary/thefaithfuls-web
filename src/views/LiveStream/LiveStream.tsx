import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { VStack, Box, Text } from "@chakra-ui/react"
import { Button } from "components/Button"
import NewStream from "./livestreamClass"
import useToast from "utils/Toast"
import {NormalNumberStepper} from "components/Input"
// import "./styles.css"

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {},
    settingContainer:{
        [theme.breakpoints.up("sm")]:{
            width:"50%",
            maxWidth:"50rem"
        }
    }
}))


const LiveStream = () => {
    const classes = useStyles()
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
    // const [value, setValue] = React.useState(0)
    // const handleChange = (value:number) => setValue(value)
    const [state,setState] = React.useState<"ready" | "stop">("stop")
    const checkedRef = React.useRef<HTMLInputElement>(null)
    const toast = useToast()
    const [newLiveStream,setNewLiveStream] = React.useState<InstanceType<typeof NewStream> | null>(null)
    const [value, setValue] = React.useState({
        height:24,
        width:24
    })
    const handleChange = (name:"height" | "width") =>  (newValue:string | number) => setValue({
        ...value,
        [name]:Number(newValue)
    })
    const handleWidth = handleChange("width")
    const handleHeight = handleChange("height")
  

    React.useEffect(() => {
        if(videoRef.current){
            const currentLiveStream = new NewStream({
                audiobitrate:15,
                checkedRef:checkedRef.current!,
                toast,
                videoRef:videoRef.current,
            })
            setNewLiveStream(currentLiveStream)
        }
    },[videoRef.current,textAreaRef.current])
    React.useEffect(() => {
        if(newLiveStream !== null){
            setState("ready")
        }
    },[newLiveStream])
    
    return (
        <>
        <VStack className={classes.root} >
        <VStack style={{
            display:state === "ready" ? "none" : "flex",
            position:"absolute",
            width:"100%",
            height:"100%",
            background:"rgba(0,0,0,.5)",
            zIndex:10,
            justifyContent:"center",
            alignItems:"center"
        }} >
            <Text fontSize="2rem" fontFamily="Bahnschrift" color="white">
                Loading...
            </Text>
        </VStack>
            <header>
                <h1>Live Stream Service</h1>
            </header>
            <Box className="video-pane">
                <br />
                <Box className="btn">
                    <Button onClick={newLiveStream?.connectToServer}
                     variant="outline" id="Button_start" >
                         Start Streaming
                    </Button>
                    <Button onClick={newLiveStream?.stopStream} id="Button_stop" >Stop Streaming</Button>
                </Box>
                <br />
                <hr />
                <Box className="video">
                    <video id="output_video" ref={videoRef}
                        autoPlay={true}/>
                </Box>
            </Box>
            <Box className={classes.settingContainer}>
                <Box>
                    <NormalNumberStepper maxValue={100} onChange={handleWidth}
                     minValue={10} value={value.width} label={
                         `Select the Video Pane Width:${value.width*10}`
                     }
                    />
                    <Box my={3} />
                    <NormalNumberStepper maxValue={100} onChange={handleHeight}
                     minValue={10} value={value.height} label={
                        `Select the Video Pane Height:${value.height*10}`
                     }
                    />
                </Box>
                <br/>
                <Box className="control-wrapper">
                    <Box>
                        {/* <p className="label" htmlFor="option_framerate">Audio bitrate:</p> */}
                        <p className="label">Audio bitrate:</p>
                    </Box>
                    <Box>
                        <select className="form select" id="option_bitrate">
                            <option value="22050">22050</option>
                            <option value="44100">44100</option>
                            <option value="11025">11025</option>
                        </select>
                    </Box>
                    
                </Box>
            </Box>
        </VStack>
    </>
    )
}

export default LiveStream