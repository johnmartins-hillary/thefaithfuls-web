import React from "react"
import FullCalendar,
{
  EventApi, DateSelectArg,
  EventClickArg, EventInput
} from "@fullcalendar/react"
import {
  AspectRatio, Flex, FormLabel, Heading, Image,
  ModalBody, ModalContent, ModalFooter, ScaleFade, Text, Textarea, VStack
} from "@chakra-ui/react"
import {
  primary,
  activityHeader
} from "theme/palette"
import { Button } from "components/Button"
import dayGridPlugin from "@fullcalendar/daygrid"
import rrulePlugin from "@fullcalendar/rrule"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Dialog } from "components/Dialog"
import * as Yup from "yup"
import { Field, FieldProps, Formik, FormikProps } from "formik"
import { TextInput } from "components/Input"
import { updatedActivityType } from "core/models/Activity"



const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: "98%",
    height: "75vh",
    "& .fc-toolbar-title": {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "initial"
      }
    },
    "& > *": {
      height: "75vh",
      "& button": {
        backgroundColor: `#707070 !important`,
        color: activityHeader,
        borderColor: "transparent !important",
        fontSize: ".75rem !important",
        [theme.breakpoints.up("sm")]: {
          fontSize: "1rem !important"
        }
      },
      "& th,td": {
        border: "2px #707070 solid",
        padding:"0 !important",
        "& > *": {
          backgroundColor: "#E1DFDF"
        }
      },
      [theme.breakpoints.up("sm")]: {
        // padding: "2rem",
        paddingTop: theme.spacing(1)
      }
    }
  },
  dayCellContainer: {
    backgroundColor: "grey"
  },
  eventContainer: {
    backgroundColor: "rgb(56, 56, 56)",
    borderLeft: `10px solid ${primary}`,
    borderLeftColor: `${primary} !important`,
    color: "whitesmoke"
  },
  cell: {
    height: "2rem !important",
    [theme.breakpoints.up("sm")]: {
      height: "5rem !important",
    }
  }
}))


interface DemoAppState {
  weekendsVisible: boolean;
  currentEvents: EventApi[]
}

const DayHeader = (props: any) => {
  const dateHeader = props.text.split(" ")
  return (
    <Flex direction="column" align="flex-start">
      <Heading color="secondary" fontFamily="Bahnschrift"
        fontWeight="400" fontSize={["1.5rem", "2rem"]} >
        {dateHeader[0]}
      </Heading>
      <Text fontSize={[".5rem", "0.875rem"]} marginTop="-0.6rem"
        fontFamily="Bahnschrift" opacity={.5} >
        {dateHeader[1]}
      </Text>
    </Flex>
  )
}

const SlotLabel = (props: any) => {
  return (
    <Text color="primary" textDecoration="underline" >
      {props.text}
    </Text>
  )
}

interface IProps {
  events: EventInput[];
  updateEvent(updatedActivity:updatedActivityType,func?:any):void
}

interface IForm {
  title: string;
  description: string;
  speaker: string;
}

interface IEventDialog {
  currentEvent: EventClickArg | null;
  setEvent: any;
  updateEvent(updatedActivity:updatedActivityType,func?:any):void
}

