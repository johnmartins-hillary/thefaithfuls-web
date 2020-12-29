import React from "react"
import FullCalendar,
{
  EventApi, DateSelectArg,
  EventClickArg,EventInput
} from "@fullcalendar/react"
import {Flex,Heading,Text} from "@chakra-ui/react"
import {
  primary,
 activityHeader
} from "theme/palette"
import dayGridPlugin from "@fullcalendar/daygrid"
import rrulePlugin from "@fullcalendar/rrule"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"


const useStyles = makeStyles((theme:Theme) => createStyles({
  root:{
    width:"98%",
    height:"75vh",
    "& .fc-toolbar-title":{
        display:"none",
        [theme.breakpoints.up("sm")]:{
          display:"initial"
        }
    },
    "& > *":{
      height:"75vh",
      "& button":{
        backgroundColor:`#707070 !important`,
        color:activityHeader,
        borderColor:"transparent !important",
        fontSize:".9rem !important",
            [theme.breakpoints.up("sm")]:{
                fontSize:"1.5rem !important"
            }
      },
      "& th,td":{
        border:"2px #707070 solid",
        "& > *":{
          backgroundColor:"#E1DFDF"
        }
      },
      [theme.breakpoints.up("sm")]:{
        padding:"2rem",
        paddingTop:theme.spacing(1)
      }
    }
  },
  dayCellContainer:{
    backgroundColor:"grey"
  },
  eventContainer:{
    backgroundColor:"rgb(56, 56, 56)",
    borderLeft:`10px solid ${primary}`,
    borderLeftColor: `${primary} !important`,
    color:"whitesmoke"
  },
  cell:{
    height:"2rem !important",
    [theme.breakpoints.up("sm")]:{
      height:"5rem !important",
    }
  }
}))


interface DemoAppState {
  weekendsVisible: boolean;
  currentEvents: EventApi[]
}

const DayHeader = (props:any) => {
  const dateHeader = props.text.split(" ")
  return(
    <Flex direction="column" align="flex-start">
        <Heading color="secondary" fontFamily="Bahnschrift"
         fontWeight="400" fontSize={["1.5rem","2rem"]} >
        {dateHeader[0]}
        </Heading>
        <Text fontSize={[".5rem","0.875rem"]} marginTop="-0.6rem"
            fontFamily="Bahnschrift" opacity={.5} >
        {dateHeader[1]}
        </Text>
    </Flex>
  )
}

const SlotLabel = (props:any) => {
  return(
    <Text color="primary" textDecoration="underline" >
      {props.text}
    </Text>
  )
}

interface IProps {
  events:EventInput[]
}

const Calendar:React.FC<IProps> = ({events}) => {
  const classes = useStyles()
  const [state, setState] = React.useState<DemoAppState>({
    weekendsVisible: true,
    currentEvents: []
  })

  // const handleWeekendsToggle = () => {
  //   setState({
  //     ...state,
  //     weekendsVisible: !state.weekendsVisible
  //   })
  // }
  const handleEvents = (evt: EventApi[]) => {
    setState({ ...state, currentEvents: evt })
  }
  // function renderSidebarEvent(event: EventApi) {
  //   return (
  //     <li key={event.id}>
  //       <b>{formatDate(event.start!, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
  //       <i>{event.title}</i>
  //     </li>
  //   )
  // }
  // const renderSidebar = () => {
  //   return (
  //     <div className='demo-app-sidebar'>
  //       <div className='demo-app-sidebar-section'>
  //         <h2>Instructions</h2>
  //         <ul>
  //           <li>Select dates and you will be prompted to create a new event</li>
  //           <li>Drag, drop, and resize events</li>
  //           <li>Click an event to delete it</li>
  //         </ul>
  //       </div>
  //       <div className='demo-app-sidebar-section'>
  //         <label>
  //           <input
  //             type='checkbox'
  //             checked={state.weekendsVisible}
  //             onChange={handleWeekendsToggle}
  //           ></input>
  //               toggle weekends
  //             </label>
  //       </div>
  //       <div className='demo-app-sidebar-section'>
  //         <h2>All Events ({state.currentEvents.length})</h2>
  //         <ul>
  //           {state.currentEvents.map(renderSidebarEvent)}
  //         </ul>
  //       </div>
  //     </div>
  //   )
  // }
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Please enter a new title for your event")
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect()

    if (title) {
      calendarApi.addEvent({
        id: "3",
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }
  const handleEventClick = (clickInfo: EventClickArg) => {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //     clickInfo.event.remove()
    //   }
  }
  // const renderEventContent = (eventContent: EventContentArg) => {

  //   return(
  //     <Flex bgColor="#383838" cursor="pointer" borderLeft={`10px solid ${primary}`} borderRadius="6px" >
  //       <Text fontSize="1rem" color="white">
  //           {eventContent.event.title}
  //       </Text>
  //   </Flex>
  //   )
  // }
  return (
    <>
      <div className={classes.root}>
      <FullCalendar allDaySlot={false} dayHeaderContent={DayHeader} slotLabelContent={SlotLabel}
        slotLabelClassNames={classes.cell} slotLaneClassNames={classes.cell}
        dayHeaderFormat={{weekday:"long",day:"2-digit"}} eventClassNames={classes.eventContainer}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin,rrulePlugin]}
            headerToolbar={{
              left: 'prev,today,next',
              center: 'title',
              right: 'dayGridMonth timeGridWeek timeGridDay'
            }} 
            initialView='timeGridWeek'
            editable={true}
            // selectable={true}
            // selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            initialEvents={events} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            // eventContent={renderEventContent} //custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
      </div>
    </>
  )
}



export default Calendar