import React from "react"
import {useHistory} from "react-router-dom"
import {
    Heading, Stack, VStack, Textarea
} from "@chakra-ui/react"
import { Button } from "components/Button"
import NormalInput from "components/Input/Normal"
import { Formik, Field, FieldProps, FormikProps } from "formik"
import { createStyles, makeStyles } from "@material-ui/styles"
import {useSelector} from "react-redux"
import {addPrayer} from "core/services/prayer.service"
import {AppState} from "store"
import * as Yup from "yup"
import useParams from "utils/params"
import useToast from "utils/Toast"
import { MessageType } from "core/enums/MessageType"
import {CreateLayout} from "layouts"


interface IForm {
    name:string;
    verse:string;
    detail:string;
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
    }
}))


const Create = () => {
    const params = useParams()
    const history = useHistory()
    const toast = useToast()
    const classes = useStyles()
    const [redirect,setRedirect] = React.useState(true)
    const currentChurch = useSelector((state:AppState) => state.system.currentChurch)


    const initialValues = {
        name: "",
        verse:"",
        detail: ""
    }


    const validationScheme = Yup.object({
        name: Yup.string().min(3, "Prayer Title is too short").required()
    })

    const handleSubmit = async (values: IForm, {...action}: any) => {
        action.setSubmitting(true)
            const newPrayer = {
                prayerName:values.name,
                prayerdetail:values.detail,
                denominationID:currentChurch.denominationId || 3,
                denomination:currentChurch.denomination || "Pentecostal"
            }
            addPrayer(newPrayer).then(payload => {
                action.setSubmitting(false)
                toast({
                    title:"Success",
                    subtitle:`New Prayer ${payload.data.prayerName} Created`,
                    messageType:MessageType.SUCCESS
                })
                action.resetForm()
                if(redirect){
                    history.push(`/church/${params.churchId}/Prayer?tab=2`)
                }else{
                    setRedirect(false)
                }
            }).catch(err => {
                action.setSubmitting(false)
                toast({
                    title:"Unable to create new Prayer",
                    subtitle:`Error: ${err}`,
                    messageType:MessageType.ERROR

                })
            })
    }
    const goBack = () => {
        history.goBack()
    }

    const handleSubmitAndNoRedirect = (func:any) => () => {
        setRedirect(false)
        func()
        
    }
    return (
        <VStack pl={{ base: 2, md: 12 }} pt={{ md: 6 }}
                className={classes.root} >
                <Heading textStyle="h4" >
                    Create Church Prayers
                </Heading>
                <CreateLayout>
                <Formik initialValues={initialValues}
                        validationSchema={validationScheme}
                        onSubmit={handleSubmit}
                    >
                        {(formikProps: FormikProps<IForm>) => {
                            return (
                                <VStack width="100%" maxW="xl">
                                    <VStack width="inherit" align="flex-start" >
                                        <NormalInput width="100%" name="name" placeholder="Input title" />
                                        <NormalInput width="100%" name="verse" placeholder="Add a verse(optional)" />
                                        <Field name="detail" >
                                            {({ field }: FieldProps) => (
                                                <Textarea rows={7} width="100%" {...field} />
                                            )}
                                        </Field>
                                    </VStack>
                                    <Stack direction={{base:"column",md:"row"}} spacing={2}
                                        width="100%" justifyContent="space-between">
                                        <Button px={5} py={2} disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                            onClick={(formikProps.handleSubmit as any)} 
                                            isLoading={formikProps.isSubmitting} loadingText="Creating new Advert"
                                            >
                                                Publish
                                        </Button>
                                        <Button variant="link" onClick={(handleSubmitAndNoRedirect(formikProps.handleSubmit) as any)}
                                          disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                         textDecoration="underline">
                                            Publish and Create another prayer
                                        </Button>
                                        <Button ml="auto" onClick={goBack}
                                         variant="outline" disabled={formikProps.isSubmitting}>
                                            Close
                                        </Button>
                                    </Stack>
                                </VStack>
                            )
                        }}
                    </Formik>
                
                </CreateLayout>
            </VStack>
    )
}


export default Create