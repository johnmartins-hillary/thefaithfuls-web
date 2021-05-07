import React from "react"
import { Link, useHistory } from "react-router-dom"
import {
    Flex, Icon, Stack, VStack, HStack,
    Heading, AspectRatio, Image, Avatar, Text
} from "@chakra-ui/react"
import { OutlinedInput, Select } from "components/Input"
// eslint-disable-next-line
import { Formik, FormikProps } from "formik"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Button } from "components/Button"
import { updateChurch, getChurchDenomination } from "core/services/church.service"
import useParams from "utils/params"
import useToast from "utils/Toast"
import { CgCloseO } from "react-icons/cg"
import * as Yup from "yup"
import {getChurch} from "store/System/actions"
import { MessageType } from "core/enums/MessageType"
import { IUpdateChurchForm } from "core/models/Church"
import { getCity, getState, getCountry } from "core/services/utility.service"
import { IState, ICity, ICountry } from "core/models/Location"
import { IDenomination } from "core/models/Denomination"
import { useDispatch, useSelector } from "react-redux"
import { AppState } from "store"
import axios from "axios"
import {primary} from "theme/palette"


const useStyles = makeStyles((theme) => (createStyles({
    root: {
        paddingTop: "1.3rem",
        flexDirection: "column",
        bgColor: "#F9F5F9",
        justifyContent: "flex-start",
        alignItems: "center",
        [theme.breakpoints.up("md")]:{
            alignItems: "flex-start",
        },
        "& > *:first-child": {
            alignSelf: "flex-start",
            fontSize: "1.875rem"
        }
    },
    formContainer: {
        minHeight: "80vh",
        flexDirection: "column",
        paddingBottom: "1.5rem",
        backgroundColor: "#F3F3F3",
        [theme.breakpoints.down("md")]:{
            width:"94%"
        },
        "& > a": {
            alignSelf: "flex-end"
        },
        "& > div": {
            "& > button": {
                padding: "1.4rem 2.5rem"
            }
        }
    },
    inputContainer: {
        width: "100%",
        justifyContent: "space-between",
        display: "flex",
        alignItems: "center",
        "& > div": {
            alignSelf: "flex-start !important ",
            "& > div": {
                width: "100%",
                "& > input": {
                    height: "100%"
                }
            },
            "& > button": {
                padding: "1.3rem 1rem"
            }
        },
        "& > div:last-child": {
            marginTop: "0 !important",
            "& > div:first-child": {
                marginTop: 0
            }
        }
    },
    imageContainer: {
        alignItems: "center",
        paddingLeft: ".2rem",
        border: "2px dashed rgba(0,0,0,.4)",
        "& input": {
            display: "none"
        }
    },
    selectContainer:{
        "& > div":{
            display:"flex",
            flexDirection:"column-reverse",
            "& select":{
                border:`2px solid ${primary} !important`,
                borderColor:`${primary} !important`,
            },
            "& > div":{
                width:"100%"
            }
        }
    }
})))


