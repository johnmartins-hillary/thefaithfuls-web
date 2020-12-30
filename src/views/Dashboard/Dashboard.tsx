import React from "react"
import {
    Box, Wrap, Heading, Skeleton,
    Flex, Image, VStack,Icon, Stack,
    StackDivider,HStack, Text, WrapItem
} from "@chakra-ui/react"
import {Link as RouterLink} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { DefaultChurchLogo, BackgroundImage, VerifyImg } from "assets/images"
import { Link } from 'components/Link'
import { Button } from "components/Button"
import { FiLink2 } from "react-icons/fi"
import { Subscription } from "components/Dialog"
import { Dialog } from "components/Dialog"
import { DashboardCard } from "components/Card/DashboardCard"
import { DashboardActivity } from "components/Card/ActivityCard/ActivityCard"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Chart } from 'components/Chart'
import useParams from "utils/params"
import useToast from "utils/Toast"
import * as activityService from "core/services/activity.service"
import { IEvent } from "core/models/Event"
import { IActivity, ISchedule } from "core/models/Activity"
import { MessageType } from "core/enums/MessageType"
import { AppState } from "store"
import { setPageTitle } from "store/System/actions"
import { rrulestr } from "rrule"
import { Free } from "assets/images"
import { Icon as DotIcon } from "components/Icon"
import axios from "axios"


const useStyles = makeStyles((theme) => createStyles({
    root: {
        "& ul":{
            height:"30rem",
            overflowY:"auto",
            justifyContent:"center",
            [theme.breakpoints.up("sm")]:{
                justifyContent:"flex-start"
            }
        }
    },
    verificationContainer: {
        shadow: "0px 5px 20px #0000001A",
        flex:5,
        backgroundColor: "white",
        borderRadius: "10px",
        justifyContent: "space-between",
        "& > div": {
            "& button": {
                marginTop: "auto !important",
                padding: "initial 1.6rem"
            },
        },
        "& img": {
            alignSelf: "center"
        }
    },
    link: {
        color: "whitesmoke !important",
        opacity: .5,
        fontSize: "0.875rem"
    },
    routerLink:{
        fontStyle:"italic",
        fontWeight:600,
        fontSize:"1rem",
        marginBottom:"auto"
    },
    mediaContainer: {

    },
    imageContainer: {
        backgroundRepeat: "no-repeat",
        borderRadius: "0.625rem",
        backgroundPosition: "center",
        height: "12rem",
        width: "17rem",
        backgroundSize: "cover"
    },
    upgradeContainer: {
        boxShadow: "0px 5px 20px #0000001A",
        borderRadius: "10px",
        alignItems: "flex-start !important",
        flex: 3
    }
}))

