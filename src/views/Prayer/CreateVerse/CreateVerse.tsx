import React from "react"
import {useHistory} from "react-router-dom"
import {
    Flex,Heading, Stack, VStack
} from "@chakra-ui/react"
import { Button } from "components/Button"
import NormalInput from "components/Input/Normal"
import { Formik,FormikProps } from "formik"
import { createStyles, makeStyles } from "@material-ui/styles"
import * as Yup from "yup"
import {CreateLayout} from "layouts"
import {DatePicker} from "components/Input"


interface IForm {
    date:Date;
    verse:string;
}


const useStyles = makeStyles((theme) => createStyles({
    root: {
        alignItems: "flex-start !important"
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
    const history = useHistory()
    const classes = useStyles()
    // eslint-disable-next-line
    const [redirect,setRedirect] = React.useState(true)    

    const initialValues = {
        date: new Date(),
        verse:"",
    }

    const validationScheme = Yup.object({
        name: Yup.string().min(3, "Prayer Title is too short").required()
    })

    const handleSubmit = async (values: IForm, {...action}: any) => {
        action.setSubmitting(true)
            // const newPrayer = {
            //     prayerName:values.name,
            //     prayerdetail:values.detail,
            //     denominationID:currentChurch.denominationId || 3,
            //     denomination:currentChurch.denomination || "Pentecostal"
            // }
            // addPrayer(newPrayer).then(payload => {
            //     action.setSubmitting(false)
            //     toast({
            //         title:"Success",
            //         subtitle:`New Prayer ${payload.data.prayerName} Created`,
            //         messageType:MessageType.SUCCESS
            //     })
            //     action.resetForm()
            //     if(redirect){
            //         history.push(`/church/${params.churchId}/Prayer?tab=2`)
            //     }else{
            //         setRedirect(false)
            //     }
            // }).catch(err => {
            //     action.setSubmitting(false)
            //     toast({
            //         title:"Unable to create new Prayer",
            //         subtitle:`Error: ${err}`,
            //         messageType:MessageType.ERROR

            //     })
            // })
    }
    const goBack = () => {
        history.goBack()
    }

    return (
        <VStack pl={{ base: 2, md: 12 }} pt={{ md: 6 }}
                className={classes.root} >
                <Heading textStyle="h4" >
                    Add Verse of the day
                </Heading>
                <CreateLayout>
                <Formik initialValues={initialValues}
                        validationSchema={validationScheme}
                        onSubmit={handleSubmit}
                    >
                        {(formikProps: FormikProps<IForm>) => {
                            const onChange = (name: string) => (e: Date | any) => {
                                formikProps.setValues({ ...formikProps.values, [name]: e })
                            }
                            return (
                                <VStack width="100%" maxW="xl">
                                    <VStack width="inherit" align="flex-start" >
                                        <DatePicker name="date" value={formikProps.values.date} showCalendarIcon={true}
                                         onChange={onChange("date")} width="100%" />
                                        <NormalInput width="100%" name="verse" placeholder="Add a verse(optional)" />
                                    </VStack>
                                    <Stack direction={{base:"column",md:"row"}} spacing={2}
                                        width="100%">
                                        <Button px={5} py={2} disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                            onClick={(formikProps.handleSubmit as any)} 
                                            isLoading={formikProps.isSubmitting} loadingText="Creating new Advert"
                                            >
                                                Publish
                                        </Button>
                                        <Flex flex={1} />
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