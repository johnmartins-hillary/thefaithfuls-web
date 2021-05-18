import React from "react"
import { formatDate } from "@fullcalendar/react"
import { useHistory } from "react-router-dom"
import {
    Flex, useBreakpoint, HStack, FormControl,
    ModalContent, Textarea, ModalHeader, Radio, RadioGroup,
    ModalFooter, Box, ModalBody, Text, useRadio, AspectRatio, Image,
    ModalCloseButton, Icon, FormLabel, useRadioGroup,
    Switch, Stack, VStack
} from "@chakra-ui/react"
import { Button } from "components/Button"
import { Dialog } from "components/Dialog"
import { TextInput,NormalSelect, Select,NumberStepper, Checkbox, MaterialSelect } from "components/Input"
import { Formik, Field, FieldProps, FormikProps } from "formik"
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles"
import {DatePicker} from "components/Input"
import TimePicker from "react-time-picker"
import { BiRightArrowAlt, BiDownArrowAlt } from "react-icons/bi"
import { IGroup } from "core/models/Group"
import { IActivity, ISchedule} from "core/models/Activity"
import { getGroupByChurch } from "core/services/group.service"
import * as activityService from "core/services/activity.service"
import useToast from "utils/Toast"
import { MessageType } from "core/enums/MessageType"
import { Recurring, WEEKLY } from "core/enums/Recurring"
import useParams from "utils/params"
import {CreateLayout} from "layouts"
import * as Yup from "yup"


const useStyles = makeStyles((theme) => createStyles({
    root: {
        paddingLeft:"0 !important"
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
        // marginRight: theme.spacing(2),
        // "& > *": {
        //     // padding: ".7rem 1.7rem !important",
        //     // paddingLeft: ".4rem !important",
        //     borderRadius: "3px",
        //     "& select": {
        //         appearance: "none"
        //     }
        // }
    }
}))

const customCreatorStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: theme.spacing(2),
        "& > header": {
            alignSelf: "center",
            marginTop: theme.spacing(3)
        }
    },
    bodyContainer: {
        "& > *": {
            alignItems: "flex-start !important"
        },
        "& > *:first-child": {
            alignItems: "center !important",
            marginBottom: "3rem"
        },
        "& > *:nth-child(2)": {
            margin: "2rem auto"
        }
    },
    dateContainer: {
        borderColor: "2px solid black",
        color: "grey",
        borderRadius: "3px",
        [theme.breakpoints.up("sm")]: {
            paddingRight: "4rem !important"
        }
    },
    date: {
        border: "2px solid grey",
        borderRadius: "3px",
        color: "grey",
        padding: ".4rem 3rem !important",
        paddingLeft: ".5rem !important",
    },
    radioContainer: {
        alignItems: "flex-start !important",
        position: "relative",
        "& > *": {
            display: "flex",
            margin: "1rem initial",
            marginLeft: "initial",
            justifyContent: "space-between",
            width: "100%",
        },
        "& > label:first-child": {
            justifyContent: "flex-start"
        }
    },
    extraContainer: {
        border: "2px solid grey",
        height: "44px",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: "3px",
        marginTop: "0 !important",
        color: "grey",
        width: "85%",
        // [theme.breakpoints.up("sm")]: {
        //     width: "30vw"
        // },
        "& > div:first-child": {
            marginTop: "0 !important",
            width: "30%",
            border:"none !important",
            height:"43px",
            marginRight: theme.spacing(1)
        },
        "& input:first-child": {
            border: "none",
            height:"100%",
            padding: "0",
            paddingLeft: theme.spacing(.5),
            backgroundColor: "transparent",
            borderRadius: "0px",
            borderRight: "2px solid black"
        }
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center !important",
        width: "100%",
        "& > button:first-child": {
            marginRight: ".5rem"
        },
        "& > button": {
            padding: ".5rem 2rem",
            fontWeight: 400
        }
    },
    input: {
        height: "6vh !important",
        marginLeft: 0,
        borderRadius: "6px",
        "& > div": {
            border: "none",
        },
        "& select": {
            appearance: "none"
        }
    },
    numberInput:{
        height:"40px",
        "& > input":{
            border:"none !important",
            height:"100%"
        }
    }
}))

const DateIcon = (props: any) => {
    const { getInputProps, getCheckboxProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Box as="label">
            <input {...input} />
            <Box
                borderRadius="50%" fontSize="0.875rem"
                bgColor="avatarBg"
                {...checkbox}
                cursor="pointer"
                _checked={{
                    bg: "primary",
                    color: "white",
                }}
                p="0.2rem .5rem"
            >
                {props.children}
            </Box>
        </Box>
    )
}