const EventDialog: React.FC<IEventDialog> = ({ currentEvent,updateEvent,setEvent }) => {

  const [image, setImage] = React.useState({
    name: "",
    base64: ""
  })
  const [showForm, setShowForm] = React.useState(false)
  const [isSubmitting,setIsSubmitting] = React.useState(false)
  const handleFormToggle = () => {
    setShowForm(!showForm)
  }
  if (!currentEvent) return <div>Loading...</div>
  const { event: { extendedProps } } = currentEvent

  const initialValues = {
    title: extendedProps.title,
    description: extendedProps.description,
    speaker: extendedProps.speaker || ""
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
  const validationScheme = Yup.object({
    title: Yup.string().min(3, "Title is too short").required(),
    description: Yup.string().min(3, "Title is too short").required(),
  })
  const handleToggle = () => {
    setIsSubmitting(!isSubmitting)
  }
  // currentEvent.view.
  const handleSubmit = async (values: IForm, { ...action }: any) => {
    handleToggle()
    action.setSubmitting(true)
      const updatedActivity:updatedActivityType = {
        title: values.title,
        description: values.description,
        speaker: values.speaker,
        // Check the type of activity sent and set the discriminator
        ...(image.base64 && { bannerUrl: image.base64 }),
        ...(extendedProps.eventId ? {
          type:"event",
          id:extendedProps.eventId
        }:{
          type:"activity",
          id:extendedProps.activityID
        })
      }
      const setSubmitToFalse = () => {
        handleToggle() 
        action.setSubmitting(false)
        setEvent(null)
      }
      await updateEvent(updatedActivity,setSubmitToFalse)
      console.log(isSubmitting)
    }
    console.log(isSubmitting)


  return (
    <ModalContent bg="bgColor2" >
      <ModalBody minH="35vh" >
        <ScaleFade initialScale={0.9} unmountOnExit in={!showForm} >
          <VStack>
            <AspectRatio w="100%" ratio={21 / 9}>
              <Image src={extendedProps.bannerUrl} objectFit="cover" />
            </AspectRatio>
            <Heading>{extendedProps.title}</Heading>
            <Text>{extendedProps.description}</Text>
            {
              extendedProps.speaker &&
              <Text>{extendedProps.speaker}</Text>
            }
          </VStack>
        </ScaleFade>
        <ScaleFade initialScale={0.9} unmountOnExit in={showForm} >
          <Formik initialValues={initialValues}
            validationSchema={validationScheme}
            onSubmit={handleSubmit}
          >
            {(formikProps: FormikProps<IForm>) => (
              <VStack>
                <Flex align="center" p={3} w={image.base64 ? "100%" : ""}
                  border="2px dashed rgba(0,0,0,.4)" flex={7}>
                  <input id="image" type="file" accept="image/jpeg,image/png"
                    onChange={handleImageTransformation}
                    style={{ display: "none" }} />
                  <FormLabel mr="0" htmlFor="image" w="100%" >
                    {image.name.length > 0 ?
                      <AspectRatio w="100%" ratio={21 / 9}>
                        <Image src={image.base64} objectFit="cover" />
                      </AspectRatio>
                      :
                      <Button color="white" as="span"
                              bgColor="rgba(0,0,0,.6)">
                              Upload New Poster
                      </Button>
                    }
                  </FormLabel>
                </Flex>
                <TextInput name="title" />
                <TextInput name="speaker" />
                <Field name="description" >
                  {({ field }: FieldProps) => (
                    <Textarea rows={5} width="100%" placeholder="Enter details for this activity" {...field} />
                  )}
                </Field>
                <Button px={5} py={2} isLoading={formikProps.isSubmitting || isSubmitting}
                  loadingText={`Updating activity ${formikProps.values.title}`}
                  disabled={formikProps.isSubmitting || isSubmitting || !formikProps.dirty || !formikProps.isValid}
                  onClick={(formikProps.handleSubmit as any)}>
                  Update Activity
                  </Button>

              </VStack>
            )}
          </Formik>
        </ScaleFade>
      </ModalBody>
      <ModalFooter display="flex" flexDirection="column"
        alignItems="center" >
        <Flex width="98%" flexDirection={["column", "row"]}
          justifyContent="space-between" mb={3} >
          <Button w="48%" variant="outline" disabled={ isSubmitting} onClick={handleFormToggle}>
            Edit
          </Button>
          <Button onClick={currentEvent?.event.remove} disabled={ isSubmitting} w="48%">
            Delete
          </Button>
        </Flex>
      </ModalFooter>
    </ModalContent>

  )
}


const Calendar: React.FC<IProps> = ({ events,updateEvent }) => {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = React.useState(false)
  const [currentEvent, setCurrentEvent] = React.useState<EventClickArg | null>(null)
  const [state, setState] = React.useState<DemoAppState>({
    weekendsVisible: true,
    currentEvents: []
  })
  const handleToggle = () => {
    setOpenDialog(!openDialog)
  }
  React.useEffect(() => {
    if (currentEvent?.event.extendedProps) {
      setOpenDialog(true)
    } else {
      setOpenDialog(false)
    }
  }, [currentEvent])

  console.log(state.currentEvents)
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
    setCurrentEvent(clickInfo)
    // alert("event clicked",JSON.stringify(clickInfo,null,2))
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
          dayHeaderFormat={{ weekday: "long", day: "2-digit" }} eventClassNames={classes.eventContainer}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
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
          */
          eventRemove={function (...arg) { console.log("this are the args", arg) }}
        />
      </div>
      <Dialog open={openDialog} size="md" close={handleToggle}>
        <EventDialog currentEvent={currentEvent} updateEvent={updateEvent} setEvent={setCurrentEvent} />
      </Dialog>
    </>
  )
}



export default Calendar