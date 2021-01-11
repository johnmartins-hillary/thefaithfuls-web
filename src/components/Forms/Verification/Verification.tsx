import React from "react"
import { useHistory } from "react-router-dom"
import { Text, VStack, Stack} from "@chakra-ui/react"
// eslint-disable-next-line
import { Formik, FormikProps } from "formik"
import { OutlinedInput,Select } from "components/Input"
import { IChurch } from "core/models/Church"
import { createStyles, makeStyles } from "@material-ui/styles"
import { useDispatch, useSelector } from "react-redux"
import { AppState } from "store"
import { createChurchValidation } from "components/Forms/Signup/SignupAdmin"
import { Button } from "components/Button"
import * as churchService from "core/services/church.service"
import { MessageType } from "core/enums/MessageType"
import useToast from 'utils/Toast'
import useParams from "utils/params"
import { PaymentButton } from "components/PaymentButton"
import { IUpdateChurchForm } from "core/models/Church"
import { getChurchById, verifyChurch, getChurchDenomination } from "core/services/church.service"
import { IDenomination } from "core/models/Denomination"
import { IState, ICity, ICountry } from "core/models/Location"
import { getState, getCity,getCountry } from "core/services/utility.service"
import {generateReference,verifyTransaction} from "core/services/payment.service"
import {primary} from "theme/palette"
import {Payment,Purpose} from "core/enums/Payment"
import axios from "axios"


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
    selectContainer:{
        "& select":{
            border:`2px solid ${primary} !important`,
            borderColor:`${primary} !important`
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


const VerificationForm: React.FC<IProps> = ({ align, handleSuccess, handleClose, showText, ...props }) => {
    const history = useHistory()
    const params = useParams()
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const currentChurch = useSelector((state: AppState) => state.system.currentChurch)
    const classes = useStyles()
    const toast = useToast()
    const [denomination, setDenomination] = React.useState<IDenomination[]>([])
    const [transactRef,setTransactRef] = React.useState({
        reference:"",
        publicKey:""
    })
    const [state, setState] = React.useState<IState[]>([])
    const [city, setCity] = React.useState<ICity[]>([])
    const [country, setCountry] = React.useState<ICountry[]>([])

    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        if(currentChurch.churchID){
            const getCountryApi = () => { 
                getCountry().then(payload => {
                    const foundCountry = payload.data.find(item => item.countryID === currentChurch.countryID)
                    setCountry([foundCountry as ICountry,...payload.data.filter(item => item.countryID !== currentChurch.countryID)])
                }).catch(err => {
                    toast({
                        title:"Unable to Get Country",
                        subtitle:`Error:${err}`,
                        messageType:MessageType.ERROR
                    })
                })
            }
            const getDenominationApi = () => {
                getChurchDenomination().then(payload => {
                    const foundDenomination = payload.data.find(item => item.denominationID === Number(currentChurch.denominationId))
                    setDenomination([foundDenomination as IDenomination, ...payload.data.filter(item => item.denominationID !== Number(currentChurch.denominationId))])
                }).catch(err => {
                    toast({
                        title:"Unable to Get Denomination",
                        subtitle:`Error:${err}`,
                        messageType:MessageType.ERROR
                    })
                })
            }
            const getStateApi = () => {
                getState(currentChurch.countryID).then(statePayload => {
                    const foundState = statePayload.data.find(item => item.stateID === currentChurch.stateID)
                    setState([foundState as IState, ...statePayload.data.filter(item => item.stateID !== currentChurch.stateID)])
                }).then(() => {
                    getCity(currentChurch.stateID).then(cityPayload => {
                        const foundCity = cityPayload.data.find(item => item.cityID === currentChurch.cityID)
                        setCity([foundCity as ICity, ...cityPayload.data.filter(item => item.cityID !== currentChurch.cityID)])
                    }).catch(err => {
                        toast({
                            title: "Unable to get city detail",
                            subtitle: `Error:${err}`,
                            messageType: MessageType.ERROR
                        })
                    })
                }).catch(err => {
                    toast({
                        title: "Unable to Get State Detail",
                        subtitle: `Error:${err}`,
                        messageType: MessageType.ERROR
                    })
                })
            }
            const apiCall = () => {        
                // Generate Refernce for the payment
                generateReference({
                    amount:2000,
                    organizationId:currentChurch.churchID as number,
                    organizationType:"church",
                    paymentGatewayType:Payment.PAYSTACK,
                    purpose:Purpose.VERIFYYME,
                },cancelToken).then(payload => {
                    setTransactRef({
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
                
            }
            apiCall()
            getCountryApi()
            getDenominationApi()
            getStateApi()
        }
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChurch])


    const handlePaymentAndSubmission = (refCode:any) => {
        console.log("this is the refCode",refCode)
        verifyTransaction(Payment.PAYSTACK,refCode.reference).then(payload => {
            toast({
                title:"Church Verification Successful",
                subtitle:"",
                messageType:MessageType.SUCCESS
            })
            handlePaymentClose()
        }).catch(err => {
            toast({
                title:"Unable to complete Church Verification",
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
        history.push(`/church/${params.churchId}/dashboard`)
    }
    const {
        address,denominationId,email,stateName,
        churchID,countryID,stateID,cityID,name:churchName
    } = currentChurch
    
    const initialValues:IUpdateChurchForm = {
        ...currentChurch,
        address,
        denominationId: denominationId,
        email: currentUser.email as string,
        landmark: "",
        stateName,
        churchMotto: "",
        name:churchName,
        country: String(countryID),
        priestName: "",
        priestRole: "",
        churchID,
        countryID,
        stateID,
        cityID
    }
    const handleSubmit = async (values: any, { ...actions }: any) => {
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
                    console.log(formikProps.values)
                return (
                        <Stack className={classes.inputContainer} spacing={5} display="flex" alignItems="center"
                            justifyContent={["center", "center", "flex-start"]} flexDirection={{ md: "row" }}
                            my={["4"]} width={["90vw", "100%"]} flexWrap="wrap"
                            borderRadius="0.25rem" px={["1"]}>
                            <OutlinedInput name="churchName" mr="auto" label="Church Name" />
                            <OutlinedInput name="address" ml="auto" label="Church Address" />
                            <OutlinedInput name="priest" mr="auto" label="Priest Name" />
                            <OutlinedInput name="landmark" ml="auto" label="Church Landmark" />
                            <Select name="countryID" placeholder="" 
                                label="Select Country"
                                className={classes.selectContainer} >
                                {country.map((item, idx) => (
                                    <option key={item.countryID} value={item.countryID} >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                            <Select name="denominationId" placeholder="" 
                            label="Church Denomination"
                            className={classes.selectContainer} >
                                {denomination.map((item, idx) => (
                                    <option key={item.denominationID} value={item.denominationID} >
                                        {item.denominationName}
                                    </option>
                                ))}
                            </Select>
                            <Select name="stateID" placeholder=""
                            label="Select State"
                             className={classes.selectContainer} >
                                {state.map((item, idx) => (
                                    <option key={item.stateID} value={item.stateID} >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                            <Select name="cityID" placeholder=""
                            label="Select City"
                            className={classes.selectContainer}>
                                {city.map((item, idx) => (
                                    <option key={item.cityID} value={item.cityID} >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                            <VStack align={align || "center"} spacing={10} width="100%">
                                {showText &&
                                    <Text fontWeight={600} color="secondary" fontSize="1.2rem" >
                                        To verify your church location with a fee of ₦2000
                                    </Text>
                                }
                                <PaymentButton paymentCode={transactRef}
                                    onSuccess={handlePaymentAndSubmission} amount={200_000}
                                    onClose={handlePaymentClose} onFailure={handleFailure}>
                                        <Button disabled={!formikProps.validateForm}
                                         backgroundColor="primary" my="6" 
                                            maxWidth="sm">
                                            {formikProps.isValid ? "Proceed To Pay":"Please Correct Form"}
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