const VerifyChurch = () => {
    const defaultImageUpload = {
        banner: {
            base64: "",
            name: "",
            link: ""
        },
        logo: {
            base64: "",
            name: "",
            link: ""
        }
    }
    const dispatch = useDispatch()
    const classes = useStyles()
    const toast = useToast()
    const params = useParams()
    const [state, setState] = React.useState<IState[]>([])
    const [denomination, setDenomination] = React.useState<IDenomination[]>([])
    const [city, setCity] = React.useState<ICity[]>([])
    const [country, setCountry] = React.useState<ICountry[]>([])
    const [image, setImage] = React.useState({ ...defaultImageUpload })
    const currentChurch = useSelector((state: AppState) => state.system.currentChurch)
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const history = useHistory()

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
        setImage({
            ...image,
            banner: {
                ...image.banner,
                link: currentChurch.churchBarner
            },
            logo: {
                ...image.logo,
                link: currentChurch.churchLogo || ""
            }
        })
        const cancelToken = axios.CancelToken.source()
        if (currentChurch.name) {
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
            getCountryApi()
            getDenominationApi()
        }
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChurch])

    const validationScheme = Yup.object({
        name: Yup.string().min(3, "Church Denomination Should be longer")
            .required("A Church Name is required"),
        address: Yup.string().min(20, "Address is too short").required("An address is required").required("Address is required"),
        churchMotto: Yup.string().min(3, "Church Denomination Should be longer"),
        priestName: Yup.string().min(3, "Church Denomination Should be longer"),
        priestRole: Yup.string().min(3, "Church Denomination Should be longer")
    })
    const handleImageTransformation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        const { name } = e.currentTarget
        console.log(name)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setImage({
                    ...image, [name]: {
                        base64: (reader.result as string),
                        name: file.name,
                        link: ""
                    }
                })
            }
            reader.readAsDataURL(file)
        }
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
            churchMotto: values.churchMotto,
            ...(image.logo.base64 && { churchLogo: image.logo.base64 }),
            ...(image.banner.base64 && { churchBarner: image.banner.base64 })
        }
        updateChurch(newChurch).then(paylaod => {
            actions.setSubmitting(false)
            dispatch(getChurch(toast))
            toast({
                title: "Church Updated Successfully",
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
            history.goBack()
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to Complete Request",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    const {
        address, denominationId, stateName,
        priestName, churchMotto,
        name: churchName, countryID, churchID, stateID, cityID } = currentChurch

    const initialValues: IUpdateChurchForm = {
        ...currentChurch,
        address,
        denominationId,
        email: currentUser.email as string,
        landmark: "",
        stateName,
        churchMotto: churchMotto || "",
        name: churchName,
        country: String(countryID),
        priestName: priestName || "",
        churchID: churchID,
        countryID,
        stateID,
        cityID
    }

    return (
        <Flex className={classes.root} pl={{ md: 16 }}>
            <Heading fontWeight={400} ml={5} color="primary">
                Update Church Profile
                </Heading>
            <Flex
                pt={{ md: 5 }} pr={{ md: 4 }}
                className={classes.formContainer}>
                <Link to={`/church/${params.churchId}/dashboard`} >
                    <Icon as={CgCloseO} color="#383838"
                        opacity={.5} boxSize="2rem" />
                </Link>
                <Flex flexDirection="column" width={["100%", "60vw"]}
                    maxWidth="52.38rem" align={"center"}>
                    {
                        currentChurch.churchID &&
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationScheme}
                            onSubmit={handleSubmit}
                        >
                            {(formikProps: FormikProps<IUpdateChurchForm>) => {
                                return (
                                    <>
                                        <HStack w="100%">
                                            {
                                                (image.banner.link || image.banner.base64) &&
                                                <VStack w="50%">
                                                    <AspectRatio w="100%" ratio={21 / 9}>
                                                        <Image src={image.banner.base64 || image.banner.link} objectFit="cover" />
                                                    </AspectRatio>
                                                    <Text color="primary">
                                                        Church Banner
                                                    </Text>
                                                </VStack>
                                            }
                                            {
                                                (image.logo.link || image.logo.base64) &&
                                                <VStack w="50%">
                                                    <Avatar size="2xl" src={image.logo.base64 || image.logo.link} />
                                                    <Text color="primary">
                                                        Church Logo
                                                    </Text>
                                                </VStack>
                                            }
                                        </HStack>
                                        <Stack className={classes.inputContainer} spacing={5}
                                            justifyContent={["center", "center", "flex-start"]}
                                            flexDirection={{ base: "column", md: "row" }}
                                            my={["4"]} width={["90vw", "100%"]} flexWrap="wrap"
                                            borderRadius="0.25rem" px={["1"]}>
                                            <VStack spacing={5} flex={1} mr={{ md: 5 }} width={{ base: "100%", md: "auto" }} >
                                                <Flex className={classes.imageContainer}>
                                                    <input id="banner" type="file" name="banner" onChange={handleImageTransformation}
                                                        accept="image/jpeg, image/png" style={{ display: "none" }} />
                                                    <label htmlFor="banner" >
                                                        <Button color="white" as="span"
                                                            bgColor="rgba(0,0,0,.6)">
                                                            Church Banner
                                                    </Button>
                                                    </label>
                                                </Flex>
                                                <Flex className={classes.imageContainer}>
                                                    <input id="logo" type="file" name="logo" onChange={handleImageTransformation}
                                                        accept="image/jpeg, image/png" style={{ display: "none" }} />
                                                    <label htmlFor="logo" >
                                                        <Button color="white" as="span"
                                                            bgColor="rgba(0,0,0,.6)">
                                                            Church Logo
                                                    </Button>
                                                    </label>
                                                </Flex>
                                                <OutlinedInput name="name" width="100%" label="Church Name" />
                                                <OutlinedInput label="address" name="address" placeholder="Church Address" />
                                                <OutlinedInput label="churchMotto" name="churchMotto" placeholder="Church Motto" />
                                                <OutlinedInput label="priestName" name="priestName" placeholder="Name of Clergy/Priests" />
                                            </VStack>
                                            <VStack className={classes.selectContainer} spacing={5} ml={{ md: 5 }} flex={1} width={{ base: "100%", md: "auto" }}>
                                                <Select label="Select Denomination" name="denominationId" placeholder="" >
                                                    {denomination.map((item, idx) => (
                                                        <option key={item.denominationID} value={item.denominationID} >
                                                            {item.denominationName}
                                                        </option>
                                                    ))}
                                                </Select>
                                                <Select label="Select Country" name="countryID"
                                                    val={Number(formikProps.values.countryID)} func={getStateApi}
                                                    placeholder="" >
                                                    {country.map((item, idx) => (
                                                        <option key={item.countryID} value={item.countryID} >
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                                <Select label="Select State" name="stateID"
                                                    val={Number(formikProps.values.stateID)} func={getCityAPI}
                                                    placeholder="" >
                                                    {state.map((item, idx) => (
                                                        <option key={item.stateID} value={item.stateID} >
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                                <Select label="Select City" name="cityID" placeholder="" isDisabled={city.length <= 0} >
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
                                        </Stack>
                                        <Button alignSelf={{ md: "flex-start" }}
                                            disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                            isLoading={formikProps.isSubmitting}
                                            loadingText={`Updating ${currentChurch.name} details`}
                                            onClick={(formikProps.handleSubmit as any)}
                                        >
                                            Save
                                        </Button>
                                    </>
                                )
                            }
                            }
                        </Formik>

                    }
                </Flex>
            </Flex>
        </Flex>
    )
}

export default VerifyChurch