import React from "react"
import {Link} from "react-router-dom"
import {HStack,VStack,Text} from "@chakra-ui/react"
import {Button} from "components/Button"
import {IEvent} from "core/models/Event"
import {IActivity,ISchedule} from "core/models/Activity"
import * as activityService from "core/services/activity.service"
import {useDispatch} from "react-redux"
import {setPageTitle} from "store/System/actions"
import {Calendar} from "components/Calendar"
import { EventInput} from "@fullcalendar/react"
import useToast from "utils/Toast"
import useParams from "utils/params"
import {MessageType} from "core/enums/MessageType"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import axios from "axios"

const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        "& p,h2":{
            fontFamily:"Bahnschrift !important",
        },
        "& button":{
            fontSize:".9rem",
            [theme.breakpoints.up("sm")]:{
                fontSize:"1.3rem"
            }
        }
    }
}))

const Activity = () => {
    const toast = useToast()
    const params = useParams()
    const classes = useStyles()
    const dispatch = useDispatch()
    const [churchActivity, setChurchActivity] = React.useState<IActivity<ISchedule>[]>([])
    const [churchEvent, setChurchEvent] = React.useState<IEvent[]>([])
    const [calendarEvent,setCalendarEvent] = React.useState<EventInput[]>([])
    const [showCalendar,setShowCalendar] = React.useState(false)

    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        const getChurchActivity = async () => {
            activityService.getChurchActivity(params.churchId,cancelToken).then(payload => {
                const newChurchActivity = payload.data.map((item) => ({
                    ...item,
                    schedule:JSON.parse(item.schedule)
                }))
                setChurchActivity(newChurchActivity)
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
        const getChurchEvent = async () => {
            activityService.getChurchEvent(params.churchId,cancelToken).then(payload => {
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
        getChurchActivity()
        getChurchEvent()
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        setTimeout(() => {
            setShowCalendar(true)
        },1500)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[churchActivity])

    React.useEffect(() => {
        dispatch(setPageTitle("Church Activities"))
        const newEvents:EventInput[] = churchEvent.map((item,idx) => ({
            title:item.title,
            start:item.startDateTime,
            end:item.endDateTime,
            id:(item.eventId as unknown as string),
            allDay:item.schedule === "Daily" ? true : false
        }))
        const churchCalendarActivity:EventInput[] = churchActivity.map((item) => ({
            title:item.title,
            start:(item.schedule.time.startDate as string),
            end:(item.schedule.time.endDate as string),
            id:(item.activityID as unknown as string),
            ...(item.schedule.recurrence && {rrule:item.schedule.recurrence})
        })) 
        const calendarEvents = [...newEvents,...churchCalendarActivity]
        setCalendarEvent(calendarEvents)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[churchEvent,churchActivity])

    return(
        <VStack width="100%" mt="3" className={classes.root} >
            <HStack>
                <Link to={`/church/${params.churchId}/activity/create`} >
                    <Button>
                        Add church activity
                    </Button>              
                </Link>
                <Link to={`/church/${params.churchId}/event/create`} >
                    <Button variant="outline" >
                        Add church event
                    </Button>              
                </Link>
            </HStack>
            {
                calendarEvent.length < 1 &&
                <Text color="primary">
                    No Available Events / Activity
                </Text>
            }
            {
                showCalendar &&
                <Calendar events={calendarEvent} />  
            }
        </VStack>
    )
}


export default Activity