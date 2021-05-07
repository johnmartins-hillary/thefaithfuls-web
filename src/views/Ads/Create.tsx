import React from "react"
import { useHistory } from "react-router-dom"
import {
    Flex, Text, Heading, HStack, IconButton,
    Icon, Stack, VStack, AspectRatio, Image, Box
} from "@chakra-ui/react"
import { BsCardImage } from "react-icons/bs"
import { Button } from "components/Button"
import { TextInput as NormalInput, NormalSelect } from "components/Input"
import { createAdvert, getAdvertSetting } from "core/services/ads.service"
import { generateReference, verifyTransaction } from "core/services/payment.service"
import { Formik, FormikProps } from "formik"
import { createStyles, makeStyles } from "@material-ui/styles"
import { BiRightArrowAlt } from "react-icons/bi"
import * as Yup from "yup"
import useParams from "utils/params"
import useToast from "utils/Toast"
import { buttonBackground } from "theme/palette"
import DatePicker from "react-date-picker"
import { MessageType } from "core/enums/MessageType"
import { GoBackButton } from "components/GoBackButton"
import { Purpose, Payment } from "core/enums/Payment"
import { CreateLayout } from "layouts"
import { useSelector } from "react-redux"
import { AppState } from "store"
import { PaymentButton } from "components/PaymentButton"
import { IAdvertSetting } from "core/models/Advert"
import axios from "axios"
import * as advertDraftHelper from "./advertUtil"


