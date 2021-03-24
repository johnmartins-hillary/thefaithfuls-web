import React from "react"
import { Link } from "react-router-dom"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Box, Text,Flex, Heading, Icon,
     Menu, MenuButton, MenuItem, MenuList, Stack, StackDivider, AspectRatio } from "@chakra-ui/react"
import { Button } from "components/Button"
import NewStream from "./livestreamClass"
import GoogleService from "core/services/livestream.service"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { LiveBroadcast, LiveStreamChurchResponse,LiveStream as LiveStreamModel} from "core/models/livestreamRequest"
import axios from "axios"
import { OutlineCard, GroupCard} from "components/Card"
import { NoContent } from "components/NoContent"
import { CgMoreAlt } from "react-icons/cg"
import { FcStart } from "react-icons/fc"
import { BiStopCircle } from "react-icons/bi"

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(3),
        display: "flex",
        "& > div:nth-child(2)": {

        },
        "& > div:nth-child(3)": {

        }
    },
    settingContainer: {
        [theme.breakpoints.up("sm")]: {
            width: "50%",
            maxWidth: "50rem"
        }
    },
    videoContainer: {
        backgroundColor: "white"
    },
    groupMemberContainer: {
        "& h6": {
            fontFamily: "Bahnschrift !important"
        },
        "& p": {
            fontFamily: "MontserratRegular !important"
        }
    },
    descriptionContainer: {
        "& p": {
            letterSpacing: "0.02rem",
            fontFamily: "MontserratRegular !important",
            color: "secondary",
            maxWidth: "2xl",
            fontSize: '1rem'
        }
    }
}))