interface ICustomDateCreator {
    customForm: ICustomForm;
    handleCustomForm: any;
    close: any
}

interface ICustomForm {
    FREQ: Recurring;
    INTERVAL?: number;
    BYMONTHDAY?: number;
    BYWEEKDAY?: WEEKLY;
    COUNT?: number;
    UNTIL?: Date;
    rule:string;
}

const CustomDateCreator: React.FC<ICustomDateCreator> = ({ customForm, close, handleCustomForm }) => {
    interface CustomDateCreatorForm extends ICustomForm {
        ends: "never" | "on" | "after" | string
    }

    interface IWeek {
        [key: string]: string
    }

    const enumsToArray = (enumArg: any): IWeek => {
        let arrayObjects = {}
        for (const [propertyKey, propertyValue] of Object.entries(enumArg)) {
            if (!Number.isNaN(Number(propertyKey))) {
                continue;
            }
            arrayObjects = {
                ...arrayObjects,
                [propertyKey]: propertyValue
            };
        }
        return arrayObjects
    }

    const [byDay, setByDay] = React.useState<any>("MONDAYS")
    const dateMapped = Object.keys(WEEKLY)
    const weekObject = enumsToArray(WEEKLY)
    const classes = customCreatorStyles()
    const currentDate = new Date()

    const handleDaySelect = (date: string) => {
        setByDay(date)
    }

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: "byDay",
        defaultValue: byDay,
        onChange: handleDaySelect
    })

    const handleSubmit = (values: CustomDateCreatorForm, actions: any) => {
        actions.setSubmitting(true)
        handleCustomForm(values)
        const customRecurring = {
            FREQ: values.FREQ,
            INTERVAL: values.INTERVAL,
            ...(values.FREQ === Recurring.WEEKLY && { BYWEEKDAY: weekObject[byDay] }),
            ...(values.FREQ === Recurring.MONTHLY && { BYMONTHDAY: values.BYMONTHDAY }),
            ...(values.ends === "on" &&
            // eslint-disable-next-line
             { UNTIL: (new Date(values.UNTIL!)).toISOString().replace(/\:|\-|\./gi,"").substring(0,15).concat("Z") }),
             ...(values.ends === "after" && { COUNT: values.COUNT })
        }

        const changeToRecurringString = (argObj:any) => {
            let recurringString = "RRULE:"
            // eslint-disable-next-line
            Object.entries(argObj).map((item,idx) => {
                if(idx > 0){
                    recurringString = recurringString + `;${item[0]}=${item[1]}`
                }else{
                    recurringString = recurringString + `${item[0]}=${item[1]}`
                }
            })
            return recurringString
        }
        
        handleCustomForm({
            ...customRecurring,
            rule:changeToRecurringString(customRecurring)  
        })
        close()
    }
    const initialValue = {
        ...customForm,
        UNTIL: new Date(currentDate.getFullYear(), (currentDate.getMonth() + 1), currentDate.getDate()),
        ends: "after"
    }
    const validationSchema = Yup.object({
        INTERVAL: Yup.number().notOneOf([0], "Frequency of activity can't be zero").required()
    })

    const group = getRootProps()

    const getDaysInMonth = (month: number, year: number): number[] => {
        const date = new Date(Date.UTC(year, month, 1));
        const days = [];
        while (date.getUTCMonth() === month) {
            days.push(date.getUTCDate());
            date.setUTCDate(date.getUTCDate() + 1);
        }
        return days;
    }


    return (
        <ModalContent bgColor="bgColor2" className={classes.root}>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalHeader color="primary" >Custom recurrence</ModalHeader>
            <Formik
                initialValues={initialValue}
                onSubmit={handleSubmit}
                validationScheme={validationSchema}
            >
                {(formikProps: FormikProps<CustomDateCreatorForm>) => {
                    const onChange = (name: string) => (e: Date | any) => {
                        formikProps.setValues({ ...formikProps.values, [name]: (e as Date) })
                    }
                    const setValue = (e: string) => {
                        formikProps.setValues({
                            ...formikProps.values,
                            ends: e
                        })
                    }
                    const closeDialog = () => {
                        formikProps.resetForm()
                        close()
                    }
                    return (
                        <>
                            <ModalBody className={classes.bodyContainer} >
                                <HStack align="center">
                                    <Text>
                                        Repeat every
                                    </Text>
                                    <HStack>
                                        <NumberStepper size="sm" min={1} name="INTERVAL"
                                         mt={0} className={classes.numberInput} />
                                        <Select name="FREQ" placeholder="" mb={0} >
                                            <option value={Recurring.DAILY}>Day</option>
                                            <option value={Recurring.WEEKLY}>Week</option>
                                            <option value={Recurring.MONTHLY}>Month</option>
                                            <option value={Recurring.YEARLY}>Year</option>
                                        </Select>
                                    </HStack>
                                </HStack>
                                <VStack mt={8} mb={3} >
                                    {
                                        formikProps.values.FREQ === Recurring.WEEKLY &&
                                        <>
                                            <Text>
                                                Repeat on
                                            </Text>
                                            <HStack {...group}>
                                                {dateMapped.map((value) => {
                                                    const radio = getRadioProps({ value,enterKeyHint:"" })
                                                    return (
                                                        <DateIcon key={value} {...radio}>
                                                            {value.substring(1, 0)}
                                                        </DateIcon>
                                                    )
                                                })}
                                            </HStack>
                                        </>
                                    }
                                    {formikProps.values.FREQ === Recurring.MONTHLY
                                        &&
                                        <Select name="BYMONTHDAY" placeholder="" width={["100%", "50%"]} >
                                            {
                                                getDaysInMonth(currentDate.getMonth(), currentDate.getUTCFullYear()).map((item, idx) => (
                                                    <option value={item} key={item} >
                                                        {`Monthly on day ${item}`}
                                                    </option>
                                                ))
                                            }
                                        </Select>
                                    }
                                </VStack>
                                <VStack>
                                    <Text>
                                        Ends
                                    </Text>
                                    <RadioGroup onChange={setValue} value={formikProps.values.ends}>
                                        <VStack spacing={4} className={classes.radioContainer}>
                                            <Radio value="never">Never</Radio>
                                            <HStack alignItems="center">
                                                <Radio value="on">On</Radio>
                                                {formikProps.values.ends === "on" &&
                                                    <DatePicker name="until" format="MMM dd,y" calendarIcon={null} clearIcon={null}
                                                        onChange={onChange("UNTIL")} value={(formikProps.values.UNTIL as Date)}
                                                        className={classes.input} minDate={currentDate} alignItems="center"
                                                    />
                                                }
                                            </HStack>
                                            <HStack>
                                                <Radio value="after">After</Radio>
                                                {formikProps.values.ends === "after" &&
                                                    <Flex className={classes.extraContainer}>
                                                        <NumberStepper size="sm" min={0} name="COUNT" width="15%"
                                                         mb={0} ml={0} />
                                                        <Box>
                                                            Occurrence
                                                        </Box>
                                                    </Flex>
                                                }
                                            </HStack>
                                        </VStack>
                                    </RadioGroup>
                                </VStack>
                            </ModalBody>
                            <ModalFooter className={classes.buttonContainer}>
                                <Button onClick={(formikProps.handleSubmit as any)}
                                    disabled={!formikProps.dirty || !formikProps.isValid}
                                >Done</Button>
                                <Button variant="outline" onClick={closeDialog} >Close</Button>
                            </ModalFooter>
                        </>
                    )
                }}
            </Formik>
        </ModalContent>
    )
}

