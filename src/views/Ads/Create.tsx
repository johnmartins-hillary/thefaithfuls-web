import React from "react"
import { useHistory } from "react-router-dom"
import {
    Flex, Text, Heading, HStack, IconButton,
    Icon, Stack, VStack, AspectRatio, Image,Box
} from "@chakra-ui/react"
import { BsCardImage } from "react-icons/bs"
import { Button } from "components/Button"
import {TextInput as NormalInput,Select} from "components/Input"
import { createAdvert,getAdvertSetting } from "core/services/ads.service"
import {generateReference,verifyTransaction} from "core/services/payment.service"
import { Formik,FormikProps } from "formik"
import { createStyles, makeStyles } from "@material-ui/styles"
import { BiRightArrowAlt } from "react-icons/bi"
import * as Yup from "yup"
import useParams from "utils/params"
import useToast from "utils/Toast"
import { buttonBackground } from "theme/palette"
import DatePicker from "react-date-picker"
import { MessageType } from "core/enums/MessageType"
import { GoBackButton } from "components/GoBackButton"
import {Purpose,Payment} from "core/enums/Payment"
import {CreateLayout} from "layouts"
import {useSelector} from "react-redux"
import {AppState} from "store"
import {PaymentButton} from "components/PaymentButton"
import {IAdvert,IAdvertSetting} from "core/models/Advert"
import axios from "axios"
import * as advertDraftHelper from "./advertUtil"


const useStyles = makeStyles((theme) => createStyles({
    root: {
        "& a,button": {
            fontFamily: "MulishRegular"
        },
        "& p,i":{
            fontFamily:"MulishRegular"
        }
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
    },
    activeImage:{
            width:"100%",
            height:"100%",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
    }
}))

interface IForm {
    title:string;
    dateFrom:Date;
    dateTo:Date;
    advertUrl:string
}

