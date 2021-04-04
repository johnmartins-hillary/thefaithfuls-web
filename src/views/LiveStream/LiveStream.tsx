import React from "react"
import axios from "axios"
import { VStack, Text, Heading, Stack, HStack, Textarea, Input, useStyleConfig, FormControl, FormHelperText, FormLabel } from "@chakra-ui/react"
import { makeStyles, createStyles, Collapse } from "@material-ui/core"
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
import useParams from "utils/params"
import { LiveBroadcast, ILiveStream, ContentDetailBroadcast, SnippetBroadcast } from "core/models/livestreamRequest"
import io from "socket.io-client"


const useStyles = makeStyles((theme) => createStyles({
    root: {
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
const socketOptions = {
    secure: true, reconnection: true, reconnectionDelay: 1000,rejectUnauthorized:false, 
    timeout: 15000, pingTimeout: 15000, pingInterval: 45000, 
    query: { framespersecond: "15", audioBitrate: "22050" }
};
const socket = io("http://localhost:3000", socketOptions)

const LiveStream = () => {
    const classes = useStyles()
    const date = new Date()
    const toast = useToast()
    const streamService = new StreamingService(toast)
    const [state, setState] = React.useState<"stopped" | "ready" | "streaming" | "paused">("stopped")
    const detailRef = React.useRef<HTMLTextAreaElement>(null)
    const alertRef = React.useRef<HTMLTextAreaElement>(null)
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const [inputValue, setInputValue] = React.useState("")
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
    // const mediaService = new MediaService({
    //     toast: toast,
    //     videoRef: videoRef.current as HTMLVideoElement,
    //     state,
    //     audiobitrate: initialValues.audioBitrate,
    //     alert: showOutput
    // })
    const styles = useStyleConfig("Input", {})

    socket.on('error', function () {
        console.log("Sorry, there seems to be an issue with the connection!");
    });

    socket.on('connect_error', function (err) {
        console.log("connect failed" + err);
    });

    socket.on('connection', function () {
        console.log("connected");
        socket.on('newPhoto', function () {
        });
    });
    socket.on('connect', function () {
        console.log("connected");
        socket.on('newPhoto', function () {
        });
    });

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get("eventId") || ""

        socket.emit("newUser", "JOined onnncection")
        console.log("this is the socket", socket)

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

        // getBroadcastDetail()

    }, [])

    // Gets the detail about the broadcast from the google API
    const connectToServer = async () => {
        showAlert("Requesting Broadcast detail")
        const broadCastResponse = await streamService.getBroadCastDetail(params.broadcastId)
        showAlert("Successfully Received Broadcast detail")
        if (broadCastResponse?.items && broadCastResponse?.items[0]) {
            setCurrentBroadCast(broadCastResponse?.items[0])
            setState("ready")
        }
    }

    const startStreaming = async () => {
        // Create the new Stream
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

        showAlert("Creating new stream")
        const liveStreamResponse = await streamService.createLiveStream(newStream)
        setLiveStream(liveStreamResponse)
        showAlert("Completed creating new stream")
        setState("ready")
        if (!liveStreamResponse?.cdn.ingestionInfo) {
            return showAlert("Unable to get streaming link")
        }
        const rtmpUrl = `${liveStreamResponse.cdn.ingestionInfo!.ingestionAddress}/${liveStreamResponse.cdn.ingestionInfo!.streamName}`
        setInputValue(rtmpUrl)
        // mediaService.requestMedia()
        setState("streaming")
        showAlert("Successfully Requested media from user")
        // mediaService.connectToServer()
        showAlert("Successfully connected to encoding server")
        // showAlert("Goin To Testing stage")
        // Request access to the user media
    }




    return (
        <VStack pl={{ base: 2, md: 12 }} pt={{ md: 6 }}
            className={classes.root} >
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
                        <Button disabled={state !== "streaming"}>
                            Stop Streaming
                        </Button>
                    </Stack>
                    <Collapse in={state === "streaming"}>
                        <HStack>
                            <Button variant="outline">
                                Start Test
                            </Button>
                            <Button variant="outline">
                                Go Live
                            </Button>
                        </HStack>
                    </Collapse>
                </VStack>
                {/* <Collapse> */}
                <video autoPlay={true} />
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
                <HStack w="100%">
                    <VStack w="100%">
                        <Text alignSelf="flex-start">
                            Encoding Detail
                                    </Text>
                        <Textarea ref={detailRef} isReadOnly rows={4} size="lg" />
                    </VStack>
                    <VStack w="100%">
                        <Text alignSelf="flex-start">
                            Alert
                        </Text>
                        <Textarea ref={alertRef} isReadOnly rows={4} size="lg" />
                    </VStack>
                </HStack>
            </CreateLayout>
        </VStack>
    )
}

export default LiveStream