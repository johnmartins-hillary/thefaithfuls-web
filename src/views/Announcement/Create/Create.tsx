import React from "react"
import {createAnnouncement} from "core/services/announcement.service"
import {useHistory} from "react-router-dom"
import {Heading,Stack,HStack,VStack,Textarea,Icon} from "@chakra-ui/react"
import {getGroupByChurch} from "core/services/group.service"
import { Formik,Field,FieldProps,FormikProps } from "formik"
import {createStyles,makeStyles} from "@material-ui/styles"
import DatePicker from "react-date-picker"
import {IGroup} from "core/models/Group"
import { BiRightArrowAlt} from "react-icons/bi"
import useToast from "utils/Toast"
import useParams from "utils/params"
import {TextInput,Select} from "components/Input"
import {MessageType} from "core/enums/MessageType"
import {Button} from "components/Button"
import {CreateLayout} from "layouts"
import * as Yup from "yup"

interface IForm {
    title:string;
    announcement:string;
    startDate:Date;
    expirationDate:Date;
    receiver:string;
}


const useStyles = makeStyles((theme) => createStyles({
    root:{
        alignItems:"flex-start !important"
    },
    inputContainer:{
        backgroundColor:"#F3F3F3",
        minHeight:"70vh",
        overflowX:"hidden",
        paddingBottom:"2rem",
        alignItems:"flex-start !important"
    },
    buttonContainer:{
        marginTop:"auto !important",
    },
    dateContainer:{
        borderColor:"2px solid black",
        color:"grey",
        "& > *":{
            padding:".7rem 1.7rem !important",
            paddingLeft:".4rem !important",
            borderRadius:"3px",
            "& select":{
                appearance:"none"
            }
        }
    }
}))



const Create = () => {
    const classes = useStyles()
    const history = useHistory()
    const [receiver,setReceiver] = React.useState<IGroup[]>()
    const toast = useToast()
    const currentDate = new Date()
    const params = useParams()

    React.useEffect(() => {
        const getChurchGroupApiCall = async () => {
            await getGroupByChurch(params.churchId).then(payload => {
                setReceiver(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to get list of receivers",
                    subtitle:`Error:${err}`,
                    messageType:"error"
                })
            })
        }
        getChurchGroupApiCall()
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const initialValues = {
        title: "",
        announcement:"",
        startDate:currentDate,
        expirationDate:new Date((new Date()).setDate(currentDate.getDate()+2)),
        receiver:""
    }
    const validationSchema = Yup.object({
        title:Yup.string().min(3,"Title of Announcement is too short").required(),
        announcement:Yup.string().min(10,"Announcement is too short ").required(),
        // receiver:Yup.string().min(5,"Receiver name is too short ").required(),
    })
    const handleSubmit = async (values:IForm, {...actions}: any) => {
        actions.setSubmitting(true)
        const newAnnouncement = {
            title:values.title,
            category:values.receiver,
            type:"1",
            churchId:Number(params.churchId),
            description:values.announcement,
            dateEntered:new Date((new Date()).toJSON()),
            startDate:new Date(values.startDate.toJSON()),
            expirationDate:new Date(values.expirationDate.toJSON())
        }

        createAnnouncement(newAnnouncement).then(payload => {
            actions.setSubmitting(false)
            toast({
                title:"New Announcement",
                subtitle:`Announcement ${newAnnouncement.title} has been created`,
                messageType:MessageType.SUCCESS
            })
            history.push(`/church/${params.churchId}/announcement`)
        }).catch(err => {
            toast({
                title:"Unable to create new Announcement",
                subtitle:`Error:${err}`,
                messageType:MessageType.ERROR
            })
        })
    }

    const goBack = () => {
        history.goBack()
    }

    return (
        <VStack pl={{ base:2, md: 12 }} pt={{ md: 6 }}
             className={classes.root} >
                <Heading textStyle="h4" >
                    New Announcement
                </Heading>
                <CreateLayout>
                <Formik initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                >
                                {(formikProps: FormikProps<IForm>) => {
                                    const onChange = (name:string) => (e:Date | any) => {
                                        if(name === "startDate"){
                                            const currentStartDate = new Date(e)
                                            formikProps.setValues({
                                                ...formikProps.values,
                                                [name]:e,
                                                expirationDate:new Date((currentStartDate).setDate(currentStartDate.getDate() + 1))
                                            })
                                        }else{
                                            formikProps.setValues({...formikProps.values,[name]:e})
                                        }
                                    }
                                    return (
                                        <>
                                        <VStack width="inherit" align="flex-start" >
                                            <TextInput width="100%" name="title" placeholder="Add Title" />
                                            <Select name="receiver" placeholder="Choose Groups to Send To" >
                                                {receiver?.map((item,idx) => (
                                                    <option value={item.name} key={idx} >
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </Select>
                                            <HStack>
                                                <DatePicker format="MMM dd,y" calendarIcon={null} clearIcon={null}
                                                    onChange={onChange("startDate")} value={formikProps.values.startDate}
                                                    className={classes.dateContainer} minDate={currentDate}
                                                />                   
                                                <Icon as={BiRightArrowAlt} />
                                                <DatePicker format="MMM dd,y" calendarIcon={null} clearIcon={null}
                                                    onChange={onChange("expirationDate")} value={formikProps.values.expirationDate}
                                                    className={classes.dateContainer} minDate={formikProps.values.startDate}
                                                />                   
                                            </HStack>
                                            <Field name="announcement" >
                                                {({field}:FieldProps) => (
                                                    <Textarea rows={7} width="100%" placeholder="Enter Announcement" {...field} />
                                                )}
                                            </Field>
                                        </VStack>
                                        <Stack direction="row" className={classes.buttonContainer} spacing={2}
                                            width="100%">
                                            <Button px={10} py={2}
                                             isLoading={formikProps.isSubmitting} loadingText={`Creating new Announcement`}
                                             disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                             onClick={(formikProps.handleSubmit as any)}>
                                                Publish
                                            </Button>
                                            <Button px={10} py={2} variant="outline"
                                             onClick={goBack} disabled={formikProps.isSubmitting} >
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