const Create = () => {
    const params = useParams()
    const history = useHistory()
    const toast = useToast()
    const classes = useStyles()
    const currentDate = new Date()
    const [advertSetting,setAdvertSetting] = React.useState<IAdvertSetting[]>([])
    const [currentAdvertSetting,setCurrentAdvertSetting] = React.useState<IAdvertSetting>()
    const [difference, setDifference] = React.useState<number>(1)
    const currentChurch = useSelector((state:AppState) => state.system.currentChurch)
    const [submitting,setSubmitting] = React.useState(false)
    const [amount,setAmount] = React.useState(1000)
    const [image, setImage] = React.useState({
        base64: "",
        name: ""
    })
    const [transactRef,setTransactRef] = React.useState({
        reference:"",
        publicKey:""
    })
    
    const cancelToken = axios.CancelToken.source()
    const getPaymentReference = (amount:number) => {
        generateReference({
            amount,
            organizationId:currentChurch.churchID as number,
            organizationType:"church",
            paymentGatewayType:Payment.PAYSTACK,
            purpose:Purpose.SERMON,
        },cancelToken).then(payload => {
            setTransactRef({
                reference:payload.data.reference,
                publicKey:payload.data.publicKey
            })
        }).catch(err => {
            if(axios.isCancel(err)){
                toast({
                    title: "Unable to Get Church Reference",
                    messageType: MessageType.ERROR,
                    subtitle: `Error: ${err}`
                })
            }
        })
        
    }
    React.useEffect(() => {
        const newAmount = 2000*difference
        getPaymentReference(newAmount)
        setAmount(newAmount)
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [difference])

    const initialValues = {
        title: "",
        link: "",
        dateFrom: currentDate,
        dateTo: new Date((new Date()).setDate(currentDate.getDate() + 1)),
        advertUrl: ""
    }
    
    const toggleSubmitting = () => {
        setSubmitting(!submitting)
    }
    
    const validationScheme = Yup.object({
        title: Yup.string().min(3, "Title of Advert is too short").required(),
    })

    const handleSubmit = async (values: IForm, { ...action }: any) => {
        action.setSubmitting(true)
        if (!image.base64) {
            action.setSubmitting(false)
            return action.setErrors({ advertUrl: "Please Select an Image" })
        } else {
            const newAdvert = {
                title: values.title,
                dateFrom: values.dateFrom.toJSON(),
                dateTo: values.dateTo.toJSON(),
                churchId: Number(params.churchId),
                audience: "isInternal",
                status: 1,
                ...(image && { advertUrl: image.base64 })
            }
            createAdvert(newAdvert).then(payload => {
                action.setSubmitting(false)
                toggleSubmitting()
                toast({
                    title: "Success",
                    subtitle: `New Advert ${payload.data.title} Created`,
                    messageType: MessageType.SUCCESS
                })
                history.push(`/church/${params.churchId}/ads`)
            }).catch(err => {
                toggleSubmitting()
                action.setSubmitting(false)
                toast({
                    title: "Unable to create new advert",
                    subtitle: `Error: ${err}`,
                    messageType: MessageType.ERROR

                })
            })
        }
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

    const saveAdvertToDraft = (values: IForm) => () => {
        advertDraftHelper.saveAdvertToLocalStorage({ ...values,audience:"isInternal", churchId: Number(params.churchId) }, toast)
        history.push(`/church/${params.churchId}/media`)
    }
    

    return (
        <VStack pl={{ base: 2, md: 12 }} pt={{ md: 6 }}
            className={classes.root} >
            <Heading textStyle="h4" >
                New Advert
                </Heading>
            <CreateLayout>
            <Formik initialValues={initialValues}
                    validationSchema={validationScheme}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<IForm>) => {
                        const onChange = (name: string) => (e: Date | any) => {
                            if (name === "dateFrom") {
                                const currentStartDate = new Date(e)
                                formikProps.setValues({
                                    ...formikProps.values,
                                    [name]: e,
                                    dateTo: new Date((currentStartDate).setDate(currentStartDate.getDate() + 1))
                                })
                            } else {
                                formikProps.setValues({ ...formikProps.values, [name]: e })
                            }
                            if (name === "startDate") {
                                setDifference(1)
                            } else {
                                const difference = ((e.getTime() - formikProps.values.dateFrom.getTime()) / (1000 * 3600 * 24))
                                setDifference(Math.round(difference))
                            }
                        }
                        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files![0]
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = function () {
                                    setImage({ ...image, base64: (reader.result as string), name: file.name })
                                }
                                reader.readAsDataURL(file)
                                const { advertUrl, ...newError } = formikProps.errors
                                formikProps.setErrors(newError)
                            }
                        }
                        return (
                            <>
                                <VStack width={["100%", "90%"]}
                                    spacing={3}>
                                        <Flex className={classes.imageContainer} p={5} >
                                            <input accept="image/jpeg,image/png" onChange={handleChange} type="file"
                                                className={classes.input} id="icon-button-file" />
                                            <label className={image.base64 ? classes.activeImage : ""} htmlFor="icon-button-file">
                                            {image.base64 ?
                                            <AspectRatio h="100%" width="100%" maxW="15rem" ratio={21/9} >
                                                <Image src={image.base64} />
                                            </AspectRatio> : 
                                            <IconButton as="span" padding={4} boxSize="5rem" aria-label="submit image"
                                            borderRadius="50%" bgColor={buttonBackground}
                                            icon={<BsCardImage fontSize="2.5rem" />} />
                                        }
                                            </label>
                                            <Heading as="h4" mt={2} fontSize="1.125rem" >Upload Image</Heading>
                                            {
                                                image.name ?
                                                    <Text fontSize="0.68rem" opacity={.5}>{image.name}</Text> :
                                                    <Text fontSize="0.68rem" opacity={.5}>Dimension 200px by 400px</Text>
                                            }
                                        </Flex>
                                    {/* <FormControl
                                            isInvalid={Boolean(formikProps.errors.advertUrl)}>
                                            {
                                                formikProps.errors.advertUrl ?
                                                    <FormErrorMessage>{formikProps.errors.advertUrl}</FormErrorMessage> :
                                                    <Text fontSize="0.8rem" opacity={.5}>File size not more than 100mb</Text>
                                            }
                                    </FormControl> */}
                                        
                                </VStack>
                                <VStack width="100%" >
                                    <VStack width="inherit" align="flex-start" >
                                        <NormalInput width="100%" name="title" placeholder="Input title" />
                                        <Box flexDirection={["column","row"]} display="flex" w="100%" justifyContent="space-between">
                                            <Select name="stateID"
                                                placeholder="" >
                                                {advertSetting.map((item, idx) => (
                                                    <option key={item.audience} value={item.audience} >
                                                        {item.title}
                                                    </option>
                                                ))}
                                            </Select>
                                            <NormalInput width="100%" name="link" placeholder="Input Link for Advert" />
                                        </Box>
                                        <VStack align="flex-start" w="100%">
                                            <Stack my={5} w="100%" justify="space-between" direction={["column", "row"]} align="center">
                                                <VStack align="flex-start">
                                                    <Heading fontSize="1.125rem" color="tertiary" >Set Advert duration</Heading>
                                                    <HStack>
                                                        <DatePicker format="MMM dd,y" calendarIcon={null} clearIcon={null}
                                                            onChange={onChange("dateFrom")} value={formikProps.values.dateFrom}
                                                            className={classes.dateContainer} minDate={currentDate}
                                                        />
                                                        <Icon as={BiRightArrowAlt} />
                                                        <DatePicker format="MMM dd,y" calendarIcon={null} clearIcon={null}
                                                            onChange={onChange("dateTo")} value={formikProps.values.dateTo}
                                                            className={classes.dateContainer} minDate={formikProps.values.dateFrom}
                                                        />
                                                    <Text color="inputColor" mr={["43px", "initial"]} >{`${difference}d`}</Text>
                                                    </HStack>
                                                </VStack>
                                                <VStack ml="auto">
                                                    <Text fontSize="1.125rem" color="tertiary" whiteSpace="nowrap">
                                                        Amount Due
                                                    </Text>
                                                    <Text color="tertiary" fontSize="1.75rem" fontWeight={600}>
                                                        ₦{amount}
                                                    </Text>
                                                </VStack>
                                            </Stack>
                                        </VStack>
                                    </VStack>
                                    <Stack direction={["column", "row"]} spacing={2}
                                        width="100%">
                                        <PaymentButton
                                            paymentCode={transactRef}
                                            onSuccess={handlePaymentAndSubmission(formikProps.handleSubmit)} amount={amount*100}
                                            onClose={handlePaymentClose} onFailure={handleFailure}
                                        >
                                            <Button px={5} py={2} disabled={formikProps.isSubmitting || submitting || !formikProps.dirty || !formikProps.isValid}
                                                isLoading={formikProps.isSubmitting} loadingText="Creating New Advert">
                                                Pay to publish
                                            </Button>
                                        </PaymentButton>
                                        <Button onClick={saveAdvertToDraft(formikProps.values)} variant="outline" >
                                            Save To draft
                                            </Button>
                                        <Flex flex={1} />
                                        <GoBackButton variant="link" ml="auto"
                                            textDecoration="underline" disabled={formikProps.isSubmitting} >
                                            Discard
                                            </GoBackButton>
                                    </Stack>
                                </VStack>
                            </>
                        )
                    }}
                </Formik>
            </CreateLayout>
        </VStack>
    )
}


export default Create