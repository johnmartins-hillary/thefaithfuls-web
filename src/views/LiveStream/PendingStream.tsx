import React from "react"
import { Link } from "react-router-dom"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Box, Text,Flex, Heading, Icon,
     Menu, MenuButton, MenuItem, MenuList, Stack, StackDivider, AspectRatio } from "@chakra-ui/react"
import { Button } from "components/Button"
import GoogleService from "core/services/livestream.service"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { LiveBroadcast, LiveStreamChurchResponse} from "core/models/livestreamRequest"
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


const PendingStream = () => {
    const classes = useStyles()
    const toast = useToast()
    const [streamState,setStreamState] = React.useState<"not-ready" | "starting" | "ready" | "unauthenticated">("not-ready")
    const streamService = new GoogleService({
        toast,
        state:streamState,
        setState:setStreamState
    })
    const [pendingBroadCast, setPendingBroadCast] = React.useState<LiveStreamChurchResponse[]>([])
    const [selectedStream, setSelectedStream] = React.useState<LiveStreamChurchResponse>()
    const [state, setState] = React.useState<"ready" | "preparing" | "stop">("stop")
    const params = useParams()
    const [currentBroadCastDetail,setCurrentBroadCastDetail] = React.useState<LiveBroadcast | null>(null)
   
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

    const changeActive = (broadcast: LiveStreamChurchResponse) => () => {
        setSelectedStream(broadcast)
    }
    return (
        <Flex direction={["column", "column", "row"]} className={classes.root}>
            <Flex flex={3} bgColor="#F3F3F3" maxWidth={{ md: "md" }}
                direction="column" p={4} height="100vh" >
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
                                {/* {
                                    selectedStream?.liveBroadcastID &&
                                    <Menu>
                                        <MenuButton disabled={state === "stop"} >
                                            <Icon bgColor="primary" color="white"
                                                boxSize="2.5rem" as={CgMoreAlt}
                                                borderRadius="50%" />
                                        </MenuButton>
                                        <MenuList disabled={state == "stop"} >
                                            <MenuItem>
                                                <Icon as={FcStart} />
                                                <Text>Start Stream</Text>
                                            </MenuItem>
                                            <MenuItem>
                                                <Icon as={BiStopCircle} />
                                                <Text>Stop Stream</Text>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                } */}
                            </Flex>
                            <Box>
                                <Link to={`/church/${params.churchId}/livestream/${selectedStream?.liveBroadcastID}?eventId=${selectedStream?.eventId}`}>
                                    <Button>
                                        Start Testing
                                    </Button>
                                </Link>
                            </Box>
                        </Stack> :
                        <NoContent>
                            <Text color="primary">
                                No Pending Broad Cast yet
                            </Text>
                        </NoContent>
                }
            </Flex>
        </Flex>
    )
}

export default PendingStream