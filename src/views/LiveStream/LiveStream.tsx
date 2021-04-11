import React from "react"
import axios from "axios"
import { VStack, Text, Heading, Stack, HStack, Textarea, Input, useStyleConfig, FormControl, FormHelperText, FormLabel, Icon, Link, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react"
import { makeStyles, createStyles, Collapse, Box, DialogContent, DialogContentText, DialogTitle, DialogActions } from "@material-ui/core"
import { CreateLayout } from "layouts"
import { Button } from "components/Button"
import { Select, NumberStepper } from "components/Input"
import { Formik, FormikProps } from "formik"
import { RiInformationFill } from "react-icons/ri"
import StreamingService from "core/services/livestream.service"
import MediaService from "./livestreamClass"
import useToast from "utils/Toast"
import { IEvent } from "core/models/Event"
import { getEventByID } from "core/services/activity.service"
import { Dialog } from "components/Dialog"
import useParams from "utils/params"
import {VscLoading} from "react-icons/vsc"
import {primary} from "theme/palette"
import { LiveBroadcast, ILiveStream, ContentDetailBroadcast, SnippetBroadcast } from "core/models/livestreamRequest"


const useStyles = makeStyles((theme) => createStyles({
    root: {
        position:"relative",
        "& p,label": {
            color: "#00000099",
            fontSize: "1rem",
            fontWeight: "bold",
            letterSpacing: "0.15px"
        },
        "& input": {
            borderWidth: "0"
        },
        "& textarea": {
            border: "1px solid rgba(0, 0, 0, .5)",
            padding: 0,
            fontSize: ".95rem",
            flex: 1
        },
        "& select": {
            width: "100%",
            border: "1px solid rgba(0, 0, 0, .5)"
        }
    },
    buttonContainer: {
        width: "100%",
        justifyContent: "space-between",
        "& button": {
            padding: theme.spacing(2, 3)
        },
        "& button:last-child": {
            backgroundColor: "rgba(255, 1, 1, .4)"
        }
    },
    alertContainer: {
        backgroundColor: "rgba(255, 1, 1, .1)",
        padding: theme.spacing(1.5, 2),
        width: "75%",
        borderRadius: "4px",
        "& svg": {
            fontSize: "4rem"
        },
        "& p": {
            fontSize: "0.8rem"
        }
    },
    selectContainer: {
        width: "50%",
        alignItems: "flex-start",
        "& p": {
            alignSelf: "flex-start"
        },
        "& select": {
            borderRadius: "4px"
        },
        "& > div:last-child": {
            marginBottom: "0"
        }
    },
    input: {
        "& input": {
            borderWidth: "1px"
        }
    },
    videoContainer: {
        "& input": {
            backgroundColor: "transparent",
            width: "100%",
            border: "1px solid rgba(0, 0, 0, .5)",
            borderRadius: "4px"
        }
    },
    svg:{
        fontSize:"4rem",
        color:primary
    }
}))

const initialValues = {
    width: 240,
    height: 240,
    frameRate: 15,
    audioBitrate: 22050,
    destination: "https://xd.adobe.com/view/82b278cf-0a76-41ac-8fe1-4bd0559f0788-d7e1/screen/c1590e3a-3e2e-455a-b5c3-674b5309e59e"
}

type FormType = typeof initialValues

const LiveStream = () => {
    const classes = useStyles()
    const date = new Date()
    const toast = useToast()
    const streamService = React.useRef<StreamingService | null>(null)
    const [state, setState] = React.useState<"stopped" | "ready" | "streaming" | "live" | "testing" | "paused" | "complete">("stopped")
    const [streamState,setStreamState] = React.useState<"not-ready" | "starting" | "ready" | "unauthenticated">("not-ready")
    const detailRef = React.useRef<HTMLTextAreaElement>(null)
    const alertRef = React.useRef<HTMLTextAreaElement>(null)
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const [inputValue, setInputValue] = React.useState("")
    const [open, setOpen] = React.useState(false)
    const [showForLive, setShowForLive] = React.useState(false)
    const [broadCast, setCurrentBroadCast] = React.useState<{
        contentDetails: ContentDetailBroadcast;
        etags: string;
        id: string;
        kind: string;
        snippet: SnippetBroadcast
    }>()
    const [liveStream, setLiveStream] = React.useState<ILiveStream>()
    const params = useParams()
    const [event, setEvent] = React.useState<IEvent>({
        churchId: 0,
        description: "",
        endDateTime: date,
        schedule: "",
        speaker: "",
        startDateTime: date,
        title: ""
    })

    const handleSubmit = (values: FormType, { ...actions }) => {

    }

    function showOutput(str: string) {
        if (detailRef.current) {
            detailRef.current.value += "\n" + str;
            detailRef.current.scrollTop = detailRef.current.scrollHeight;
        }
    }
    function showAlert(str: string) {
        if (alertRef.current) {
            alertRef.current.value += "\n" + str;
            alertRef.current.scrollTop = alertRef.current.scrollHeight
        }
    }
    const mediaService = React.useRef<MediaService | null>(null)
    const styles = useStyleConfig("Input", {})

    let streamInterval: NodeJS.Timeout;
    let broadCastInterval: NodeJS.Timeout;

    const handleToggle = () => {
        setOpen(!open)
    }


    React.useEffect(() => {
        mediaService.current = new MediaService({
            toast: toast,
            videoRef: videoRef.current as HTMLVideoElement,
            state,
            audiobitrate: initialValues.audioBitrate,
            alert: showOutput
        })
        streamService.current = new StreamingService({
            toast:toast,
            state:streamState,
            setState:setStreamState
        })
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get("eventId") || ""
        const cancelToken = axios.CancelToken.source()
        const getChurchEvent = async () => {
            getEventByID(eventId, cancelToken).then(payload => {
                setEvent(payload.data)
            }).catch(err => {
                if (!axios.isCancel(err)) {
                    toast({
                        title: "Unable to get Church Event",
                        subtitle: `Error : ${err}`,
                        messageType: "error"
                    })
                }
            })
        }

        if (eventId) {
            getChurchEvent()
        } else {
            toast({
                title: "Unable to get Event Id",
                subtitle: "Unable to retrieve event id from url",
                messageType: "error"
            })
        }

    }, [])

    // Gets the detail about the broadcast from the google API
    const connectToServer = async () => {
        showAlert("Requesting Broadcast detail")
        // Getting the broadcast detail
        const broadCastResponse = await streamService.current?.getBroadCastDetail(params.broadcastId)
        showAlert("Successfully Received Broadcast detail")
        if (!broadCastResponse?.items && !broadCastResponse?.items[0]) {
            toast({
                messageType: "info",
                subtitle: "Unable to get broadcast detail",
                title: "Unsucessful request"
            })
        }
        const newStream = {
            "part": ["snippet", "status", "contentDetails", "cdn"] as any,
            "resource": {
                "cdn": {
                    "frameRate": "60fps",
                    "resolution": "1080p",
                    "ingestionType": "rtmp"
                },
                snippet: {
                    title: event.title,
                    description: event.description
                },
                contentDetails: {
                    isReusable: true
                },
                status: {
                    streamStatus: "inactive"
                }
            }
        } as any
        setCurrentBroadCast(broadCastResponse?.items[0])
        mediaService.current?.connectToServer()
        setState("ready")
        // Create a new stream for the recording
        const liveStreamResponse = await streamService.current?.createLiveStream(newStream)
        setLiveStream(liveStreamResponse)
        showAlert("Completed creating new stream")
        setState("ready")
        if (!liveStreamResponse?.cdn.ingestionInfo) {
            return showAlert("Unable to get streaming link")
        }
        const rtmpUrl = `${liveStreamResponse.cdn.ingestionInfo!.ingestionAddress}/${liveStreamResponse.cdn.ingestionInfo!.streamName}`
        setInputValue(rtmpUrl)
    }

    async function getCurrentStreamDetail() {
        return new Promise(async (resolve, reject) => {
            try {
                if (!liveStream || !liveStream.id) {
                    return toast({
                        messageType: "info",
                        subtitle: "Unable to access stream detail",
                        title: "Unable to complete action",
                        duration: 7500
                    })
                }
                const currentStreamDataResponse = await streamService.current!.getStreamDetail(liveStream.id)

                showAlert(`Stream Status ${JSON.stringify(currentStreamDataResponse?.items[0]?.status, null, 2)}`)
                console.log("this is the current stream", currentStreamDataResponse)

                if (currentStreamDataResponse?.items[0]?.status.streamStatus === "active") {
                    setState("streaming")
                    showAlert("Video is streaming successfully")
                    clearInterval(streamInterval)
                    resolve(showAlert("Successfully connected to encoding server"))
                }
            } catch (err) {
                reject(err)
            }
        })
    }

    async function getCurrentBroadcastDetail(status:"testing" | "live" | "complete") {
        broadCastInterval = setInterval(getBroadcastDetail, 3000)

        async function getBroadcastDetail() {
            const recentBroadCastDetail = await streamService.current?.getBroadCastDetail(broadCast!.id)
            if (!recentBroadCastDetail) {
                return toast({
                    messageType: "info",
                    subtitle: "Unable to access broadcast detail",
                    title: "Unable to complete action",
                    duration: 7500
                })
            }
            // console.log(JSON.stringify(recentBroadCastDetail.items[0],null,2))
            showAlert(`BroadCast Status ${JSON.stringify(recentBroadCastDetail.items[0].status, null, 2)}`)
            if (recentBroadCastDetail.items[0].status.lifeCycleStatus === status) {
                showAlert(`Video is ${status} succesful`)
                clearInterval(broadCastInterval)
                setState(status)
            }
        }
    }
    const startStreaming = async () => {
        try {
            // Create the new Stream
            showAlert("Creating new stream")
            // Requesting access to the user media
            mediaService.current?.requestMedia(inputValue)
            showAlert("Successfully Requested media from user")
            streamInterval = setInterval(getCurrentStreamDetail, 3000);

        } catch (err) {
            console.log(err)
        }
    }

    const transitionToTest = async () => {
        if (!broadCast?.id || !liveStream?.id) {
            return toast({
                messageType: "info",
                subtitle: "Broadcast and stream details have not been set",
                title: "Unable to complete action"
            })
        }
        try {
            showAlert("Binding stream to broadcast")
            // Bind the stream to the broadcast
            const bindStreamToBroadcast = await streamService.current?.bindStreamToBroadCast({
                broadCastId: broadCast.id,
                streamId: liveStream.id
            })
            showAlert(`Completed binding stream to broadcast,${JSON.stringify(bindStreamToBroadcast, null, 2)}`)
            showAlert(`Transitioning broadcast to testing`)
            // Transition to test
            const transition = await streamService.current?.transitionBroadCast({
                broadCastId: broadCast.id,
                broadcastStatus: "testing"
            })
            showAlert(`Completed transition ${JSON.stringify(transition, null, 2)}`)
            getCurrentBroadcastDetail("testing")
        } catch (err) {
            toast({
                messageType: "error",
                title: err.message,
                subtitle: "Unable to complete request"
            })
        }
    }

    const transitionToLive = async () => {
        setOpen(false)
        if (!broadCast?.id || !liveStream?.id) {
            return toast({
                messageType: "info",
                subtitle: "Broadcast and stream details have not been set",
                title: "Unable to complete action"
            })
        }
        try {
            // Transition to test
            const transition = await streamService.current?.transitionBroadCast({
                broadCastId: broadCast.id,
                broadcastStatus: "live"
            })
            showAlert(`Completed transition ${JSON.stringify(transition, null, 2)}`)
            getCurrentBroadcastDetail("live")
        } catch (err) {
            toast({
                messageType: "error",
                title: err.message,
                subtitle: "Unable to complete request"
            })
        }
    }
    const transitionToComplete = async () => {
        setOpen(false)
        if (!broadCast?.id || !liveStream?.id) {
            return toast({
                messageType: "info",
                subtitle: "Broadcast and stream details have not been set",
                title: "Unable to complete action"
            })
        }
        try {
            // Transition to test
            const transition = await streamService.current?.transitionBroadCast({
                broadCastId: broadCast.id,
                broadcastStatus: "complete"
            })
            showAlert(`Completed transition ${JSON.stringify(transition, null, 2)}`)
            getCurrentBroadcastDetail("complete")
        } catch (err) {
            toast({
                messageType: "error",
                title: err.message,
                subtitle: "Unable to complete request"
            })
        }
    }
    const showLiveDialog = async () => {
        setShowForLive(true)
        setOpen(true)
    }
    const showCompleteDialog = async () => {
        setShowForLive(false)
        setOpen(true)
    }
    const stopStreaming = () => {
        mediaService.current?.stopStream()
        transitionToComplete()
        handleToggle()
    }

    const loginToGoogle = () => {
        streamService.current?.authenticate().then(() => {
            setStreamState("ready")
        }).catch((err:any) => {
            toast({
                messageType:"info",
                title:"Something went wrong",
                subtitle:`Error:${err}`
            })
        })
    }
    return (
        <>
            <Dialog open={open} close={handleToggle} >
                {showForLive ? 
            <ModalContent>
                <ModalBody display="flex" flexDirection="column"
                    justifyContent="center" alignItems="center">
                    <Heading textAlign="center">
                        Once you go Live, You can't go back
                    </Heading>
                </ModalBody>
                <ModalFooter display="flex" justifyContent="center" >
                    <Button variant="outline" onClick={handleToggle}>
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={transitionToLive}>
                        Continue
                    </Button>
                </ModalFooter>
            </ModalContent> : 
            <ModalContent>
            <ModalBody display="flex" flexDirection="column"
                justifyContent="center" alignItems="center">
                <Heading textAlign="center">
                    Once you Click Complete Stream, You can't go back
                </Heading>
            </ModalBody>
            <ModalFooter display="flex" justifyContent="center" >
                <Button variant="outline" onClick={handleToggle}>
                    Cancel
                </Button>
                <Button variant="outline" onClick={stopStreaming}>
                    Complete Stream
                </Button>
            </ModalFooter>
        </ModalContent>    
            }
            </Dialog>
            <VStack pl={{ base: 2, md: 12 }} pt={{ md: 6 }}
                className={classes.root} >
                    <VStack bg="rgba(0,0,0,.5)" zIndex={3}
                    display={streamState !== "ready" ? "flex" : "none"} alignItems="center" justifyContent="center"
                     position="absolute" w="100%" h="100%"
                     >
                         {streamState === "not-ready" && 
                            <VscLoading className={`App-logo ${classes.svg}`} />
                         }
                         {streamState === "unauthenticated" && 
                         <Button onClick={loginToGoogle}>
                            Please Login to Continue
                        </Button>
                         }
                     </VStack>
                <Heading textStyle="h4" >
                    Live Stream Service
                </Heading>
                <CreateLayout>
                    <VStack>
                        <Stack className={classes.buttonContainer} direction={{ md: "row" }}>
                            <Button onClick={connectToServer} disabled={state !== "stopped"}>
                                Connect Server
                        </Button>
                            <Button onClick={startStreaming} disabled={state !== "ready"}>
                                Start Streaming
                        </Button>
                            {
                                state === "live" ? 
                                <Button onClick={showCompleteDialog}>
                                    Complete Streaming
                                </Button>
                                 :
                                <Button onClick={mediaService.current?.stopStream}
                                 disabled={state === "stopped"}>
                                    Stop Streaming
                                </Button>
                            }
                        </Stack>
                        <Collapse in={state === "streaming" || state === "testing"}>
                            <HStack>
                                <Button variant="outline" disabled={state === "testing"} onClick={transitionToTest}>
                                    Start Test
                            </Button>
                                <Button onClick={showLiveDialog} variant="outline">
                                    Go Live
                            </Button>
                            </HStack>
                        </Collapse>
                    </VStack>
                    {/* <Collapse> */}
                    <Box className={classes.videoContainer}>
                        <video autoPlay={true} ref={videoRef} />
                        <FormControl id="rtmpLink">
                            <FormLabel>RTMP streaming url</FormLabel>
                            <Input readOnly value={inputValue} />
                            <FormHelperText>Stream media to this url</FormHelperText>
                        </FormControl>
                    </Box>
                    {/* </Collapse> */}
                    {/* <Collapse in={state !== "streaming"}>
                    <VStack width="75%">
                        <Formik initialValues={initialValues}
                            onSubmit={handleSubmit}
                        >
                            {(formikProps: FormikProps<FormType>) => (
                                <>
                                    <VStack w="100%" alignItems="flex-start">
                                        <Text>
                                            Video Panel Size
                                </Text>
                                        <HStack w="100%" justifyContent="space-between">
                                            <NumberStepper label="Video Panel Size" name="width" />
                                            <Text>
                                                BY
                                    </Text>
                                            <NumberStepper name="height" />
                                        </HStack>
                                    </VStack>
                                    <HStack w="100%" my="4" justifyContent="space-between">
                                        <VStack alignItems="flex-start">
                                            <Text>
                                                Video Frame Rate
                                    </Text>
                                            <NumberStepper name="frameRate" />
                                        </VStack>
                                        <VStack className={classes.selectContainer}>
                                            <Text>
                                                Audio bitrate
                                    </Text>
                                            <Select placeholder="" name="audioBitrate">
                                                <option value={22050}>
                                                    22050
                                        </option>
                                                <option value={44100}>
                                                    44100
                                        </option>
                                                <option value={11025}>
                                                    11025
                                        </option>
                                            </Select>
                                        </VStack>
                                    </HStack>
                                    <FormControl id="email">
                                        <FormLabel>RTMP streaming url</FormLabel>
                                        <Input readOnly value={inputValue} />
                                        <FormHelperText>Stream media to this url</FormHelperText>
                                    </FormControl>
                                </>
                            )}
                        </Formik>
                    </VStack>
                </Collapse> */}
                    <HStack className={classes.alertContainer}>
                        <RiInformationFill />
                        <Text>
                            Hint: Keep an eye on the encoding detail window, the encoding value must stay above 1x,
                            or your stream will start to lag. Use a smaller screen size, or change the frame
                            rate in the Constraints variable.
                                </Text>
                    </HStack>
                    <HStack w="100%" h="40vh">
                        <VStack w="100%" h="100%">
                            <Text alignSelf="flex-start">
                                Encoding Detail
                                    </Text>
                            <Textarea ref={detailRef} isReadOnly rows={4} size="lg" />
                        </VStack>
                        <VStack w="100%" h="100%">
                            <Text alignSelf="flex-start">
                                Alert
                        </Text>
                            <Textarea ref={alertRef} isReadOnly rows={4} size="lg" />
                        </VStack>
                    </HStack>
                </CreateLayout>
            </VStack>
        </>
    )
}

export default LiveStream