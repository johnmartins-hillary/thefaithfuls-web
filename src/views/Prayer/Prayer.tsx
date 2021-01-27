import React from "react"
import { Link, useLocation } from "react-router-dom"
import {
    Tabs, Flex, Tab, Icon, AvatarGroup, RadioGroup,
    TabList, TabPanel, Skeleton, TabPanels, HStack, VStack,
    Text, SimpleGrid, Avatar, IconButton, Wrap, WrapItem
} from "@chakra-ui/react"
import { Button } from "components/Button"
import { DetailCard } from "components/Card"
import {
    ChangeTestimonyStatus, getDailyReading,
    getPrayer, getPrayerRequest, getTestimony, prayPrayerRequest
} from "core/services/prayer.service"
import { IPrayer, IPrayerRequest } from "core/models/Prayer"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { FaPrayingHands } from "react-icons/fa"
import { MessageType } from "core/enums/MessageType"
import useParams from "utils/params"
import useToast, { ToastFunc } from "utils/Toast"
import { setPageTitle } from "store/System/actions"
import { useDispatch, useSelector } from "react-redux"
import { AppState } from "store"
import { ITestimony, TestimonyStatusType } from "core/models/Testimony"
import axios, { CancelTokenSource } from "axios"
import {NoContent} from "components/NoContent"


const useStyles = makeStyles((theme) => {
    return (
        createStyles({
            root: {
                "& button,p":{
                    fontFamily:"MulishRegular"
                },
                "& > div": {
                    [theme.breakpoints.up("sm")]: {
                        width: "95%",
                    },
                    "& > div:first-child": {
                        borderBottom: "1px solid #E0DEE6",
                        overflow: "auto",
                        [theme.breakpoints.up("sm")]: {
                            paddingRight: "15%",
                            marginLeft: "3%",
                            width: "97%",
                            marginRight: "10%"
                        }
                    }
                },
                "& p": {
                    fontFamily: "MulishRegular"
                }
            },
            reportCard: {
                "& > p": {
                    marginTop: "0px !important"
                }
            },
            tabContainer: {
                "& > div": {
                    width: "100%"
                },
                "& > *:last-child": {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    "& > button": {
                        margin: "1.5rem 0"
                    },
                    "& > div:last-child": {
                        width: "100%"
                    }
                }
            },
            prayerContainer: {
                "& > *": {
                    shadow: "5px 0px 6px #0000001A",
                    // backgroundColor: "white",
                    padding: "1rem",
                    borderRadius: "6px",
                    alignItems: "flex-start !important"
                }
            },
            testimonyContainer: {
                "& ul": {
                    justifyContent: "center",
                    [theme.breakpoints.up("sm")]: {
                        justifyContent: "flex-start"
                    },
                    "& li": {
                        // maxWidth:"20rem",
                        "& > div": {
                            minWidth: "18.5rem",
                            width: "100%",
                            shadow: "5px 0px 6px #0000001A",
                            backgroundColor: "white",
                            padding: "1.75rem",
                            borderRadius: "6px",
                            alignItems: "flex-start !important"

                        },
                        [theme.breakpoints.up("sm")]: {
                            width: "initial"
                        }
                    }
                },
                "& button": {
                    fontFamily: "MulishBold"
                }
            },
            prayerMainContainer: {
                paddingTop: "4.5rem !important",
                "& > button": {
                    marginLeft: "50%",
                    marginBottom: theme.spacing(4),
                    fontWeight: "400",
                    transform: "translateX(-50%)"
                },
                "& > div:nth-child(2)": {
                    alignItems: "flex-start !important",
                    width: "100%",
                    "& > p": {
                        marginLeft: ".75rem"
                    },
                    "& > div": {
                        width: "100%"
                    }
                }
            },
            buttonContainer: {
                "& > button": {
                    whiteSpace: "nowrap",
                    flex: 1,
                    fontSize: "1.25rem",
                    marginBottom: ".2px",
                    borderRadius: "10px 10px 0px 0px",
                    color: "#151C4D",
                    letterSpacing: 0,
                    backgroundColor: "#E0DEE6"
                }
            }
        })
    )
})

const selected = {
    bgColor: "#F2DCF4",
    color: "primary",
    shadow: "5px 0px 6px #0000001A",
    marginBottom: "0"
}


