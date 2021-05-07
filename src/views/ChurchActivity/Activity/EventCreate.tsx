import React from "react"
import { formatDate } from "@fullcalendar/react"
import { useHistory } from "react-router-dom"
import {
    Flex, useBreakpoint, HStack, FormControl,
    Textarea, Box, Text, AspectRatio, Image,
    Icon, FormLabel,Checkbox, Switch, Stack, VStack
} from "@chakra-ui/react"
import { Button } from "components/Button"
import { TextInput ,MaterialSelect } from "components/Input"
import { Formik, Field, FieldProps, FormikProps } from "formik"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import DatePicker from "react-date-picker"
import TimePicker from "react-time-picker"
import { BiRightArrowAlt, BiDownArrowAlt } from "react-icons/bi"
import { IGroup } from "core/models/Group"
import { IEvent } from "core/models/Event"
import { getGroupByChurch } from "core/services/group.service"
import * as activityService from "core/services/activity.service"
import useToast from "utils/Toast"
import { MessageType } from "core/enums/MessageType"
import { Recurring } from "core/enums/Recurring"
import useParams from "utils/params"
import * as Yup from "yup"
import { CreateLayout } from "layouts"
import StreamingService from "core/services/livestream.service"


interface IForm {
    title: string;
    member?: string;
    day: string;
    startDate: Date;
    endDate: Date;
    timeStart: string;
    timeEnd: string;
    repeat: string;
    speaker: string;
    detail: string;
    streamed: boolean
}


const useStyles = makeStyles((theme) => createStyles({
    root: {
        // alignItems: "flex-start !important"
    },
    inputContainer: {
        backgroundColor: "#F3F3F3",
        minHeight: "70vh",
        overflowX: "hidden",
        paddingBottom: "2rem",
        alignItems: "flex-start !important"
    },
    mainDateContainer: {
        "& > *": {
            marginTop: "auto !important",
            marginBottom: "auto !important"
        }
    },
    dateContainer: {
        borderColor: "2px solid black",
        color: "grey",
        "& > *": {
            padding: ".7rem 1.7rem !important",
            paddingLeft: ".4rem !important",
            borderRadius: "3px",
            "& select": {
                appearance: "none"
            }
        }
    }
}))

const NoIcon = () => (
    <Flex height="0" width="0" display="none" />
)