const NoIcon = () => (
    <Flex height="0" width="0" display="none" />
)

const currentDate = new Date()
    

const showLongDate = (arg: Date) => {
    return (formatDate(arg, {
        weekday: "long",
    }))
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
    detail: "",
    groups:[]
}

type TypeForm = typeof initialValues

const Create = () => {
    const classes = useStyles()
    const history = useHistory()
    const [schedule, setSchedule] = React.useState<ICustomForm>({
        FREQ: Recurring.DAILY,
        INTERVAL: 2,
        BYMONTHDAY: 0,
        COUNT: 0,
        BYWEEKDAY: WEEKLY.MONDAY,
        UNTIL: currentDate,
        rule:"",
    })
    const toast = useToast()
    const params = useParams()
    const curBreakpoint = useBreakpoint()
    const [initialGroups, setInitialGroup] = React.useState<IGroup[]>([])
    const isDesktop = String(curBreakpoint) !== "base" && curBreakpoint !== "sm"
    const [allDay, setAllDay] = React.useState(true)
    const [showDialog, setShowDialog] = React.useState(false)
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
                    messageType: MessageType.ERROR,
                    duration: 4500
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

    const handleSubmit = (values: TypeForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const { title, detail,startDate, endDate, timeEnd, timeStart, repeat } = values
        const changeToTime = (arg: string) => {
            const parts = arg.split(/:/);
            const timePeriodMillis = (parseInt(parts[0], 10) * 60 * 1000) + (parseInt(parts[1], 10) * 1000);
            return timePeriodMillis
        }

        const time = allDay ?
        {
            // Returns the JSON format for the date without the date
            startDate: (new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate())).toJSON(),
            endDate: (new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate())).toJSON()
        }:{
            // Get the minute and hours if its not an all day activity
            // eslint-disable-next-line
            startDate: new Date(startDate.setTime(startDate.getTime() + changeToTime(timeStart))).toISOString().replace(/\:|\-|\./gi,"").substring(0,15).concat("Z"),
            // eslint-disable-next-line
            endDate: new Date(endDate.setTime(endDate.getTime() + changeToTime(timeEnd))).toISOString()
        }
        // remove special character for the rrule module
        const newTime = {
            // eslint-disable-next-line
            startDate:time.startDate.replace(/\:|\-|\./gi,"").substring(0,15).concat("Z"),
            // eslint-disable-next-line
            endDate:time.endDate.replace(/\:|\-|\./gi,"").substring(0,15).concat("Z")
        }    
        const scheduleObj:ISchedule =  {
            time,
            attendee:[],
            recurrence:`DTSTART;TZID=Africa/Lagos:${newTime.startDate}\n${schedule.rule}`
        }

        if(repeat === "MONTHLY"){
            // For setting the bymonthday for the monthly
            scheduleObj.recurrence = `RRULE:FREQ=MONTHLY;WKST=SU;BYMONTHDAY=${startDate.getDate()}`
        }
        const newActivity: IActivity = {
            title,
            description: detail,
            recuring: repeat,
            churchId: Number(params.churchId),
            schedule: JSON.stringify(scheduleObj),
            speaker:values.speaker,
            ...(image.base64 && { bannerUrl: image.base64 }),
        }
        activityService.createActivity(newActivity).then(payload => {
            actions.setSubmitting(false)
            toast({
                title: 'New Activity has been created',
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
            history.push(`/church/${params.churchId}/activity`)
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to create new Activity",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    const handleDialog = () => {
        setShowDialog(!showDialog)
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

    const compareStaff = (option:any, value:any) => {
        return option.societyID === value.societyID
    }

    return (
        <>
            <VStack pl={{ base: 2, md: 12 }} pt={{ md: 6 }}
                className={classes.root} >
                <Text textStyle="styleh5">
                    New Church Activity
                </Text>
                <CreateLayout>
                <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {(formikProps: FormikProps<TypeForm>) => {
                            // For handling date input onchange
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
                            // For handling toggling of the custom dialog 
                            const handleChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
                                console.log(e.currentTarget.value)
                                if (e.currentTarget.value === "7") {
                                    // For Toggling the custom dialog
                                    handleDialog()
                                } else if(e.currentTarget.value === "WEEKDAY"){
                                // For setting the rule for the weekday 
                                setSchedule({
                                    ...schedule,
                                    FREQ:(e.currentTarget.value as any),
                                    rule:`RRULE:FREQ=WEEKLY;WKST=SU;BYWEEKDAY=MO,TU,WE,TH,FR`
                                 })   
                                }else if(e.currentTarget.value === "WEEKLY"){
                                    // For setting the by weekday for the weekly
                                    setSchedule({
                                        ...schedule,
                                        FREQ:(e.currentTarget.value as any),
                                        rule:`RRULE:FREQ=WEEKLY;WKST=SU;BYWEEKDAY=${showLongDate(formikProps.values.startDate).substring(0,2).toUpperCase()}`
                                     })
                                     formikProps.setValues({
                                        ...formikProps.values,
                                        repeat: (e.currentTarget.value as any)
                                    })
                                }else{
                                    // For setting recurring event
                                    setSchedule({
                                        ...schedule,
                                        FREQ: (e.currentTarget.value as any),
                                        rule:`RRULE:FREQ=${e.currentTarget.value}`
                                    })
                                    formikProps.setValues({
                                        ...formikProps.values,
                                        repeat: (e.currentTarget.value as any)
                                    })
                                }
                            }
                            // Setting the time apart of the church activity
                            const addToTime = () => {
                                setAllDay(!allDay)
                                if(!allDay) {
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
                                    <VStack width={["95%","inherit"]} align="flex-start">
                                        <TextInput width="100%" name="title"
                                            placeholder="Add title" />
                                        <MaterialSelect style={{width:"100%"}} name="groups" label="Invite all Members and groups" 
                                            getSelected={compareStaff} multiple
                                            options={initialGroups} getLabel={(label:IGroup) => label.name}
                                        />
                                        <Stack my={5} direction={["column", "row"]}
                                            align="center">
                                            <HStack direction={{ base: "column", md: "row" }}
                                                align="center" >
                                                <VStack>
                                                    <HStack width={["50"]} className={classes.mainDateContainer}>
                                                        <DatePicker name="startDate" minDetail="month" format="MMM dd,y"
                                                            onChange={onChange("startDate")} value={formikProps.values.startDate}
                                                            className={classes.dateContainer}
                                                        />
                                                        {
                                                            !allDay &&
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
                                                        <DatePicker name="endDate" minDetail="month" minDate={formikProps.values.startDate}
                                                            className={classes.dateContainer} calendarIcon={null} format="MMM dd,y"
                                                            onChange={onChange("endDate")} value={formikProps.values.endDate}
                                                            clearIcon={null} />
                                                        {
                                                            !allDay &&
                                                            <Box ml="3" >
                                                                <TimePicker onChange={onChange("timeEnd")} clearIcon={<NoIcon />}
                                                                    value={formikProps.values.timeEnd} format="hh:mm a"
                                                                    className={classes.dateContainer} disableClock={true}
                                                                />
                                                            </Box>
                                                        }
                                                    </HStack>
                                                </VStack>
                                                <FormControl as={Flex} flex={3}
                                                    alignItems="center" justifyContent="center">
                                                    <FormLabel color="inputColor"
                                                        mb={0} htmlFor="time">
                                                        {allDay ? "1d" : "30m"}
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

                                        <VStack align="center"
                                            width="100%">
                                            <NormalSelect name="repeat" placeholder=""
                                                onChange={handleChange} value={formikProps.values.repeat} >
                                                {/* <option value={Recurring.NOREPEAT}>Does not Repeat</option> */}
                                                <option value={Recurring.DAILY}>Daily</option>
                                                <option value={Recurring.WEEKLY}>Weekly on {showLongDate(formikProps.values.startDate)}</option>
                                                <option value={Recurring.MONTHLY}>Monthly on {showLongDate(formikProps.values.startDate)}</option>
                                                <option value={Recurring.YEARLY}>Annually on {showLongDate(formikProps.values.startDate)}</option>
                                                <option value={Recurring.WEEKDAY}>Every Weekday (Mon to Fri)</option>
                                                <option value={Recurring.CUSTOM}>
                                                    Custom...
                                                </option>
                                            </NormalSelect>
                                            <Flex align="center" p={3} w={image.base64 ? "100%" : ""}
                                                border="2px dashed rgba(0,0,0,.4)" flex={7}>
                                                <input id="image" type="file" accept="image/jpeg,image/png"
                                                    onChange={handleImageTransformation}
                                                    style={{ display: "none" }} />
                                                <FormLabel htmlFor="image" w="100%" m={0} >
                                                {image.name.length > 0 ? 
                                                <AspectRatio w="100%" ratio={21 / 9}>
                                                <Image src={image.base64} objectFit="cover" />
                                                {/* <Image src={image.base64} /> */}
                                            </AspectRatio>
                                             :
                                                    <Button color="white" as="span"
                                                        bgColor="rgba(0,0,0,.6)">
                                                            Upload Activity Poster
                                                        </Button>
                                                    }
                                                </FormLabel>
                                            </Flex>
                                        </VStack>
                                        <TextInput name="speaker" placeholder="Add Speaker" />
                                        <Field name="detail" >
                                            {({ field }: FieldProps) => (
                                                <Textarea rows={7} width="100%" placeholder="Enter details for this activity" {...field} />
                                            )}
                                        </Field>
                                    </VStack>
                                    <Checkbox name="streamed" >
                                        <Text textStyle="h6" fontSize="1rem" whiteSpace="nowrap" >
                                            This activity will be Streamed Live
                                                </Text>
                                    </Checkbox>
                                    <Stack direction={["column", "row"]} spacing={2}
                                        width="100%">
                                        <Button px={5} py={2} isLoading={formikProps.isSubmitting}
                                            loadingText={`Creating activity ${formikProps.values.title}`}
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
            <Dialog open={showDialog} size="xl" close={handleDialog} >
                <CustomDateCreator handleCustomForm={setSchedule}
                 close={handleDialog} customForm={schedule} />
            </Dialog>
        </>
    )
}


export default Create