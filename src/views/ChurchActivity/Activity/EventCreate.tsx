import React from "react"
import { formatDate } from "@fullcalendar/react"
import { useHistory } from "react-router-dom"
import {
    Flex, Heading, useBreakpoint, HStack, FormControl,
    Textarea, Box, Text, AspectRatio, Image,
    Icon, FormLabel, Switch, Stack, VStack
} from "@chakra-ui/react"
import { Button } from "components/Button"
import { TagContainer } from "components/Input/TagContainer"
import { TextInput, Checkbox } from "components/Input"
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
import GoogleService from "core/services/livestream.service"


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
    const [selectedGroups, setSelectedGroups] = React.useState<IGroup[]>([])
    const [initialGroups, setInitialGroup] = React.useState<IGroup[]>([])
    const [allGroups, setAllGroups] = React.useState<IGroup[]>([])
    const isDesktop = String(curBreakpoint) !== "base" && curBreakpoint !== "sm"
    const [showTime, setShowTime] = React.useState(true)
    const googleService = new GoogleService(toast)

    const [image, setImage] = React.useState({
        name: "",
        base64: ""
    })
    React.useEffect(() => {
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

    React.useEffect(() => {
        setAllGroups(initialGroups)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialGroups])

    React.useEffect(() => {
        const newAllGroups = initialGroups.filter(item => !selectedGroups.includes(item))
        setAllGroups(newAllGroups)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGroups])

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
            description,title,scheduledEndTime,scheduledStartTime
        }:{
            title:string;
            description:string,
            scheduledStartTime:string;
            scheduledEndTime:string
        }) => {  
            googleService.authenticate().then(async () => {
                await googleService.createBroadCast({
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

                },(params.churchId as unknown as number))
            })
        }

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
            actions.setSubmitting(false)
            actions.resetForm()
            history.goBack()
            if(values.streamed){
                const response = await handleCreateStream({
                    title,
                    description:detail,
                    scheduledStartTime:time.startDateTime,
                    scheduledEndTime:time.endDateTime
                })
                console.log("this is the response",response)
            }
            toast({
                title: 'New Event has been created',
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to create new Activity",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    const addToSelectedGroup = (e: IGroup) => () => {
        setSelectedGroups([...selectedGroups, e])
    }
    const removeFromSelectedGroup = (e: IGroup) => () => {
        const filteredGroup = [...selectedGroups]
        const idx = filteredGroup.findIndex((item, idx) => item.name === e.name)
        filteredGroup.splice(idx, 1)
        setSelectedGroups(filteredGroup)
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
    const handleClick = () => {
        handleCreateStream({
            description:"This is a main description",
            scheduledStartTime:"2021-03-17T23:27:07.522Z",
            scheduledEndTime:"2021-03-18T23:27:07.522Z",
            title:"This is the title"
        })
    }


    return (
        <VStack pt={6}
            className={classes.root} >
            <Heading textStyle="h4" >
                New Church Event
                </Heading>
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
                                <VStack width="inherit" maxW="md" align="flex-start" >
                                    {/* <Button onClick={handleClick}>
                                        Sign In With Google
                                    </Button> */}
                                    <TextInput width="100%" name="title"
                                        placeholder="Add title" />
                                    <TagContainer<IGroup, "name"> add={addToSelectedGroup}
                                        remove={removeFromSelectedGroup} tags={allGroups}
                                        active={selectedGroups} value="name" name="Invite all Members and groups"
                                    />
                                    <Stack my={5} direction={["column", "row"]}
                                        align="center">
                                        <HStack direction={{ base: "column", md: "row" }}
                                            align="center" >
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
                                        </HStack>
                                    </Stack>
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
                                <Checkbox name="streamed" >
                                    <Text textStyle="h" fontSize="1rem" whiteSpace="nowrap" >
                                        This Event will be Streamed Live
                                    </Text>
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