const Prayer = () => {
    const classes = useStyles()
    const params = useParams()
    const dispatch = useDispatch()
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    // const history = useHistory()
    const toast = useToast()
    const location = useLocation()
    const [options, setOptions] = React.useState<string | number>("1")
    const cancelToken = axios.CancelToken.source()
    // const currentChurch = useSelector((state:AppState) => state.system.currentChurch)
    const defaultPrayer: IPrayer = {
        prayerName: "",
        prayerdetail: "",
        denominationID: 0,
        denomination: ""
    }
    const defaultPrayerRequest: IPrayerRequest = {
        prayerTile: "",
        prayerDetail: "",
        churchId: 0,
        dateEntered: new Date(),
        personId: "",
        fullName: "",
        pictureUrl: "",
        timeLapsed: "",
        prayedPrayerRequests: [{
            fullName: "",
            personPrayedId: "",
            personPrayedPictureUrl: "",
            pictureUrl: "",
            prayedPrayerRequestID: 0,
            prayerRequestID: 0
        }]
    }
    const defaultReading = {
        name: "",
        verse: "",
        content: ""
    }
    const defaultTestimony: ITestimony = {
        churchId: 0,
        dateEntered: new Date(),
        personId: "",
        testimonyTile: "",
        testimonyType: "General",
        testimonyDetail: "",
        timeLapsed: ""
    }
    const [prayer, setPrayer] = React.useState<IPrayer[]>(new Array(10).fill(defaultPrayer))
    const [prayerRequest, setPrayerRequest] = React.useState<IPrayerRequest[]>(new Array(10).fill(defaultPrayerRequest))
    const [churchTestimony, setChurchTestimony] = React.useState<ITestimony[]>(new Array(10).fill(defaultTestimony))
    const [dailyReading, setDailyReading] = React.useState<any>(new Array(10).fill(defaultReading))
    const [tabIndex, setTabIndex] = React.useState(1)
    const handleTabChange = (event: number) => {
        setTabIndex(event)
    }

    const apiChurchTestimony = (cancelToken: CancelTokenSource) => () => {
        getTestimony({ churchId: Number(params.churchId), testimonyType: "General" }, cancelToken).then(payload => {
            const newChurchTestimony = payload.data.map((item) => {
                const timeLapsedInMilli = (new Date()).getTime() - (new Date(item.dateEntered)).getTime()
                const timeLapsed = String(Math.round(timeLapsedInMilli / (1000 * 3600 * 24)))
                return ({
                    ...item,
                    timeLapsed
                })
            })
            setChurchTestimony(newChurchTestimony)
        }).catch(err => {
            if (!axios.isCancel(err)) {
                toast({
                    title: "Unable to get Church Testimony",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.ERROR
                })
            }
        })
    }
    const getChurchTestimony = apiChurchTestimony(cancelToken)





    React.useEffect(() => {
        dispatch(setPageTitle("Prayers/Verses"))
        setTabIndex(Number(location.search.split("=")[1]) || 0)

        const getChurchPrayer = async () => {
            await getPrayer(3, cancelToken).then(payload => {
                setPrayer(payload.data)
            }).catch(err => {
                if (!axios.isCancel(err)) {
                    toast({
                        title: "Unable to get Church Prayer",
                        subtitle: `Error:${err}`,
                        messageType: MessageType.ERROR
                    })
                }
            })
        }

        const getDailyReadingApi = async () => {
            const currentDate = (new Date()).toLocaleDateString().split("/")
            const padString = (str: string) => {
                return str.length >= 2 ? str : `0${str}`
            }
            const formatDate = `${currentDate[2]}-${padString(currentDate[0])}-${padString(currentDate[1])}`
            await getDailyReading(formatDate, cancelToken).then(payload => {
                const { readings } = payload.data

                const dailyReadings = readings.map((item: any) => {
                    const newContent = item.content.replace(/[1-9][0-9]*/g, (text: string) => (
                        `<br/> ${text} &nbsp;`
                    ))
                    return ({
                        ...item,
                        content: newContent
                    })
                })
                setDailyReading(dailyReadings)
            }).catch(err => {
                if (!axios.isCancel(err)) {
                    toast({
                        title: "Unable to get Daily Reading",
                        subtitle: `Error:${err}`,
                        messageType: MessageType.ERROR
                    })
                }
            })
        }
        const getChurchPrayerRequest = () => {
            getPrayerRequest(params.churchId, cancelToken).then(payload => {
                const newPrayerRequest = payload.data.map(item => {
                    const timeLapsedInMilli = (new Date()).getTime() - (new Date(item.dateEntered)).getTime()
                    const timeLapsed = String(Math.round(timeLapsedInMilli / (1000 * 3600 * 24)))
                    return ({
                        ...item,
                        timeLapsed,
                        hasPrayed: Boolean(item.prayedPrayerRequests!.find(item => item.fullName === currentUser.fullname))
                    })
                })
                setPrayerRequest(newPrayerRequest)
            }).catch(err => {
                if (!axios.isCancel(err)) {
                    toast({
                        title: "Unable to get Church Request",
                        subtitle: `Error:${err}`,
                        messageType: MessageType.ERROR
                    })
                }
            })
        }
        getChurchPrayerRequest()
        getChurchTestimony()
        getChurchPrayer()
        getDailyReadingApi()
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const updateTestimonyStatus = (arg: TestimonyStatusType, toast: ToastFunc) => (testimonyId: number) => {
        ChangeTestimonyStatus({ testimonyId, testimonyStatus: arg }).then(() => {
            getChurchTestimony()
            toast({
                title: "Testimony updated Successfully",
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
        }).catch(err => {
            toast({
                title: "Something went wrong",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    const approveTestimony = (testimonyId: number) => () => {
        updateTestimonyStatus("Approved", toast)(testimonyId)
    }

    const rejectTestimony = (testimonyId: number) => () => {
        updateTestimonyStatus("Deleted", toast)(testimonyId)
    }

    const addToPrayer = (prayerRequestId: number) => () => {
        const foundIndex = prayerRequest.findIndex(item => item.prayerRequestID === prayerRequestId)
        const newFoundPrayerRequest: IPrayerRequest = {
            ...prayerRequest[foundIndex],
            // prayedPrayerRequests:[
            //     ...prayerRequest[foundIndex].prayedPrayerRequests as [],
            //     {}
            // ],
            hasPrayed: true
        }
        const filteredPrayerRquest = [...prayerRequest]
        filteredPrayerRquest.splice(foundIndex, 1, newFoundPrayerRequest)
        setPrayerRequest(filteredPrayerRquest)
        const addToPrayerQuery = `prayerRequetId=${prayerRequestId}&personId=${currentUser.id}`
        prayPrayerRequest(addToPrayerQuery).then(payload => {
            toast({
                title: `${currentUser.fullname} has prayed for this request`,
                subtitle: ``,
                messageType: MessageType.SUCCESS
            })
        }).catch(err => {
            toast({
                title: `Unable to add Admin to prayed List`,
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }
    const optionForDate = { month: 'long' };
    const dateMonth = new Intl.DateTimeFormat('en-US', optionForDate).format(new Date())

    return (
        <Flex className={classes.root} p={{ base: "4", md: "0" }}
            pl={{ md: "12" }} pt={{ md: "12" }} direction={{ base: "column", md: "row" }}>
            <Tabs index={tabIndex} onChange={handleTabChange} >
                <TabList className={classes.buttonContainer} width="100%">
                    <Tab _selected={{ ...selected }} px={["2", "10"]} py="4">
                        Prayer Requests
                        </Tab>
                    <Tab _selected={{ ...selected, shadow: " -3px 0px 6px #00000029" }}
                        px={["2", "10"]} py="3" >
                        Testimonies
                        </Tab>
                    <Tab _selected={{ ...selected, shadow: " -3px 0px 6px #00000029" }}
                        px={["2", "10"]} py="3" >
                        Church Prayers
                        </Tab>
                    <Tab _selected={{ ...selected, shadow: " -3px 0px 6px #00000029" }}
                        px={["2", "10"]} py="3" >
                        Daily Verse
                        </Tab>
                </TabList>
                <TabPanels mb={{ base: "5rem", md: "10rem" }}
                    className={classes.tabContainer}>
                    <TabPanel mt="3">
                        <SimpleGrid minChildWidth="17.5rem" alignItems={{ base: "center", md: "flex-start" }} gridGap=".5rem"
                            spacing={3} className={classes.prayerContainer}>
                            {prayerRequest.length > 0 && prayerRequest.map((item, idx) => (
                                <DetailCard title={item.fullName} key={item.prayerRequestID || idx}
                                    subtitle={item.prayerTile}
                                    image={item.pictureUrl} timing={`${item.timeLapsed}d`}
                                    body={item.prayerDetail} isLoaded={Boolean(item.prayerRequestID)}
                                >
                                    <HStack width="100%" justify="space-between">
                                        {
                                            item.prayedPrayerRequests?.length &&
                                            <>
                                                <AvatarGroup size="sm" max={3}>
                                                    {item.prayedPrayerRequests!.map((item) => (
                                                        <Avatar name={item.fullName} key={item.prayedPrayerRequestID} src={item.personPrayedPictureUrl} />
                                                    ))}
                                                </AvatarGroup>
                                                <Text mr="auto">
                                                    <Text as="b">{item.prayedPrayerRequests!.length}</Text> has Prayed
                                            </Text>

                                            </>
                                        }
                                        <IconButton disabled={item.hasPrayed || false} onClick={addToPrayer(item.prayerRequestID as number)} aria-label="Add to Prayer"
                                            boxSize="1rem" icon={<FaPrayingHands />} />
                                    </HStack>
                                </DetailCard>
                            )) 
                            }
                        </SimpleGrid>
                        {prayerRequest.length <= 0 && 
                        <NoContent>
                        <Text>

                            
                            No Prayer Request is Available
                        </Text>
                    </NoContent>}
                    </TabPanel>
                    <TabPanel mt="3" className={classes.testimonyContainer}>
                        <Wrap spacing={6}>
                            {churchTestimony.length > 0 && churchTestimony.map((item, idx) => (
                                <WrapItem key={item.testimonyID || idx} bgColor="white">
                                    <DetailCard title="Bismark Achodo" timing={`${item.timeLapsed}d`}
                                        image="https://bit.ly/ryan-florence" isLoaded={Boolean(item.testimonyID)}
                                        smallText={(new Date(item.dateEntered)).toLocaleDateString()}
                                        body={item.testimonyDetail}
                                    >
                                        <HStack width="100%">
                                            <Button mr="4" variant="link"
                                                textDecoration="underline" onClick={approveTestimony(item.testimonyID as number)} >
                                                Approve
                                                </Button>
                                            <Button variant="link" color="tertiary"
                                                textDecoration="underline" onClick={rejectTestimony(item.testimonyID as number)} >
                                                Discard
                                                </Button>
                                        </HStack>
                                    </DetailCard>
                                </WrapItem>
                            ))}
                        </Wrap>
                        {churchTestimony.length <= 0 && 
                        <NoContent>
                        <Text>
                            No Testimony is Available
                        </Text>
                    </NoContent>}
                    </TabPanel>
                    <TabPanel mt="3" className={classes.prayerMainContainer}>
                        <Button>
                            <Link to={`/church/${params.churchId}/prayer/create`} >
                                Create Church Prayer
                                    </Link>
                        </Button>
                        <VStack>
                            <Text fontWeight="600" color="primary">
                                {`${dateMonth} Daily Fasting & Prayers`}
                            </Text>
                            <SimpleGrid minChildWidth="17.5rem" alignItems={{ base: "center", md: "flex-start" }} gridGap=".5rem"
                                spacing={3} className={classes.prayerContainer}>
                                {prayer.map((item, idx) => (
                                    <Skeleton key={item.prayerID || idx} isLoaded={Boolean(item.prayerID)}>
                                        <DetailCard title={item.prayerName} key={item.prayerID || idx}
                                            smallText={"JOHN 3:16"}
                                            body={item.prayerdetail}
                                        >
                                            <HStack width="100%" justify="space-between">
                                                <AvatarGroup size="sm" max={3}>
                                                    <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                                                    <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                                                    <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                                                    <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
                                                    <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
                                                </AvatarGroup>
                                                <Text mr="auto">
                                                    <Text as="b">14 People</Text> Prayed
                                                    </Text>
                                                <Icon boxSize="1rem" as={FaPrayingHands} />
                                            </HStack>
                                        </DetailCard>
                                    </Skeleton>
                                ))}
                            </SimpleGrid>
                        </VStack>
                    </TabPanel>
                    <TabPanel mt="3">
                        <RadioGroup onChange={setOptions} value={options}>
                        </RadioGroup>
                        <Button>
                            <Link to={`/church/${params.churchId}/prayer/verse/create`} >
                                Add verse of the day
                                    </Link>
                        </Button>
                        <SimpleGrid minChildWidth="17.5rem" alignItems={{ base: "center", md: "flex-start" }} gridGap=".5rem"
                            spacing={3} className={classes.prayerContainer}>
                            {dailyReading.map((item: any, idx: number) => (
                                <Skeleton key={idx} isLoaded={Boolean(item.verse)}>
                                    <DetailCard
                                        title={item.name} key={idx}
                                        smallText={item.verse}
                                        body={""}
                                    >
                                        <Text dangerouslySetInnerHTML={{ __html: item.content }} />
                                        {/* <HStack width="100%" justify="flex-start">
                                                    <Icon as={BiEdit} />
                                                    <Icon as={RiDeleteBinLine} />
                                                </HStack> */}
                                    </DetailCard>
                                </Skeleton>
                            ))}
                        </SimpleGrid>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    )
}

export default Prayer