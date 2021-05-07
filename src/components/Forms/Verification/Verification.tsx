import React from "react"
import { useHistory } from "react-router-dom"
import { Text, VStack, Stack} from "@chakra-ui/react"
// eslint-disable-next-line
import { Formik, FormikProps } from "formik"
import { OutlinedInput, Select } from "components/Input"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { useDispatch, useSelector } from "react-redux"
import { AppState } from "store"
import { Button } from "components/Button"
import {updateChurch} from "core/services/church.service"
import {getChurch} from "store/System/actions"
import { MessageType } from "core/enums/MessageType"
import useToast from 'utils/Toast'
import useParams from "utils/params"
import { PaymentButton } from "components/PaymentButton"
import { IUpdateChurchForm } from "core/models/Church"
import { getChurchDenomination } from "core/services/church.service"
import { IDenomination } from "core/models/Denomination"
import { IState, ICity, ICountry } from "core/models/Location"
import { getState, getCity, getCountry } from "core/services/utility.service"
import { generateReference, verifyTransaction } from "core/services/payment.service"
import { primary } from "theme/palette"
import { Payment, Purpose } from "core/enums/Payment"
import axios from "axios"
import * as Yup from "yup"

const useStyles = makeStyles((theme) => (createStyles({
    inputContainer: {
        "& > *:nth-child": {
            marginRight: "auto",
            marginLeft: "auto"
        },
        "& > button": {
            color: "white",
            marginRight: "50%",
            transform: "translateX(50%)"
        }
    },
    selectContainer: {
        [theme.breakpoints.up("md")]:{
            width: "45% !important"
        },
        "& select": {
            border: `2px solid ${primary} !important`,
            borderColor: `${primary} !important`,
        },
        "& select:nth-child(even)": {
            marginRight: "0"
        }
    }
})))

interface IProps {
    align?: string;
    showText?: boolean;
    [key: string]: any;
    handleSuccess?(): void;
    handleClose?(): void;
}

export const createChurchValidation = () => (
    Yup.object({
        name: Yup.string().min(3, "Church Denomination Should be longer")
            .required("A Church Name is required"),
        denominationId: Yup.string().notOneOf(["Select Denomination"])
            .required("Church Denomination is required"),
        address: Yup.string().min(20, "Address is too short").required("An address is required").required("Address is required"),
        cityID: Yup.string().notOneOf(["Select City", "0"]).required("City should be from the Listed"),
        stateID: Yup.string().notOneOf(["Select State", "0"]).required("State is required"),
        countryID: Yup.string().notOneOf(["Select Your Country"]).required("Country is required"),
    }))


