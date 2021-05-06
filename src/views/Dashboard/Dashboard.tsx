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
import {getSubscriptionByChurchId} from "core/services/subscription.service"
import { IEvent } from "core/models/Event"
import { IActivity, ISchedule } from "core/models/Activity"
import { MessageType } from "core/enums/MessageType"
import { AppState } from "store"
import { setPageTitle } from "store/System/actions"
import { rrulestr } from "rrule"
import { Free } from "assets/images"
import { Icon as DotIcon } from "components/Icon"
import {tertiary} from "theme/palette"
import axios from "axios"
import { SubscriptionByChurch } from "core/models/subscription"
import {NoContent} from "components/NoContent"



const useStyles = makeStyles((theme) => createStyles({
    root: {
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        "& h6":{
            fontStyle:"italic",
            opacity:".75"
        },
        [theme.breakpoints.down("sm")]:{
            "& h5":{
                textAlign:"center"
            }
        },
        "& > div:nth-child(2)":{
            display:"flex",
            width:"100%",
            flexDirection:"column",
            maxWidth:"115rem",
            [theme.breakpoints.down("sm")]:{
                alignItems:"center"
            }
        }
    },
    bannerContainer:{
        position:"relative",
        backgroundRepeat:"no-repeat",
        backgroundPosition:"center",
        height:"11.5rem",
        width:"100%",
        backgroundSize:"cover",
        "& > div:first-child":{
            position:"absolute",
            width:"100%",
            height:"100%",
            backgroundColor:"rgba(0,0,0,.1)" 
        },
        "& > div:last-child":{
            alignItems:"center",
            justifyContent:"center",
            position:"relative",
            zIndex:2,
            "& h5":{
                fontSize:"1.5rem",
                color:"whitesmoke"
            },
            "& p":{
                fontSize:"1rem",
                color:"whitesmoke"
            }
        }
    },
    verificationContainer: {
        shadow: "0px 5px 20px #0000001A",
        overflow:"'hidden",
        flex:5,
        backgroundColor: "white",
        borderRadius: "10px",
        justifyContent: "space-between",
        "& > div": {
            [theme.breakpoints.down("sm")]:{
                alignItems:"center",
                "& h2":{
                    textAlign:"center"
                }
            },
            "& button": {
                marginTop: "auto !important",
                padding: "1.5rem .5rem"
            },
        },
        "& img": {
            alignSelf: "center"
        },
        "& button":{
            [theme.breakpoints.up("sm")]:{
                marginBottom:"2rem"
            }
        },
        "& p":{
            color:tertiary
        }
    },
    chartContainer:{
        "& p,tspan":{
            fontFamily:"MontserratMedium !important"
        },
        "& span":{
            fontFamily:"MontserratRegular !important"
        }
    },
    chartHolder:{
        flexDirection:"column-reverse",
        width:"94%",
        [theme.breakpoints.up("sm")]:{
            width:"100%",
        },
        [theme.breakpoints.up("md")]:{
            flexDirection:"row",
            minHeight:"25vh"
        },
        // flexDirection:{["column-reverse", "column-reverse", "row"]}
        // minHeight:{{ base: "auto", md: "25vh" }}
    },
    link: {
        color: "white !important",
        opacity: .8,
        fontSize: "0.875rem"
    },
    routerLink:{
        fontStyle:"italic",
        fontWeight:600,
        fontSize:"1rem",
        marginBottom:"auto"
    },
    mediaContainer: {
        // [theme.breakpoints,]
        width:"100%",
        "& h3":{
            fontFamily:"Bahnschrift"
        },
        "& p":{
            fontFamily:"MontserratRegular"
        },
        "& ul":{
            maxHeight:"30rem",
            overflowY:"auto",
            justifyContent:"center",
            // [theme.breakpoints.up("md")]:{
            //     justifyContent:"flex-start"
            // },
            "& li":{
                width:"80%",
                "& > div":{
                    width:"100%"
                },
                [theme.breakpoints.up("sm")]:{
                    width:"initial"
                }
            }
        }
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
        alignItems: "flex-start !important",
        flex: 3
    },
    boxShadownContainer:{
        boxShadow:"0px 5px 20px #0000001A",
        borderRadius:"10px",
        backgroundColor:"white"
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
    const defaultSubscription:SubscriptionByChurch = {
        churchId:0,
        duration:0,
        expirationDate:new Date(),
        isActive:false,
        paymentId:null,
        startDate:new Date(),
        subscriptionID:0,
        timeRemaining:0 
    }
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
    const [churchSubscriptionDetail,setChurchSubscriptionDetail] = React.useState<SubscriptionByChurch[]>([])
    const [currentSubscription,setCurrentSubscription] = React.useState<SubscriptionByChurch>(defaultSubscription)
    const [churchEvent, setChurchEvent] = React.useState<IEvent[]>(new Array(10).fill(defaultEvent))
    const [open, setOpen] = React.useState(false)
    const handleToggle = () => {
        setOpen(!open)
    }

    
    React.useEffect(() => {
        if(churchSubscriptionDetail[0]){
            const currentSub = churchSubscriptionDetail[0]
            if((new Date(currentSub.expirationDate).getTime() > (new Date()).getTime())){
                const { duration,startDate} = currentSub
                const timeLapsedInMilli = (new Date()).getTime() - (new Date(startDate)).getTime()
                const timeLapsed = timeLapsedInMilli/(1000*3600*24)
                const timeRemaining = Math.round((duration/(24*60)) - timeLapsed)
                setCurrentSubscription({timeRemaining,...currentSub})
            }else{
                setCurrentSubscription({timeRemaining:0,...currentSub})
            }
        }
    },[churchSubscriptionDetail])
    
    React.useEffect(() => {
        const source = axios.CancelToken.source()
        dispatch(setPageTitle("Dashboard"))
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
                if(!axios.isCancel(err)){
                    toast({
                        title: "Unable to get Church Activity",
                        subtitle: `Error : ${err}`,
                        messageType: MessageType.ERROR
                    })
                }
            })
        }
        const getChurchSubscriptionDetail = () => {
            getSubscriptionByChurchId(params.churchId,source).then((payload) => {
                setChurchSubscriptionDetail(payload.data)
            }).catch(err => {})
        }
        const getChurchEvent = async () => {
            activityService.getChurchEvent(params.churchId,source).then(payload => {
                setChurchEvent(payload.data)
            }).catch(err => {
                if(!axios.isCancel(err)){
                    toast({
                        title: "Unable to get Church Event",
                        subtitle: `Error : ${err}`,
                        messageType: MessageType.ERROR
                    })
                }
            })
        }
        getChurchSubscriptionDetail()
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
            <Box className={classes.root}>
                <Box width="100%">
                    <Box className={classes.bannerContainer} 
                        backgroundImage={`url(${currentChurch.churchBarner || DefaultChurchLogo})`}>
                        <Box/>
                        <VStack height={["17rem", "13rem"]} >
                            <Heading as="h5" fontWeight={400} mb="3">
                                {`${currentChurch.name ? currentChurch.name : "Church"} Banner`}
                            </Heading>
                            <Text>
                                share Church URL
                            <Icon as={FiLink2} color="primary" />
                            </Text>
                        </VStack>
                    </Box>
                </Box>
                <Box pt={["1", "10"]} px={{sm:"5", md:"8"}} >
                    {currentChurch.status === 2 &&
                        <Flex direction={{ base: "column-reverse", md: "row" }}
                            my={12}  minHeight="7rem" width={["95%","100%"]}>
                            <Flex p={4} className={`${classes.verificationContainer} ${classes.boxShadownContainer}`}>
                                <VStack align="flex-start" >
                                    <Heading textStyle="h6" fontSize="1.5rem">
                                        Complete your church profile
                                    </Heading>
                                    <Link to={`/church/${params.churchId}/update`}
                                        className={classes.routerLink} opacity={.5}
                                        color="tertiary">
                                        Click here to complete church profile
                                    </Link>
                                    <Button width="84%" py="5" >
                                        <RouterLink to={`/church/${params.churchId}/verify`} >
                                            Verify your Church
                                        </RouterLink>
                                    </Button>
                                </VStack>
                                <Image src={VerifyImg} display={{base:"none",lg:"initial"}} mr={{md:4}} boxSize={["9rem","15rem"]} />
                            </Flex>
                            <VStack p={4} ml={{md:3}} mb={[3, 3, 0]}
                             bg="primary" className={`${classes.upgradeContainer} ${classes.boxShadownContainer}`}>
                                <Image src={Free} />
                                <Heading fontSize={["1rem","1.5rem","2rem"]}
                                 color="white" maxW="md" >
                                    You are on currently on the free plan Kindly upgrade
                                </Heading>
                                <Link to={`/church/${params.churchId}/verify`} 
                                className={classes.link}>
                                    <Text as="h6" >
                                        Click here to upgrade
                                    </Text>
                                </Link>
                            </VStack>
                        </Flex>
                    }

                    <Flex className={classes.chartHolder}>
                        <Flex flex={5} flexShrink={3} className={`${classes.chartContainer} ${classes.boxShadownContainer}`}
                            pt="3" pl="2" direction="column">
                            <Text color="#707070" fontSize=".9rem" >
                                Church Activities
                            </Text>
                            <Chart data={chartData} />
                        </Flex>
                        <Stack mx={{md:"3"}} my={{base:"3", md:0}} shadow="0px 5px 10px #0000001A"
                            bgColor="#F0F4FF"
                            pt="3" pl={{md:"2"}} flex={3} divider={<StackDivider bgColor="gray.500" />}>
                            <VStack align="flex-start" ml={{md:6}} h="80%" justifyContent="space-between" >
                                <DashboardCard heading="Church Name" color="primary">
                                    <Text color="#151C4D" mt="0px !important" fontSize="1rem" >
                                        {currentChurch.name}
                                    </Text>
                                </DashboardCard>
                                <DashboardCard heading="Head pastor/Pariah priest" color="yellow.300">
                                    <Text color="#151C4D" mt="0px !important" fontSize="1rem" >
                                        {currentChurch.priestName}
                                    </Text>
                                </DashboardCard>
                                <DashboardCard heading="Church Verification Status" color="green.500">
                                    <HStack>
                                        <DotIcon color={currentChurch.status === 1 ? "#68D391" : "#151C4D"} />
                                        <Text color="tertiary" mt="0px !important" fontSize="1rem" >
                                            {currentChurch.statusString}
                                        </Text>
                                    </HStack>
                                </DashboardCard>

                                {currentSubscription.timeRemaining! > 0 && 
                                <DashboardCard heading="Subscription Status" color="primary">
                                    <HStack>
                                        <DotIcon  color="#68D391"/>
                                        <Text mt="0px !important" fontSize="1rem" >
                                            {`${currentSubscription?.timeRemaining} days Left`}
                                        </Text>
                                    </HStack>
                                </DashboardCard>
                                }
                            </VStack>
                        </Stack>
                    </Flex>
                    <Stack my="10" spacing="6" className={classes.mediaContainer} >
                        <Text textStyle="h5">
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
                                                subtitle={item.schedule.recurrence || ""}
                                                date={`${(item.schedule.time.startDate as Date).toLocaleTimeString()} - 
                                                ${(item.schedule.time.endDate as Date ).toLocaleTimeString()}
                                                `}
                                            />
                                        </Flex>
                                    </DashboardActivity>
                                    </WrapItem>
                                ))
                                :
                                <NoContent>
                                    <Text>
                                        No Activity Available
                                    </Text>
                                </NoContent>
                            }
                        </Wrap>
                    </Stack>
                    <Box mb="16" className={classes.mediaContainer}>
                        <Text textStyle="h5">
                            Upcoming Events
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
                                <NoContent>
                                    <Text>
                                        No Church Event Available
                                    </Text>
                                </NoContent>
                            }
                        </Wrap>
                    </Box>
                </Box>
                <Dialog open={open} size="3xl" close={handleToggle} >
                    <Subscription />
                </Dialog>
            </Box>
        )
    }
}



export default Dashboard