const LiveStream = () => {
    const classes = useStyles()
    const toast = useToast()
    const streamService = new GoogleService(toast)
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const [pendingBroadCast, setPendingBroadCast] = React.useState<LiveStreamChurchResponse[]>([])
    const [selectedStream, setSelectedStream] = React.useState<LiveStreamChurchResponse>()
    const [state, setState] = React.useState<"ready" | "preparing" | "stop">("stop")
    const params = useParams()
    const checkedRef = React.useRef<HTMLInputElement>(null)
    const [newLiveStream, setNewLiveStream] = React.useState<InstanceType<typeof NewStream> | null>(null)
    const [currentBroadCastDetail,setCurrentBroadCastDetail] = React.useState<LiveBroadcast | null>(null)
    const [currentLiveStream,setCurrentLiveStream] = React.useState<LiveStreamModel | null>()
   
    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()

        const apiCall = async () => {
            try {
                const response = await streamService.getChurchPendingBroadcast(params.churchId as any, cancelToken)
                setPendingBroadCast(response.data)
            } catch (err) {
                if (!axios.isCancel(err)) {
                    toast({
                        title: "Unable to get Church Event",
                        subtitle: `Error : ${err}`,
                        messageType: "error"
                    })
                }
            }
        }
        apiCall()
        return () => {
            cancelToken.cancel()
        }
    }, [])

    // Set the current selected broadcast
    React.useEffect(() => {
        if(pendingBroadCast && pendingBroadCast[0]){
            setSelectedStream(pendingBroadCast[0])
        }
    },[pendingBroadCast])

    // Create the current stream
    React.useEffect(() => {
        setState("stop")
        if (videoRef.current) {
            const currentLiveStream = new NewStream({
                audiobitrate: 15,
                checkedRef: checkedRef.current!,
                toast,
                videoRef: videoRef.current,
            })
            setNewLiveStream(currentLiveStream)
        }
    }, [videoRef.current])
    
    React.useEffect(() => {
        if (newLiveStream !== null) {
            setState("ready")
        }
    }, [newLiveStream])

    // 1. Get the detail about the current broadcast
    React.useEffect(() => {
        console.log("Calling this functiin")
        const apiBroadCastCall = async () => {
            if(selectedStream?.liveBroadcastID.length){
                const broadCastDetail = await streamService.getBroadCastDetail(selectedStream!.liveBroadcastID)
                if(broadCastDetail?.items[0]){
                    setCurrentBroadCastDetail(broadCastDetail.items[0])
                }
            }
        }
        const apiStreamCall = async () => {
            if(selectedStream?.liveStreamID.length){
                const liveStreamDetail = await streamService.getStreamDetail(selectedStream.liveStreamID)
                if(liveStreamDetail?.items[0]){
                    setCurrentLiveStream(liveStreamDetail.items[0])
                }
            }
        }
        apiBroadCastCall()
        apiStreamCall()
    },[selectedStream])

    // 2. Use the current broadcast detail to add an iframe to view
    React.useEffect(() => {
        if(currentBroadCastDetail?.contentDetails.monitorStream.embedHtml){
            const {embedHtml} = currentBroadCastDetail.contentDetails.monitorStream
            const foundContainer = document.getElementById("iframeContainer")
            if(foundContainer){
                if(foundContainer.childNodes){
                    foundContainer.childNodes.forEach(item => {
                        item.remove()
                    })
                }
                const range = document.createRange();
                range.selectNodeContents(foundContainer)
                const frag = range.createContextualFragment(embedHtml)
                foundContainer.appendChild(frag)
            }
        }

    },[currentBroadCastDetail])

    console.log("this is the current live stream",currentLiveStream)

    const changeActive = (broadcast: LiveStreamChurchResponse) => () => {
        setSelectedStream(broadcast)
    }
    const handleStatusChange = (status:"testing" | "live") => async () => {
        try{
            const response = streamService.changeBroadCastStatus({
                broadCastId:selectedStream!.liveBroadcastID,
                cdn:{
                    frameRate:"60fps",
                    ingestionType:"rtmp",
                    resolution:"1080p"
                },
                snippet:{
                    title:selectedStream!.title,
                    description:selectedStream!.description
                },
                status,
                streamStatus:{
                    streamStatus:"active"
                }
            })
            toast({
                messageType:"info",
                title:`Broadcast is now at the ${status} stage`,
                subtitle:""
            })
        }catch(err){
            toast({
                messageType:"error",
                subtitle:`Error:${err.message}`,
                title:"Something went wrong"
            })
        }
    }

    // console.log("this is the selected stream",selectedStream)
    // console.log("this is the selected stream",selectedStream)

    return (
        <Flex direction={["column", "column", "row"]} className={classes.root}>
            <Flex flex={3} bgColor="#F3F3F3" maxWidth={{ md: "md" }}
                direction="column" height="100vh" >
                <Link to={`/church/${params.churchId}/event/create`} >
                    <Button>
                        Create Livestream
                    </Button>
                </Link>
                <Heading color="primary" >
                    Church LiveStream
                </Heading>
                <Stack spacing={3} maxHeight={["30vh", "30vh", "75vh", "auto"]}
                    overflowY="auto">
                    {pendingBroadCast.length > 0 ?
                        pendingBroadCast.map((item, idx) => (
                            <OutlineCard cursor="pointer" key={idx}
                                onClick={changeActive(item)}
                                active={selectedStream?.liveBroadcastID === item.liveBroadcastID} >
                                <GroupCard member={(new Date(item.scheduledStartTime)).toLocaleString() as any} imgSrc={"https://images.unsplash.com/photo-1613758403772-268da019247a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80"}
                                    active={item.status === "IsLive"} name={item.title} width="95%"
                                />
                            </OutlineCard>
                        )) : <Text>No Pending BroadCast Available</Text>}
                </Stack>
            </Flex>
            <Flex flex={5} flexShrink={5} pt="10" pl={{ base: 0, md: 5 }} bgColor="#F9F5F9">
                {
                    pendingBroadCast.length > 0 ?
                        <Stack spacing={5} width={["95%", "75%"]} maxWidth={{ md: "3xl" }}
                            divider={<StackDivider borderColor="gray.200" />}>
                            <Flex className={classes.groupMemberContainer} justify="space-between">
                                <Box>
                                    <Text fontSize="1rem" opacity={.4} color="secondary" >
                                        Broadcast Name
                                    </Text>
                                    <Heading fontSize="1.5rem" fontWeight={600} letterSpacing="0.48px" color="tertiary">
                                        {selectedStream?.title}
                                    </Heading>
                                    <Box className={classes.descriptionContainer}>
                                        <Heading as="h6" fontSize="1rem" opacity={0.4} color="secondary" >
                                            Group Description
                                        </Heading>
                                        <Text>
                                            {selectedStream?.description}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Heading as="h6" fontSize="1rem" opacity={0.4} color="secondary" >
                                            Schedule Period
                                        </Heading>
                                        <Text>
                                            {
                                                selectedStream?.scheduledEndTime && selectedStream.scheduledStartTime &&
                                            `${(new Date(selectedStream.scheduledStartTime)).toDateString()} - 
                                                ${(new Date(selectedStream.scheduledEndTime)).toDateString()}
                                            `
                                            }
                                        </Text>
                                    </Box>
                                </Box>
                                {
                                    selectedStream?.liveBroadcastID &&
                                    <Menu>
                                        <MenuButton disabled={state === "stop"} >
                                            <Icon bgColor="primary" color="white"
                                                boxSize="2.5rem" as={CgMoreAlt}
                                                borderRadius="50%" />
                                        </MenuButton>
                                        <MenuList disabled={state == "stop"} >
                                            <MenuItem onClick={newLiveStream?.connectToServer as any}>
                                                <Icon as={FcStart} />
                                                <Text>Start Stream</Text>
                                            </MenuItem>
                                            <MenuItem onClick={newLiveStream?.stopStream as any}>
                                                <Icon as={BiStopCircle} />
                                                <Text>Stop Stream</Text>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                }
                            </Flex>
                            <Box id="iframeContainer"/>
                            <Box>
                                <Button onClick={handleStatusChange("testing")}>
                                    Start Testing
                                </Button>
                                <Button ml={3} variant="outline" onClick={handleStatusChange("live")} >
                                    Go Live
                                </Button>
                            </Box>
                        </Stack> :
                        <NoContent>
                            <Text color="primary">
                                No Pending Broad Cast yet
                            </Text>
                            <Button>
                                <Link to="groups/create" >
                                    Add Event Broadcast
                                </Link>
                            </Button>
                        </NoContent>
                }
            </Flex>
        </Flex>
    )
}

export default LiveStream