const VerificationForm: React.FC<IProps> = ({ align, handleSuccess, handleClose, showText, ...props }) => {
    const history = useHistory()
    const params = useParams()
    const dispatch = useDispatch()
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const currentChurch = useSelector((state: AppState) => state.system.currentChurch)
    const classes = useStyles()
    const toast = useToast()
    const [denomination, setDenomination] = React.useState<IDenomination[]>([])
    const [submitting,setSubmitting] = React.useState(false)
    const [transactRef, setTransactRef] = React.useState({
        reference: "",
        publicKey: ""
    })
    const [state, setState] = React.useState<IState[]>([])
    const [city, setCity] = React.useState<ICity[]>([])
    const [country, setCountry] = React.useState<ICountry[]>([])
    const getStateApi = (countryID: number) => {
        getState(countryID).then(statePayload => {
            const foundState = statePayload.data.find(item => item.stateID === currentChurch.stateID)
            if (foundState) {
                setState([foundState as IState, ...statePayload.data.filter(item => item.stateID !== currentChurch.stateID)])
            } else {
                setState([...statePayload.data.filter(item => item.stateID !== currentChurch.stateID)])
            }
        }).then(() => {
            getCityAPI(currentChurch.stateID)
        }).catch(err => {
            toast({
                title: "Unable to Get State Detail",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    const getCityAPI = (stateID: number) => {
        getCity(stateID).then(cityPayload => {
            if (cityPayload.data.length > 0) {
                const foundCity = cityPayload.data.find(item => item.cityID === currentChurch.cityID)
                if (foundCity) {
                    setCity([foundCity as ICity, ...cityPayload.data.filter(item => item.cityID !== currentChurch.cityID)])
                } else {
                    setCity([...cityPayload.data.filter(item => item.cityID !== currentChurch.cityID)])
                }
            } else {
                setCity([])
            }
        }).catch(err => {
            toast({
                title: "Unable to get city detail",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        if (currentChurch.churchID) {
            const getCountryApi = () => {
                getCountry().then(payload => {
                    const foundCountry = payload.data.find(item => item.countryID === currentChurch.countryID)
                    setCountry([foundCountry as ICountry, ...payload.data.filter(item => item.countryID !== currentChurch.countryID)])
                }).catch(err => {
                    toast({
                        title: "Unable to Get Country",
                        subtitle: `Error:${err}`,
                        messageType: MessageType.ERROR
                    })
                })
            }
            const getDenominationApi = () => {
                getChurchDenomination().then(payload => {
                    const foundDenomination = payload.data.find(item => item.denominationID === Number(currentChurch.denominationId))
                    setDenomination([foundDenomination as IDenomination, ...payload.data.filter(item => item.denominationID !== Number(currentChurch.denominationId))])
                }).catch(err => {
                    toast({
                        title: "Unable to Get Denomination",
                        subtitle: `Error:${err}`,
                        messageType: MessageType.ERROR
                    })
                })
            }
            const apiCall = () => {
                // Generate Refernce for the payment
                generateReference({
                    amount: 2000,
                    organizationId: currentChurch.churchID as number,
                    organizationType: "church",
                    paymentGatewayType: Payment.PAYSTACK,
                    purpose: Purpose.VERIFYYME,
                }, cancelToken).then(payload => {
                    setTransactRef({
                        reference: payload.data.reference,
                        publicKey: payload.data.publicKey
                    })
                }).catch(err => {
                    if (!axios.isCancel(err)) {
                        toast({
                            title: "Unable to Get Refernnce",
                            messageType: MessageType.ERROR,
                            subtitle: `Error: ${err}`
                        })
                    }
                })

            }
            apiCall()
            getCountryApi()
            getDenominationApi()
        }
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChurch])


    const handlePaymentAndSubmission = (func:any) => (refCode: any) => {
        toggleSubmitting()
        verifyTransaction(Payment.PAYSTACK, refCode.reference).then(payload => {
            func()
            toggleSubmitting()
            toast({
                title: "Church Verification Successful",
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
        }).catch(err => {
            toggleSubmitting()
            toast({
                title: "Unable to complete Church Verification",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }
    const toggleSubmitting = () => {
        setSubmitting(!submitting)
    }
    
    const handleFailure = (error: any) => {
        toast({
            title: "Something Went Wrong during payment",
            subtitle: `Error:err`,
            messageType: MessageType.ERROR
        })
    }

    const handlePaymentClose = () => {
        history.push(`/church/${params.churchId}/dashboard`)
    }
    const {
        address, denominationId, stateName, priestName,
        churchID, countryID, stateID, cityID, name: churchName
    } = currentChurch

    const initialValues: IUpdateChurchForm = {
        ...currentChurch,
        address,
        denominationId: denominationId,
        email: currentUser.email as string,
        landmark: "",
        stateName,
        churchMotto: "",
        name: churchName,
        country: String(countryID),
        priestName,
        churchID,
        countryID,
        stateID,
        cityID
    }
    const handleSubmit = (values: IUpdateChurchForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const newChurch = {
            name: values.name,
            churchID: currentChurch.churchID,
            stateID: Number(values.stateID),
            cityID: Number(values.cityID),
            countryID: Number(values.countryID),
            address: values.address,
            denominationId: Number(values.denominationId),
            priestName: values.priestName,
            churchMotto: values.churchMotto
        }
        updateChurch(newChurch).then(paylaod => {
            actions.setSubmitting(false)
            dispatch(getChurch(toast))
            toast({
                title: "Church Updated Successfully",
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
            history.push(`/church/${params.churchId}/dashboard`)
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to Complete Request",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    if (!currentChurch.churchID) {
        return <div>loading....</div>
    } else {
        return (
            <Formik
                initialValues={initialValues}
                validationSchema={createChurchValidation()}
                onSubmit={handleSubmit}
            >
                {(formikProps: FormikProps<IUpdateChurchForm>) => {
                    return (
                        <Stack className={classes.inputContainer} spacing={5} display="flex" alignItems="center"
                            justifyContent={["center", "center", "flex-start"]} flexDirection={{ md: "row" }}
                            my={["4"]} width={["90vw", "100%"]} flexWrap="wrap"
                            borderRadius="0.25rem" px={["1"]}>
                            <OutlinedInput name="name" mr="auto" label="Church Name" />
                            <OutlinedInput name="address" ml="auto" label="Church Address" />
                            <OutlinedInput name="priestName" mr="auto" label="Priest Name" />
                            <Select name="denominationId" placeholder=""
                                label="Church Denomination" mr="0"
                                className={classes.selectContainer} >
                                {denomination.map((item, idx) => (
                                    <option key={item.denominationID} value={item.denominationID} >
                                        {item.denominationName}
                                    </option>
                                ))}
                            </Select>
                            <Select name="countryID" placeholder=""
                                label="Select Country" mr="auto"
                                val={Number(formikProps.values.countryID)} func={getStateApi}
                                className={classes.selectContainer} >
                                {country.map((item, idx) => (
                                    <option key={item.countryID} value={item.countryID} >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                            <Select name="stateID" placeholder=""
                                label="Select State" mr="0"
                                val={Number(formikProps.values.stateID)} func={getCityAPI}
                                className={classes.selectContainer} >
                                {state.map((item, idx) => (
                                    <option key={item.stateID} value={item.stateID} >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                            <VStack w="100%" alignItems="flex-start">
                            <Select name="cityID" placeholder="" isDisabled={city.length <= 0}
                                label="Select City" mr="0"
                                className={classes.selectContainer}>
                                {city.map((item, idx) => (
                                    <option key={item.cityID} value={item.cityID} >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                            {
                                city.length <= 0 &&
                                <Text alignSelf="flex-start" fontFamily="Bahnschrift" color="tertiary" >
                                    No available city in this state
                                                        </Text>
                            }
                            </VStack>
                            <VStack align={align || "center"} spacing={10} width="100%">
                                {showText &&
                                    <Text fontWeight={600} color="secondary" fontSize="1.2rem" >
                                        To verify your church location with a fee of ₦2000
                                    </Text>
                                }
                                <PaymentButton paymentCode={transactRef}
                                    onSuccess={handlePaymentAndSubmission(formikProps.handleSubmit)}
                                    amount={200_000}
                                    onClose={handlePaymentClose} onFailure={handleFailure}>
                                    <Button disabled={submitting || !formikProps.validateForm}
                                        backgroundColor="primary" my="10" mx="5"
                                        maxWidth="sm">
                                        {formikProps.isValid ? "Proceed To Pay" : "Please Correct Form"}
                                    </Button>
                                </PaymentButton>
                            </VStack>
                        </Stack>
                    )
                }}
            </Formik>
        )
    }
}

export default VerificationForm