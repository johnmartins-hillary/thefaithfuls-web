import React from "react"
import { useHistory, useLocation } from "react-router-dom"
import { createSermon } from "core/services/sermon.service"
import {
    Flex, Text, Heading, Stack,
    VStack, Icon, Image, AspectRatio, HStack, IconButton
} from "@chakra-ui/react"
import { BsCardImage } from "react-icons/bs"
import { Button } from "components/Button"
import NormalInput from "components/Input/Normal"
import { Formik, Field, FieldProps, FormikProps } from "formik"
import DatePicker from "react-date-picker"
import { createStyles, makeStyles } from "@material-ui/styles"
import * as sermonDraftHelper from "./sermonUtil"
import * as Yup from "yup"
import {generateReference,verifyTransaction} from "core/services/payment.service"
import { buttonBackground } from "theme/palette"
import { BiRightArrowAlt } from "react-icons/bi"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { Editor } from "@tinymce/tinymce-react"
import {CreateLayout} from "layouts"
import axios from "axios"
import {useSelector} from "react-redux"
import {AppState} from "store"
import {Purpose,Payment} from "core/enums/Payment"
import {MessageType} from "core/enums/MessageType"
import {PaymentButton} from "components/PaymentButton"

interface IForm {
    title: string;
    author: string;
    featureDateTo: Date;
    featureDateFrom: Date;
    sermonContent: string;
    authorDesignation: string;
}

