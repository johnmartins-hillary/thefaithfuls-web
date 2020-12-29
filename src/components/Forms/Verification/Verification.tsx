import React from "react"
import { useHistory } from "react-router-dom"
import { Text, VStack, Stack, Select } from "@chakra-ui/react"
// eslint-disable-next-line
import { Formik, FormikProps } from "formik"
import { OutlinedInput } from "components/Input"
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
import { IChurchResponse } from "core/models/ChurchResponse"
import { IUpdateChurchForm } from "core/models/Church"
import { getChurchById, verifyChurch, getChurchDenomination } from "core/services/church.service"
import { IDenomination } from "core/models/Denomination"
import { IState, ICity, ICountry } from "core/models/Location"
import { getState, getCity,getCountry } from "core/services/utility.service"
import {primary} from "theme/palette"


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
        // "& select":{
            border:`2px solid ${primary} !important`,
            borderColor:`${primary} !important`
        // }
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
    const defaultChurch = {
        churchName: "",
        churchDenom: "",
        email: "",
        address: "",
        landmark: "",
        state: "",
        country: "",
        phoneNumber: 0,
        churchMotto: "",
        priestName: "",
        priestRole: "",
        countryID: 0,
        stateID: 0,
        cityID: 0
    }
    const history = useHistory()
    const params = useParams()
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const currentChurch = useSelector((state: AppState) => state.system.currentChurch)
    const classes = useStyles()
    const toast = useToast()
    const [churchForm, setChurchForm] = React.useState<IUpdateChurchForm>({ ...defaultChurch })
    const [denomination, setDenomination] = React.useState<IDenomination[]>([])
    const [state, setState] = React.useState<IState[]>([])
    const [city, setCity] = React.useState<ICity[]>([])
    const [country, setCountry] = React.useState<ICountry[]>([])

    React.useEffect(() => {
        const apiCall = (churchId: number) => {
            getChurchById(churchId).then(payload => {
                const { address, name, email, denominationId, stateName, countryID, cityID, stateID, country } = payload.data
                const newChurchDetail: IUpdateChurchForm = {
                    address,
                    churchDenom: String(denominationId),
                    email: email || "",
                    landmark: "",
                    state: stateName || "",
                    churchMotto: "",
                    churchName: name,
                    country: country || "",
                    phoneNumber: 0,
                    priestName: "",
                    priestRole: "",
                    churchID: payload.data.churchID,
                    countryID,
                    stateID,
                    cityID
                }
                setChurchForm({ ...newChurchDetail })
                getChurchDenomination().then(payload => {
                    const foundDenomination = payload.data.find(item => item.denominationID === Number(newChurchDetail.churchDenom))
                    setDenomination([foundDenomination as IDenomination, ...payload.data.filter(item => item.denominationID !== Number(newChurchDetail.churchDenom))])
                }).catch(err => {
                    toast({
                        title:"Unable to Get Denomination",
                        subtitle:`Error:${err}`,
                        messageType:MessageType.ERROR
                    })
                })
                getCountry().then(payload => {
                    const foundCountry = payload.data.find(item => item.countryID === newChurchDetail.countryID)
                    setCountry([foundCountry as ICountry,...payload.data.filter(item => item.countryID !== newChurchDetail.countryID)])
                }).catch(err => {
                    toast({
                        title:"Unable to Get Country",
                        subtitle:`Error:${err}`,
                        messageType:MessageType.ERROR
                    })
                })
                return newChurchDetail
            }).then((result: IUpdateChurchForm) => {
                getState(result.countryID).then(statePayload => {
                    const foundState = statePayload.data.find(item => item.stateID === result.stateID)
                    setState([foundState as IState, ...statePayload.data.filter(item => item.stateID !== result.stateID)])
                    return result
                }).then((result: IUpdateChurchForm) => {
                    getCity(result.stateID).then(cityPayload => {
                        const foundCity = cityPayload.data.find(item => item.cityID === result.cityID)
                        setCity([foundCity as ICity, ...cityPayload.data.filter(item => item.cityID !== result.cityID)])
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
            }).catch(err => {
                toast({
                    title: "Unable to Get Church detail",
                    messageType: MessageType.ERROR,
                    subtitle: `Error: ${err}`
                })
            })
        }

        apiCall(Number(params.churchId))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handlePaymentAndSubmission = (form: IUpdateChurchForm, { ...actions }: any) => {
        const handleVerificationSubmit = (values: IChurch, { ...actions }: any) => () => {
            actions.setSubmitting(true)
            churchService.activateChurch(Number(params.churchId)).then(payload => {
                toast({
                    title: "Your Church has been successfully verified",
                    subtitle: "",
                    messageType: MessageType.SUCCESS
                })
            }).catch(err => {
                toast({
                    title: "Unable to verify Church",
                    subtitle: `Error: ${err}`,
                    messageType: MessageType.ERROR
                })
            })
            actions.setSubmitting(false);
        }
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
    const initialValues = {
        ...churchForm
    }


    if (!churchForm.churchID) {
        return <div>loading....</div>
    } else {
        return (
            <Formik
                initialValues={initialValues}
                validationSchema={createChurchValidation()}
                onSubmit={handlePaymentAndSubmission}
            >
                {(formikProps: FormikProps<IUpdateChurchForm>) => {
                    return (
                        <Stack className={classes.inputContainer} spacing={5} display="flex" alignItems="center"
                            justifyContent={["center", "center", "flex-start"]} flexDirection={{ md: "row" }}
                            my={["4"]} width={["90vw", "100%"]} flexWrap="wrap"
                            borderRadius="0.25rem" px={["1"]}>
                            <OutlinedInput name="name" mr="auto" label="Church Name" />
                            <OutlinedInput name="address" ml="auto" label="Church Address" />
                            <OutlinedInput name="email" mr="auto" label="Church Email" />
                            <OutlinedInput name="priest" ml="auto" label="Priest Name" />
                            <OutlinedInput name="phoneNumber" mx="auto" label="Church Phone Number" />
                            <OutlinedInput name="landmark" ml="auto" label="Church Landmark" />
                            <Select name="countryID" placeholder=""  className={classes.selectContainer} >
                                {country.map((item, idx) => (
                                    <option key={item.countryID} value={item.countryID} >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                            <Select name="churchDenom" placeholder=""  className={classes.selectContainer} >
                                {denomination.map((item, idx) => (
                                    <option key={item.denominationID} value={item.denominationID} >
                                        {item.denominationName}
                                    </option>
                                ))}
                            </Select>
                            <Select name="stateID" placeholder="" className={classes.selectContainer} >
                                {state.map((item, idx) => (
                                    <option key={item.stateID} value={item.stateID} >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                            <Select name="cityID" placeholder="" className={classes.selectContainer}>
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
                                <PaymentButton form={formikProps}
                                    onSuccess={formikProps.handleSubmit} onFailure={handleFailure}
                                    onClose={handlePaymentClose} />
                                {/* <Button disabled={!FormikProps.validateForm}
                                width={{base:"90vw",md:"35%"}} backgroundColor="primary" my="6" 
                                onClick={(FormikProps.handleSubmit as any)} maxWidth="sm">
                                {FormikProps.isValid ? "Proceed To Pay":"Please Correct Form"}
                            </Button> */}
                            </VStack>
                        </Stack>
                    )
                }}
            </Formik>
        )
    }
}

export default VerificationForm