const Dashboard = () => {
    const currentChurch = useSelector((state: AppState) => state.system.currentChurch)
    const chartData = [
        { name: 2016, Members: 40, Events: 24, Finances: 24, newMembers: 14 },
        { name: 2017, Members: 30, Events: 39, Finances: 21, newMembers: 10 },
        { name: 2018, Members: 20, Events: 98, Finances: 29, newMembers: 12 },
        { name: 2019, Members: 78, Events: 30, Finances: 20, newMembers: 11 },
        { name: 2020, Members: 89, Events: 48, Finances: 18, newMembers: 90 }
    ]
    const classes = useStyles()
    const dispatch = useDispatch()
    const currentDate = new Date()
    const toast = useToast()
    const params = useParams()
    const defaultEvent: IEvent = {
        churchId: 0,
        description: "",
        endDateTime: "",
        schedule: "",
        startDateTime: "",
        title: "",
        speaker: ""
    }
    const defaultActivity: IActivity<ISchedule> = {
        churchId: 0,
        description: "",
        schedule: {
            time: {
                startDate:currentDate,
                endDate:currentDate,
            },
            recurrence: "",
            attendee: []
        },
        recuring: "",
        speaker: "",
        title: ""
    }
    const [churchActivity, setChurchActivity] = React.useState<IActivity<ISchedule>[]>(new Array(10).fill(defaultActivity))
    const [churchEvent, setChurchEvent] = React.useState<IEvent[]>(new Array(10).fill(defaultEvent))
    const [open, setOpen] = React.useState(false)
    const handleToggle = () => {
        setOpen(!open)
    }


    React.useEffect(() => {
        const source = axios.CancelToken.source()
        dispatch(setPageTitle("Dashboard"))
        // Parsing the string from rrule format to standard format
        // const stringToDate = (arg: string) => (
        //     `${arg.substring(0, 4)}-${arg.substring(4, 6)}-${arg.substring(6, 8)}T${arg.substring(9, 11)}:${arg.substring(11, 13)}:${arg.substring(13, 15).concat("Z")}`
        // )
        const getChurchActivity = async () => {
            activityService.getChurchActivity(params.churchId,source).then(payload => {
                setChurchActivity(payload.data.map((item, idx) => {
                    const schedule = JSON.parse(item.schedule)
                    const { time: { startDate, endDate } } = schedule
                    // const newStartDate = stringToDate(startDate)
                    // const newEndDate = stringToDate(endDate)
                    return ({
                        ...item,
                        schedule: {
                            ...schedule,
                            time: {
                                startDate: new Date(startDate),
                                endDate: new Date(endDate)
                            },
                            recurrence: rrulestr(schedule.recurrence).toText()
                        }
                    })
                }))
            }).catch(err => {
                toast({
                    title: "Unable to get Church Activity",
                    subtitle: `Error : ${err}`,
                    messageType: MessageType.ERROR
                })
            })
        }
        const getChurchEvent = async () => {
            activityService.getChurchEvent(params.churchId,source).then(payload => {
                setChurchEvent(payload.data)
            }).catch(err => {
                toast({
                    title: "Unable to get Church Event",
                    subtitle: `Error : ${err}`,
                    messageType: MessageType.ERROR
                })
            })
        }
        getChurchActivity()
        getChurchEvent()
        return () => {
            source.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (!currentChurch) {
        return <div>loading...</div>
    } else {
        return (
            <>
                <Box width="100%">
                    <Box backgroundImage={`url(${currentChurch.churchLogo || DefaultChurchLogo})`} position="relative"
                        backgroundRepeat="no-repeat"
                        backgroundPosition="center" height={["17rem", "13rem"]}
                        width="100%" backgroundSize="cover"
                    >
                        <Box position="absolute" width="100%"
                            height="100%" bgColor="rgba(0,0,0,.1)" />
                        <Flex direction="column" height={["17rem", "13rem"]} align="center" justify="center" >
                            <Heading as="h5" fontWeight={400} mb="3" color="#4C1C51" fontSize="1.86rem" >
                                {`${currentChurch.name ? currentChurch.name : "Church"} Banner`}
                            </Heading>
                            <Text fontSize="1.25rem" color="#151C4D" >
                                share Church URL
                            <Icon as={FiLink2} color="primary" />
                            </Text>
                        </Flex>
                    </Box>
                </Box>
                <Box pt={["1", "20"]} pl={["1", "5", "10"]} bgColor="#F9F5F9">
                    {true &&
                        <Flex direction={{ base: "column-reverse", md: "row" }} pr={{ md: "16" }}
                            my={10} height={["auto", "auto", "25vh"]} width="100%">
                            <Flex p={4}
                                className={classes.verificationContainer}>
                                <VStack align="flex-start" >
                                    <Heading textStyle="h5" >
                                        Complete your church profile
                                    </Heading>
                                    <Link to={`/church/${params.churchId}/update`}
                                        className={classes.routerLink}
                                        color="tertiary">
                                        Click here to complete church profile
                                    </Link>
                                    <Button width="84%" >
                                        <RouterLink to={`/church/${params.churchId}/verify`} >
                                            Verify your Church
                                        </RouterLink>
                                    </Button>
                                </VStack>
                                <Image src={VerifyImg} boxSize={["5rem", "7.5rem", "16rem"]} />
                            </Flex>
                            <VStack p={4} ml={3} mb={[3, 3, 0]} bg="primary" className={classes.upgradeContainer}>
                                <Image src={Free} />
                                <Heading fontSize={["1rem", "1.5rem"]} color="white" >
                                    You are on currently on the free plan Kindly upgrade
                                </Heading>
                                <Link to={`/church/${params.churchId}/verify`} className={classes.link}>
                                    Click here to upgrade
                                </Link>
                            </VStack>
                        </Flex>
                    }
                    <Flex flexDirection={["column-reverse", "column-reverse", "row"]} 
                    pr={{ md: "16" }} minHeight={{ base: "auto", md: "25vh" }}>
                        <Flex flex={5} flexShrink={3} borderRadius="0.63rem"
                            pt="3" pl="2" bgColor="white" direction="column"
                            shadow="0px 5px 10px #0000001A" >
                            <Text color="#707070" fontSize=".9rem" >
                                Church Activities
                            </Text>
                            <Chart data={chartData} />
                        </Flex>
                        <Stack mx="3" my={["3", 0]} shadow="0px 5px 10px #0000001A"
                            bgColor="#F0F4FF"
                            pt="3" pl="2" flex={3} divider={<StackDivider bgColor="gray.500" />}>
                            <VStack align="flex-start" ml={10}>
                                <DashboardCard heading="Church Name" color="primary">
                                    <Text color="#151C4D" mt="0px !important" fontSize="1rem" >
                                        {currentChurch.name}
                                    </Text>
                                </DashboardCard>
                                <DashboardCard heading="Head pastor/pariah priest" color="yellow.300">
                                    <Text color="#151C4D" mt="0px !important" fontSize="1rem" >
                                        {/* {currentChurch.priestName} */}
                                        Bismark Achodo
                                    </Text>
                                </DashboardCard>
                                <DashboardCard heading="Church Verification Status" color="green.500">
                                    <HStack>
                                        <DotIcon />
                                        <Text color="#151C4D" mt="0px !important" fontSize="1rem" >
                                            {currentChurch.churchStatus}
                                        </Text>
                                    </HStack>
                                </DashboardCard>
                                <DashboardCard heading="Subscription Status" color="red.500">
                                    <HStack>
                                        <DotIcon />
                                        <Text color="#151C4D" mt="0px !important" fontSize="1rem" >
                                            78 days left
                                    </Text>
                                    </HStack>
                                </DashboardCard>
                            </VStack>
                        </Stack>
                    </Flex>
                    <Stack my="10" spacing="6" >
                        <Text fontSize="1.88rem" textAlign={["center", "left"]} color="#4C1C51" >
                            Weekly Activites
                        </Text>
                        <Wrap>
                            {churchActivity.length > 0 ?
                                churchActivity.map((item, idx) => (
                                    <WrapItem key={item.activityID || idx}>
                                        <DashboardActivity
                                        heading={item.speaker} isLoaded={Boolean(item.activityID)} >
                                        <Flex pb={{ md: 12 }} mr={{ md: 16 }} direction="column"  >
                                            <DashboardActivity.Activity
                                                title={item.title} dotColor="#B603C9"
                                                date={`${(item.schedule.time.startDate as Date).toLocaleTimeString()} - 
                                                ${(item.schedule.time.endDate as Date ).toLocaleTimeString()}
                                                `}
                                            />
                                            <DashboardActivity.Activity
                                                title={"Recurring Event"} dotColor="#B603C9"
                                                date={item.schedule.recurrence || ""}
                                            />
                                        </Flex>
                                    </DashboardActivity>
                                    </WrapItem>
                                ))
                                : <Text color="primary">
                                    No Available Church Activity
                                </Text>
                            }
                        </Wrap>
                    </Stack>
                    <Box mb="16">
                        <Text fontSize="1.5rem" mb="5" textAlign={["center", "left"]}
                            color="#4C1C51" >
                            upcoming events
                        </Text>
                        <Wrap>
                            {churchEvent.length > 0 ?
                                churchEvent.map((item, idx) => (
                                    <WrapItem key={item.eventId || idx}>
                                        <Skeleton isLoaded={Boolean(item.eventId)}  >
                                            <Box className={classes.imageContainer} backgroundImage={`url(${item.bannerUrl || BackgroundImage})`} />
                                            <Text>
                                                {item.title}
                                            </Text>
                                        </Skeleton>
                                    </WrapItem>
                                )) :
                                <Text color="primary">
                                    No Church Event Available
                                </Text>
                            }
                        </Wrap>
                    </Box>
                </Box>
                <Dialog open={open} size="3xl" close={handleToggle} >
                    <Subscription />
                </Dialog>
            </>
        )
    }
}


export default Dashboard