const useStyles = makeStyles((theme) => createStyles({
    root: {
        "& a,button": {
            fontFamily: "MulishRegular"
        },
        "& p,i": {
            fontFamily: "MulishRegular"
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
    activeImage: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}))

const currentDate = new Date()
const initialValues = {
    title: "",
    link: "",
    dateFrom: currentDate,
    dateTo: new Date((new Date()).setDate(currentDate.getDate() + 1)),
    advertUrl: ""
}

type TypeForm = typeof initialValues

const Create = () => {
    const params = useParams()
    const history = useHistory()
    const toast = useToast()
    const classes = useStyles()
    const [advertSetting, setAdvertSetting] = React.useState<IAdvertSetting[]>([])
    // The current start date
    const [date, setDate] = React.useState({
        startDate: initialValues.dateFrom,
        endDate: initialValues.dateTo
    })
    // The minimum accepted date to
    const [minDateTo, setMinDateTo] = React.useState(() => (new Date((new Date()).setDate(currentDate.getDate() + 1))))
    const [currentAdvertSetting, setCurrentAdvertSetting] = React.useState<IAdvertSetting>()
    const [difference, setDifference] = React.useState<number>(1)
    const [submitting,setSubmitting] = React.useState(false)
    const currentChurch = useSelector((state: AppState) => state.system.currentChurch) 
    const [amount, setAmount] = React.useState(1000)
    const [image, setImage] = React.useState({
        base64: "",
        name: ""
    })
    const [transactRef, setTransactRef] = React.useState({
        reference: "",
        publicKey: ""
    })

    const cancelToken = axios.CancelToken.source()
    const getPaymentReference = (amount: number) => {
        if(submitting){
            generateReference({
                amount,
                organizationId: currentChurch.churchID as number,
                organizationType: "church",
                paymentGatewayType: Payment.PAYSTACK,
                purpose: Purpose.ADVERT,
            }, cancelToken).then(payload => {
                setTransactRef({
                    reference: payload.data.reference,
                    publicKey: payload.data.publicKey
                })
            }).catch(err => {
                if (axios.isCancel(err)) {
                    toast({
                        title: "Unable to Get Church Reference",
                        messageType: MessageType.ERROR,
                        subtitle: `Error: ${err}`
                    })
                }
            })
        }
    }

    const findDuration = (arg: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annually" | "Yearly") => {
        switch (arg) {
            case "Daily":
                return 1;
            case "Weekly":
                return 7;
            case "Monthly":
                return 30;
            case "Quarterly":
                return 90;
            case "Annually":
                return 365;
            case "Yearly":
                return 365;
            default:
                return 7
        }
    }

    // Set current date detail
    React.useEffect(() => {
        getAdvertSetting().then(payload => {
            const changedAdvertSetting = payload.data.map(item => ({
                ...item,
                howLong: findDuration(item.duration),
                perDay: Math.round(item.price / findDuration(item.duration))
            }))
            setAdvertSetting(changedAdvertSetting)
            if (changedAdvertSetting.length) {
                setCurrentAdvertSetting(changedAdvertSetting[0])
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const calculateAmountAndDifference = ({
        startDate, endDate, perDay
    }: {
        startDate: Date;
        endDate: Date;
        perDay: number
    }) => {
        const difference = Math.round(((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)))
        const newAmount = Math.round(difference * perDay)
        setDifference(difference)
        getPaymentReference(newAmount)
        setAmount(newAmount)
    }

    React.useEffect(() => {
        calculateAmountAndDifference({
            startDate:date.startDate,
            endDate:date.endDate,
            perDay:currentAdvertSetting?.perDay as number
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[date])

    React.useEffect(() => {
        if (currentAdvertSetting?.howLong) {
            const newDate = new Date(date.startDate)
            const newMinimumDifference = new Date(newDate.setDate(date.startDate.getDate() + currentAdvertSetting?.howLong))
            setMinDateTo(newMinimumDifference)
            setDate({
                ...date,
                endDate:newMinimumDifference
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAdvertSetting])


    const toggleSubmitting = () => {
        setSubmitting(!submitting)
    }

    const validationScheme = Yup.object({
        title: Yup.string().min(3, "Title of Advert is too short").required(),
    })

    const handleSubmit = async (values: TypeForm, { ...action }: any) => {
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
                settingsId:currentAdvertSetting?.id,
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

    const handlePaymentAndSubmission = (func: any) => (refCode: any) => {
        toggleSubmitting()
        verifyTransaction(Payment.PAYSTACK, refCode.reference).then(payload => {
            toast({
                title: "Sermon Payment Successful",
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
            func()
        }).catch(err => {
            toast({
                title: "Unable to complete Sermon Payment",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
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

    const saveAdvertToDraft = (values: TypeForm) => () => {
        advertDraftHelper.saveAdvertToLocalStorage({ ...values, audience: "isInternal", churchId: Number(params.churchId) }, toast)
        history.push(`/church/${params.churchId}/media`)
    }
    const handleSelectChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        setCurrentAdvertSetting(JSON.parse(e.currentTarget.value))
    }

    const onChange = (name: keyof typeof date) => (e: Date | any) => {
        if (name === "startDate") {
            const currentStartDate = new Date(e)
            setDate({
                ...date,
                [name]: e,
                ...(currentAdvertSetting?.howLong && {
                    endDate: new Date((currentStartDate).setDate(currentStartDate.getDate() + currentAdvertSetting?.howLong))
                })
            })
        } else {
            setDate({ ...date, [name]: e })
        }
    }
    const setUpSubmit = (func:any) => {
        // setSubmitting(true)
        // Promise.resolve(getPaymentReference(amount)).then(func)
    }


    return (
        <VStack pl={{ base: 2, md: 12 }} pt={{ md: 6 }}
            className={classes.root} >
            <Text textStyle="styleh5">
                New Advert
            </Text>
            <CreateLayout>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}
                    validationSchema={validationScheme}
                >
                    {(formikProps: FormikProps<TypeForm>) => {
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
                                                <AspectRatio h="100%" width="100%" maxW="15rem" ratio={21 / 9} >
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
                                </VStack>
                                <VStack width="100%" >
                                    <VStack width="inherit" align="flex-start" >
                                        <NormalInput width="100%" name="title" placeholder="Input title" />
                                        <Box flexDirection={["column", "row"]}
                                            display="flex"
                                            w="100%" justifyContent="space-between">
                                            <NormalSelect isDisabled={!advertSetting.length}
                                                onChange={handleSelectChange}
                                            >
                                                {advertSetting.map((item, idx) => (
                                                    <option key={`${item.price}-${idx}`} value={JSON.stringify(item)} >
                                                        {`${item.title}-NGN${item.price}`}
                                                    </option>
                                                ))}
                                            </NormalSelect>

                                            <NormalInput ml={3} width="100%" name="link" placeholder="Input Link for Advert" />
                                        </Box>
                                        <VStack align="flex-start" w="100%">
                                            <Stack my={5} w="100%" justify="space-between" direction={["column", "row"]} align="center">
                                                <VStack align="flex-start">
                                                    <Heading fontSize="1rem" color="tertiary">Set Advert duration</Heading>
                                                    <HStack>
                                                        <DatePicker format="MMM dd,y" calendarIcon={null} clearIcon={null}
                                                            onChange={onChange("startDate")} value={date.startDate}
                                                            className={classes.dateContainer} minDate={currentDate}
                                                        />
                                                        <Icon as={BiRightArrowAlt} />
                                                        <DatePicker format="MMM dd,y" calendarIcon={null} clearIcon={null}
                                                            onChange={onChange("endDate")} value={date.endDate}
                                                            className={classes.dateContainer} minDate={minDateTo}
                                                        />
                                                        <Text color="inputColor" mr={["43px", "initial"]} >{`${difference}d`}</Text>
                                                    </HStack>
                                                </VStack>
                                                <VStack ml="auto">
                                                    <Heading fontSize="1rem" color="tertiary" whiteSpace="nowrap">
                                                        Amount Due
                                                    </Heading>
                                                    <Text color="tertiary" fontSize="1.25rem" fontWeight={600}>
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
                                            onSuccess={setUpSubmit(handlePaymentAndSubmission(formikProps.handleSubmit))} amount={amount * 100}
                                            onClose={handlePaymentClose} onFailure={handleFailure}
                                        >
                                            <Button px={5} py={2} 
                                            disabled={formikProps.isSubmitting || submitting || !formikProps.dirty || !formikProps.isValid}
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