const useStyles = makeStyles((theme) => createStyles({
    root: {
        alignItems: "flex-start !important"
    },
    inputContainer: {
        backgroundColor: "#F3F3F3",
        minHeight: "70vh",
        paddingBottom: "2rem",
        alignItems: "flex-start !important"
    },
    imageContainer: {
        border: "1px dashed rgba(0, 0, 0, .5)",
        borderRadius: "4px",
        width: "25vh",
        height: "25vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "& svg": {
            color: "#151C4D",
        },
        "& h4":{
            fontFamily:"Bahnschrift"
        },
        "& p":{
            fontFamily:"MontserratRegular"
        },
        "& h4,p": {
            color: "#151C4D",
            whiteSpace: "nowrap"
        }
    },
    input: {
        display: "none"
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


const Content = () => {
    const apiKey = process.env.REACT_APP_TINYMCE_API_KEY
    const classes = useStyles()
    const currentChurch = useSelector((state:AppState) => state.system.currentChurch)
    const currentDate = new Date()
    const [initialValues, setInitialValues] = React.useState({
        title: "",
        author: "",
        featureDateTo: currentDate,
        featureDateFrom: new Date((new Date()).setDate(currentDate.getDate() + 5)),
        sermonContent: "",
        authorDesignation: "",
    })
    const [showForm,setShowForm] = React.useState(false)
    const [submitting,setSubmitting] = React.useState(false)
    const history = useHistory()
    const location = useLocation()
    const [transactRef,setTransactRef] = React.useState({
        reference:"",
        publicKey:""
    })
    const params = useParams()
    const toast = useToast()
    const toggleSubmitting = () => {
        setSubmitting(!submitting)
    }
    const [image, setImage] = React.useState({
        name: "",
        base64: ""
    })

    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        generateReference({
            amount:2000,
            organizationId:currentChurch.churchID as number,
            organizationType:"church",
            paymentGatewayType:Payment.PAYSTACK,
            purpose:Purpose.SERMON,
        },cancelToken).then(payload => {
            setTransactRef({
                ...transactRef,
                reference:payload.data.reference,
                publicKey:payload.data.publicKey
            })
        }).catch(err => {
            toast({
                title: "Unable to Get Church detail",
                messageType: MessageType.ERROR,
                subtitle: `Error: ${err}`
            })
        })
        
        if (location.search) {
            const decodedTitle = decodeURI(location.search)
            const defaultSermon = sermonDraftHelper.getSermonFromLocalStorage(decodedTitle.split("=")[1])
            if (defaultSermon) {
                setInitialValues({
                    title:defaultSermon.title,
                    author:defaultSermon.author || "",
                    sermonContent:defaultSermon.sermonContent,
                    authorDesignation:defaultSermon.authorDesignation || "",
                    featureDateFrom:new Date(defaultSermon.featureDateFrom),
                    featureDateTo:new Date(defaultSermon.featureDateTo)
                })
            }
        }
        setShowForm(true)
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleImageTransformation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setImage({ ...image, base64: (reader.result as string), name: file.name })
            }
            reader.readAsDataURL(file)
        }
    }

    const validationSchema = Yup.object({
        title: Yup.string().min(3, "Title of sermon is too short").required(),
        author: Yup.string().min(3, "Author name is not valid").required(),
        sermonContent: Yup.string().min(100, "Sermon is too short ").required(),
    })


    const saveSermonToDraft = (values: IForm) => () => {
        sermonDraftHelper.saveSermonToLocalStorage({ ...values, churchId: Number(params.churchId) }, toast)
        history.push(`/church/${params.churchId}/media`)
    }

    const goBack = () => {
        if(initialValues.title.length > 0){
            sermonDraftHelper.removeSermonFromLocalStorage(initialValues.title)
        }
        history.goBack()
    }
    
    const handleSubmit = async (values: IForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const { title, author, authorDesignation, featureDateFrom, featureDateTo, sermonContent } = values
        const newSermon = {
            title,
            author,
            authorDesignation,
            featureDateFrom:featureDateFrom.toJSON(),
            featureDateTo:featureDateTo.toJSON(),
            sermonContent,
            churchId:params.churchId,
            ...(image.base64 && { featureImage: image.base64 })
        }
        const sermonData = new FormData()
        Object.entries(newSermon).map((item,idx) => (
            sermonData.append(item[0],String(item[1]))
        ))
        await createSermon(sermonData).then(payload => {
            actions.setSubmitting(false)
            toggleSubmitting()
            toast({
                title: "New Sermon",
                subtitle: "New Sermon has been successfully created",
                messageType: "success"
            })
            actions.resetForm()
            actions.setSubmitting(false)
            if (initialValues.title.length > 1){
                sermonDraftHelper.removeSermonFromLocalStorage(newSermon.title)
            }
            history.push(`/church/${params.churchId}/media`)
        }).catch(err => {
            toggleSubmitting()
            actions.setSubmitting(false)
            toast({
                title: "Unable to create new sermon",
                subtitle: `Error:${err}`,
                messageType: "error"
            })
        })
    }
    const handlePaymentAndSubmission = (func:any) => (refCode:any) => {
        toggleSubmitting()
        verifyTransaction(Payment.PAYSTACK,refCode.reference).then(payload => {
            toast({
                title:"Sermon Payment Successful",
                subtitle:"",
                messageType:MessageType.SUCCESS
            })
            func()
        }).catch(err => {
            toast({
                title:"Unable to complete Sermon Payment",
                subtitle:`Error:${err}`,
                messageType:MessageType.ERROR
            })
        })
    }

    const handleFailure = (error: any) => {
        toast({
            title: "Something Went Wrong during payment",
            subtitle: `Error:err`,
            messageType: MessageType.ERROR
        })
    }

    const handlePaymentClose = () => {
        history.goBack()
    }
    
    return (
        <VStack pl={{ base: 2, md: 12 }} pt={{ md: 6 }}
            className={classes.root} >
            <Heading textStyle="h4" >
                New Sermon
                </Heading>
            <CreateLayout>
            <VStack width={["100%", "90%"]} align="flex-start"
                    spacing={3}>
                    <Stack direction={{ base: "column-reverse", md: "row" }} >
                        <Flex className={classes.imageContainer} p={5} >
                            <input accept="image/jpeg,image/png" onChange={handleImageTransformation} type="file"
                                className={classes.input} id="icon-button-file" />
                            <label htmlFor="icon-button-file">
                                <IconButton as="span" padding={4} boxSize="5rem" aria-label="submit image"
                                    borderRadius="50%" bgColor={buttonBackground}
                                    icon={<BsCardImage fontSize="2.5rem" />} />
                            </label>
                            <Heading as="h4" mt={2} fontSize="1.125rem" >Upload Image</Heading>
                            {
                                image.name ?
                                    <Text fontSize="0.68rem" opacity={.5} isTruncated maxW="2xs" >{image.name}</Text> :
                                    <Text fontSize="0.68rem" opacity={.5}>Dimension 200px by 400px</Text>
                            }
                        </Flex>
                        {image.base64 &&
                            <AspectRatio width={["75vw", "40vw"]} maxW="15rem" ratio={4 / 2} >
                                <Image src={image.base64} />
                            </AspectRatio>
                        }
                    </Stack>
                    <Text fontSize="0.8rem" opacity={.5}>File size not more than 100mb</Text>
                </VStack>
                <VStack width="100%">
                    {
                        showForm &&
                        <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {(formikProps: FormikProps<IForm>) => {
                            const onChange = (name: string) => (e: Date | any) => {
                                if (name === "featureDateFrom") {
                                    const currentStartDate = new Date(e)
                                    formikProps.setValues({
                                        ...formikProps.values,
                                        [name]: e,
                                        featureDateTo: new Date((currentStartDate).setDate(currentStartDate.getDate() + 1))
                                    })
                                } else {
                                    formikProps.setValues({ ...formikProps.values, [name]: e })
                                }
                            }
                            const handleEditChange = (content: string, editor: any) => {
                                formikProps.setValues({ ...formikProps.values, sermonContent: content })
                            }
                            return (
                                <>
                                    <VStack width="inherit" align="flex-start" >
                                        <NormalInput width="100%" maxW="md" name="title" placeholder="Input title" />
                                        <NormalInput width="100%" maxW="md" name="author" placeholder="Author Name" />
                                        <HStack alignSelf="flex-start" >
                                            <DatePicker format="MMM dd,y" calendarIcon={null} clearIcon={null}
                                                onChange={onChange("featureDateFrom")} value={formikProps.values.featureDateFrom}
                                                className={classes.dateContainer} minDate={currentDate}
                                            />
                                            <Icon as={BiRightArrowAlt} />
                                            <DatePicker format="MMM dd,y" calendarIcon={null} clearIcon={null}
                                                onChange={onChange("featureDateTo")} value={formikProps.values.featureDateTo}
                                                className={classes.dateContainer} minDate={formikProps.values.featureDateFrom}
                                            />
                                        </HStack>
                                        <Field name="sermonContent" >
                                            {({ field }: FieldProps) => (
                                                <Editor apiKey={apiKey}
                                                    initialValue={initialValues.sermonContent}
                                                    init={{
                                                        height: 500,
                                                        width: "100%",
                                                        // placeholder:"Input Your sermon here",
                                                        autosave_restore_when_empty: true,
                                                        menubar: 'preview file view format help',
                                                        plugins: [
                                                            // eslint-disable-next-line
                                                            'advlist autolink lists link image charmap print preview anchor',
                                                            'searchreplace visualblocks code fullscreen',
                                                            'insertdatetime media table paste code help wordcount'
                                                        ],
                                                        toolbar:
                                                            // eslint-disable-next-line    
                                                            'undo redo | formatselect | bold italic backcolor | \
                                                            alignleft aligncenter alignright alignjustify | \
                                                            bullist numlist outdent indent | removeformat',
                                                        toolbar_mode: "sliding",
                                                        style_formats_autohide: true,
                                                        preview_styles: "Mulish 100px 900"
                                                    }}
                                                    onEditorChange={handleEditChange}
                                                />
                                            )}
                                        </Field>
                                    </VStack>
                                    <Stack direction={["column", "row"]} spacing={2}
                                        width="100%">
                                        <PaymentButton
                                            paymentCode={transactRef}
                                            onSuccess={handlePaymentAndSubmission(formikProps.handleSubmit)} amount={200_000}
                                            onClose={handlePaymentClose} onFailure={handleFailure}
                                        >
                                            <Button px={5} py={2}
                                                disabled={formikProps.isSubmitting || submitting || !formikProps.dirty || !formikProps.isValid}>
                                                {formikProps.isSubmitting ? "Creating a New Sermon..." : "Pay to Publish"}
                                            </Button>
                                        </PaymentButton>
                                        <Button variant="outline" onClick={saveSermonToDraft(formikProps.values)}
                                            disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}>
                                            Save To draft
                                        </Button>
                                        <Flex flex={1} />
                                        <Button variant="link" disabled={formikProps.isSubmitting}
                                            onClick={goBack}
                                            textDecoration="underline" ml="auto" color="primary">
                                                Discard
                                        </Button>
                                    </Stack>
                                </>
                            )
                        }}
                    </Formik>
                    }
                </VStack>
            </CreateLayout>
        </VStack>
    )
}


export default Content