const Create = () => {
    const classes = useStyles()
    const history = useHistory()
    // const dispatch = useDispatch()
    const toast = useToast()
    const params = useParams()
    const currentDate = new Date()
    const curBreakpoint = useBreakpoint()
    const [initialGroups, setInitialGroup] = React.useState<IGroup[]>([])
    const isDesktop = String(curBreakpoint) !== "base" && curBreakpoint !== "sm"
    const [showTime, setShowTime] = React.useState(true)
    const [isStreamed,setIsStreamed] = React.useState(false)
    const [streamState,setStreamState] = React.useState<"not-ready" | "starting" | "ready" | "unauthenticated">("not-ready")
    // const streamService = new streamService({
    //     toast,
    //     setState,
    //     state
    // })
    const streamService = React.useRef<StreamingService | null>(null)
    

    const handleGoogleAuthenticated = () => {
        streamService.current?.authenticate()
    }

    const toggleStreamed = () => {

        if(!isStreamed){
            handleGoogleAuthenticated()
        }
        setIsStreamed(!isStreamed)
    }

    console.log({isStreamed})

    const [image, setImage] = React.useState({
        name: "",
        base64: ""
    })
    React.useEffect(() => {
        streamService.current = new StreamingService({
            toast:toast,
            state:streamState,
            setState:setStreamState
        })
        const getAllGroupsForChurch = async () => {
            await getGroupByChurch(params.churchId).then(payload => {
                setInitialGroup(payload.data)
            }).catch(err => {
                toast({
                    title: "Unable to load church groups",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.ERROR
                })
            })
        }
        getAllGroupsForChurch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    
    const validationSchema = Yup.object({
        title: Yup.string().min(3, "Title of Church Activity is too short").required(),
        startDate: Yup.string().min(3, "Title of Church Activity is too short").required(),
        endDate: Yup.string().min(3, "Title of Church Activity is too short").required(),
        detail: Yup.string().min(3, "Detail is too short").required(),
    })
    
    const showLongDate = (arg: Date) => (
        formatDate(arg, {
            weekday: "long",
        }))

    const handleCreateStream = ({
            description,title,scheduledEndTime,scheduledStartTime,
            eventId
        }:{
            title:string;
            description:string;
            scheduledStartTime:string;
            scheduledEndTime:string;
            eventId:number;
        }) => {  
            return new Promise((resolve,reject) => {
                streamService.current?.authenticate().then(async () => {
                    await streamService.current?.createBroadCast({
                        part:["snippet","status","contentDetails"],
                        snippet:{
                            title,
                            description,
                            scheduledStartTime,
                            scheduledEndTime
                        },
                        status:{
                            privacyStatus:"unlisted"
                        },
                        contentDetails:{
                            monitorStream:{
                                enableMonitorStream:true
                            }
                        }
                    },{
                        churchId:params.churchId as any,
                        eventId:eventId as number
                    }).then(resolve).catch(reject)
                })
            })
        }

console.log({streamState})

    const handleSubmit = (values: IForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const { title, detail, speaker, startDate, endDate, timeEnd, timeStart } = values
        
        const changeToTime = (arg: string) => {
            const parts = arg.split(/:/);
            const timePeriodMillis = (parseInt(parts[0], 10) * 60 * 1000) + (parseInt(parts[1], 10) * 1000);
            return timePeriodMillis
        }
        
        const time = !showTime ? {
            startDateTime: new Date(startDate.setTime(startDate.getTime() + changeToTime(timeStart))).toJSON(),
            endDateTime: new Date(endDate.setTime(endDate.getTime() + changeToTime(timeEnd))).toJSON()
        } : {
            startDateTime: startDate.toJSON(),
            endDateTime: endDate.toJSON()
        }
        const schedule = {
            attendee: []
        }
        const newEvent: IEvent = {
            title,
            description: detail,
            churchId: Number(params.churchId),
            schedule: JSON.stringify(schedule),
            speaker,
            ...(image.base64 && { bannerUrl: image.base64 }),
            ...time
        }

        activityService.createEvent(newEvent).then( async payload => {
            
            // if(isStreamed){             
                await handleCreateStream({
                    title,
                    description:detail,
                    scheduledStartTime:time.startDateTime,
                    scheduledEndTime:time.endDateTime,
                    eventId:payload.data.eventId as number
                }).then(() => {
                    actions.setSubmitting(false)
                    actions.resetForm()
                    history.push(`/church/${params.churchId}/dashboard`)
                    toast({
                        title: 'New Event has been created',
                        subtitle: "",
                        messageType: MessageType.SUCCESS
                    })
                })
            // }else{
            //     actions.setSubmitting(false)
            //     actions.resetForm()
            //     history.push(`/church/${params.churchId}/dashboard`)
            //     toast({
            //         title: 'New Event has been created',
            //         subtitle: "",
            //         messageType: MessageType.SUCCESS
            //     })
            // }
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to create new Activity",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    // For transforming the selected image to base 64
    const handleImageTransformation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setImage({
                    base64: (reader.result as string),
                    name: file.name
                })
            }
            reader.readAsDataURL(file)
        }
    }


    const goBack = () => {
        history.goBack()
    }
    const initialValues = {
        title: "",
        startDate: currentDate,
        endDate: new Date((new Date()).setDate(currentDate.getDate() + 1)),
        day: showLongDate(currentDate),
        timeStart: '5:00',
        timeEnd: '17:00',
        repeat: Recurring.DAILY,
        streamed: false,
        speaker: "",
        detail: ""
    }

    const compareStaff = (option:any, value:any) => {
        return option.societyID === value.societyID
    }

    return (
        <VStack pt={6}
            className={classes.root} >
            <Text textStyle="styleh5">
                New Church Event
            </Text>
            <CreateLayout>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<IForm>) => {
                        const onChange = (name: string) => (e: Date | any) => {
                            if (name === "startDate") {
                                const currentStartDate = new Date(e)
                                formikProps.setValues({
                                    ...formikProps.values,
                                    [name]: e,
                                    endDate: new Date((currentStartDate).setDate(currentStartDate.getDate() + 1)),
                                    day: showLongDate(currentDate)
                                })
                            } else {
                                formikProps.setValues({ ...formikProps.values, [name]: e })
                            }
                        }
                        const addToTime = () => {
                            setShowTime(!showTime)
                            if (showTime) {
                                const splitTime = formikProps.values.timeStart.split(":")
                                const timeStart = (new Date(0, 0, 0, Number(splitTime[0]), Number(splitTime[1])))
                                const newTimeEnd = new Date((timeStart).setMinutes(timeStart.getMinutes() + 30))
                                formikProps.setValues({
                                    ...formikProps.values,
                                    timeEnd: `${newTimeEnd.getHours()}:${newTimeEnd.getMinutes()}`
                                })
                            }
                        }
                        return (
                            <>
                                <VStack width={["95%","inherit"]} maxW="md" align="flex-start" >
                                    <TextInput width="100%" name="title"
                                        placeholder="Add title" />                          
                                    <MaterialSelect style={{width:"100%"}} name="groups" label="Invite all Members and groups" 
                                        getSelected={compareStaff} multiple
                                        options={initialGroups} getLabel={(label:IGroup) => label.name}
                                    />
                                    {/* <Stack my={5} direction={["column", "row"]}
                                        align="center"  mx={["auto",""]} > */}
                                        <Stack direction={{ base: "column", md: "row" }}
                                            align="center" alignSelf={["center","initial"]}>
                                            <VStack>
                                                <HStack width={["50"]} className={classes.mainDateContainer}>
                                                    <DatePicker minDetail="month" format="MMM dd,y" calendarIcon={null} clearIcon={null}
                                                        onChange={onChange("startDate")} value={formikProps.values.startDate}
                                                        className={classes.dateContainer} minDate={currentDate}
                                                    />
                                                    {
                                                        showTime &&
                                                        <Box ml="3" >
                                                            <TimePicker onChange={onChange("timeStart")} clearIcon={<NoIcon />}
                                                                value={formikProps.values.timeStart} format="hh:mm a"
                                                                className={classes.dateContainer} disableClock={true}
                                                            />
                                                        </Box>
                                                    }
                                                </HStack>
                                                <Icon as={isDesktop ? BiRightArrowAlt : BiDownArrowAlt} />
                                                <HStack width={['50']} className={classes.mainDateContainer}>
                                                    <DatePicker minDetail="month" minDate={formikProps.values.startDate} format="MMM dd,y"
                                                        className={classes.dateContainer} calendarIcon={null}
                                                        onChange={onChange("endDate")} value={formikProps.values.endDate}
                                                        clearIcon={null} />
                                                    {
                                                        showTime &&
                                                        <Box ml="3" >
                                                            <TimePicker onChange={onChange("timeEnd")} clearIcon={<NoIcon />}
                                                                value={formikProps.values.timeEnd} format="hh:mm a"
                                                                className={classes.dateContainer} disableClock={true}
                                                            />
                                                        </Box>
                                                    }
                                                </HStack>
                                            </VStack>
                                            <FormControl flex={3} display="flex"
                                                alignItems="center" justifyContent="center">
                                                <FormLabel color="inputColor"
                                                    mb={0} htmlFor="time">
                                                    {showTime ? "30m" : "1d"}
                                                </FormLabel>
                                                <Switch onChange={addToTime}
                                                    id="time" />
                                                <FormLabel whiteSpace="nowrap" ml={2}
                                                    color="inputColor"
                                                    mb={0} htmlFor="time">
                                                    All day
                                                </FormLabel>
                                            </FormControl>
                                        </Stack>
                                    {/* </Stack> */}
                                    <Flex alignSelf="center" p={3}
                                        border="2px dashed rgba(0,0,0,.4)" flex={7}>
                                        <input id="image" type="file" accept="image/jpeg,image/png"
                                            onChange={handleImageTransformation}
                                            style={{ display: "none" }} />
                                        <FormLabel htmlFor="image" m={0} >
                                            {image.name.length ?
                                                <AspectRatio width={["75vw", "40vw"]} maxW="15rem" ratio={4 / 2} >
                                                    <Image src={image.base64} />
                                                </AspectRatio> :
                                                <Button color="white" as="span"
                                                    bgColor="rgba(0,0,0,.6)">
                                                    Upload event Poster
                                            </Button>
                                            }

                                        </FormLabel>
                                    </Flex>
                                    <TextInput name="speaker" placeholder="Add Speaker" />
                                    <Field name="detail" >
                                        {({ field }: FieldProps) => (
                                            <Textarea rows={7} width="100%" placeholder="Enter details for this Event" {...field} />
                                        )}
                                    </Field>
                                </VStack>
                                <Checkbox  onChange={toggleStreamed} colorScheme="green">
                                    This Event will be Streamed Live
                                </Checkbox>
                                <Stack direction={["column", "row"]} spacing={2}
                                    width="100%">
                                    <Button px={5} py={2} isLoading={formikProps.isSubmitting}
                                        loadingText={`Creating Event ${formikProps.values.title}`}
                                        disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                        onClick={(formikProps.handleSubmit as any)}>
                                        Publish
                                            </Button>
                                    <Button variant="outline" disabled={formikProps.isSubmitting} onClick={goBack} >
                                        Close
                                    </Button>
                                </Stack>
                            </>
                        )
                    }}
                </Formik>

            </CreateLayout>
        </VStack>
    )
}


export default Create