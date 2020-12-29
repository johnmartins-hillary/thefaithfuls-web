import React from "react"
import { Link} from "react-router-dom"
import { Flex, Icon, Stack, VStack,HStack, Heading, AspectRatio, Image, Avatar, Text, Select } from "@chakra-ui/react"
import { OutlinedInput, TextInput } from "components/Input"
// eslint-disable-next-line
import { Formik,FormikProps } from "formik"
import { createStyles, makeStyles } from "@material-ui/styles"
import { Button } from "components/Button"
import { getChurchById,updateChurch,getChurchDenomination } from "core/services/church.service"
import useParams from "utils/params"
import useToast from "utils/Toast"
import { CgCloseO } from "react-icons/cg"
import * as Yup from "yup"
import { MessageType } from "core/enums/MessageType"
import { IChurchResponse } from "core/models/ChurchResponse"
import {IUpdateChurchForm} from "core/models/Church"
import {getCity,getState } from "core/services/utility.service"
import { IState,ICity } from "core/models/Location"
import { IDenomination } from "core/models/Denomination"


const useStyles = makeStyles((theme) => (createStyles({
    root: {
        paddingTop: "1.3rem",
        flexDirection: "column",
        bgColor: "#F9F5F9",
        alignItems: "flex-start",
        justifyContent: "flex-start",
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
                height: "3.5rem",
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
    }
})))


const VerifyChurch = () => {
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
        countryID:0,
        stateID:0,
        cityID:0
    }
    const defaultImageUpload = {
        banner: {
            base64: "",
            name: ""
        },
        logo: {
            base64: "",
            name: ""
        }
    }
    const classes = useStyles()
    const toast = useToast()
    const params = useParams()
    const [churchForm, setChurchForm] = React.useState<IUpdateChurchForm>({ ...defaultChurch })
    const [state,setState] = React.useState<IState[]>([])
    const [denomination,setDenomination] = React.useState<IDenomination[]>([])
    const [city,setCity] = React.useState<ICity[]>([])
    const [image, setImage] = React.useState({ ...defaultImageUpload })
    
    React.useEffect(() => {
        const apiCall = (churchId: number) => {
            getChurchById(churchId).then(payload => {
                const { address, name, email, denominationId, stateName,countryID,cityID,stateID, country } = payload.data
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
                    setDenomination([foundDenomination as IDenomination,...payload.data.filter(item => item.denominationID !== Number(newChurchDetail.churchDenom))])
                })
                return newChurchDetail
            }).catch(err => {
                toast({
                    title: "Unable to Get Church detail",
                    messageType: MessageType.ERROR,
                    subtitle: `Error: ${err}`
                })
            }).then((result:IUpdateChurchForm | void) => {
                if(result){
                    getState(result.countryID).then(statePayload => {
                        const foundState = statePayload.data.find(item => item.stateID === result.stateID)
                        setState([foundState as IState,...statePayload.data.filter(item => item.stateID !== result.stateID)])
                        return result
                    }).catch(err => {
                        toast({
                            title:"Unable to Get State Detail",
                            subtitle:`Error:${err}`,
                            messageType:MessageType.ERROR
                        })
                    }).then((result:IUpdateChurchForm | void) => {
                        if(result){
                            getCity(result.stateID).then(cityPayload => {
                            const foundCity = cityPayload.data.find(item => item.cityID === result.cityID) 
                            setCity([foundCity as ICity,...cityPayload.data.filter(item => item.cityID !== result.cityID)])
                            }).catch(err => {
                                toast({
                                    title:"Unable to get city detail",
                                    subtitle:`Error:${err}`,
                                    messageType:MessageType.ERROR
                                })
                            })
                        }
                    })
                }
            })
        }

        apiCall(Number(params.churchId))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const initialValues = { ...churchForm }
    const validationScheme = Yup.object({
        churchName: Yup.string().min(3, "Church Denomination Should be longer")
            .required("A Church Name is required"),
        email: Yup.string().email("Invalid Email Address").required("A Church Name is required"),
        address: Yup.string().required("An address is required").required("Address is required"),
        landmark: Yup.string().min(3, "Landmark Should be longer").required("Landmark is required"),
        state: Yup.string().min(3, "State Should be longer").required("State is required"),
        phoneNumber: Yup.number().moreThan(1000000000, "Phone Number is not valid").required("Phone Number is required"),
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
                        name: file.name
                    }
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (values: IUpdateChurchForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const newChurch:IChurchResponse = {
            name:values.churchName,
            stateID:Number(values.stateID),
            cityID:Number(values.cityID),
            countryID:Number(churchForm.countryID),
            address:values.address,
            denominationId:Number(values.churchDenom),
            ...(image.logo.base64 && {churchLogo:image.logo.base64}),
            ...(image.banner.base64 && {churchBarner:image.banner.base64})
        }
        updateChurch(newChurch).then(paylaod => {
            actions.setSubmitting(false)
            toast({
                title:"Church Updated Successfully",
                subtitle:"",
                messageType:MessageType.SUCCESS
            })
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title:"Unable to Complete Request",
                subtitle:`Error:${err}`,
                messageType:MessageType.ERROR
            })
        })
    }


    return (
        <Flex className={classes.root} pl={{ md: 16 }}>
            <Heading fontWeight={400} ml={5} color="primary">
                Update Church Profile
                </Heading>
            <Flex width={["100%", "85vw"]} pl={{ md: 16 }}
                pt={{ md: 5 }} pr={{ md: 4 }}
                className={classes.formContainer}>
                <Link to={`/church/${params.churchId}/dashboard`} >
                    <Icon as={CgCloseO} color="#383838"
                        opacity={.5} boxSize="2rem" />
                </Link>
                <Flex flexDirection="column" width={["100%", "60vw"]}
                    maxWidth="52.38rem" align={"center"}>
                    {
                        churchForm.churchID &&
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationScheme}
                            onSubmit={handleSubmit}
                        >
                            {(formikProps: FormikProps<IUpdateChurchForm>) => {
                                return(
                                    <>
                                        <HStack w="100%">
                                            {
                                                image.banner.base64 &&
                                                <VStack w="50%">
                                                    <AspectRatio w="100%" ratio={21 / 9}>
                                                        <Image src={image.banner.base64} objectFit="cover" />
                                                    </AspectRatio>
                                                    <Text color="primary">
                                                        Church Banner
                                                    </Text>
                                                </VStack>
                                            }
                                            {
                                                image.logo.base64 &&
                                                <VStack w="50%">
                                                    <Avatar size="2xl" src={image.logo.base64} />
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
                                                    <input id="image-banner" type="file" name="banner" onChange={handleImageTransformation}
                                                        accept="image/jpeg, image/png" style={{ display: "none" }} />
                                                    <label htmlFor="image-banner" >
                                                        <Button color="white" as="span"
                                                            bgColor="rgba(0,0,0,.6)">
                                                            Church Banner
                                                    </Button>
                                                    </label>
                                                </Flex>
                                                <Flex className={classes.imageContainer}>
                                                    <input id="image-logo" type="file" name="logo" onChange={handleImageTransformation}
                                                        accept="image/jpeg, image/png" style={{ display: "none" }} />
                                                    <label htmlFor="image-logo" >
                                                        <Button color="white" as="span"
                                                            bgColor="rgba(0,0,0,.6)">
                                                            Church Logo
                                                    </Button>
                                                    </label>
                                                </Flex>
                                                <OutlinedInput name="churchName" width="100%" label="Church Name" />
                                                <TextInput name="email" placeholder="Church Email" />
                                                <TextInput name="address" placeholder="Church Address" />
                                                <TextInput name="landmark" placeholder="Closest Landmark" />
                                                <Select name="churchDenom" placeholder="" >
                                                    {denomination.map((item,idx) => (
                                                        <option key={item.denominationID} value={item.denominationID} >
                                                            {item.denominationName}
                                                        </option>
                                                    ))}
                                                </Select>                 
                                                <Select name="stateID" placeholder="" >
                                                    {state.map((item,idx) => (
                                                        <option key={item.stateID} value={item.stateID} >
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                                <Select name="cityID" placeholder="" >
                                                    {city.map((item,idx) => (
                                                        <option key={item.cityID} value={item.cityID} >
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                                <TextInput name="phoneNumber" placeholder="Church Phone Number" />
                                            </VStack>
                                            <VStack spacing={5} ml={{ md: 5 }} flex={1} width={{ base: "100%", md: "auto" }}>
                                                <TextInput name="churchMotto" placeholder="Church Motto" />
                                                <TextInput name="priestName" placeholder="Name of Clergy/Priests" />
                                                <TextInput name="priestRole" placeholder="Role of Clergy/Priests" />
                                                <Button width={["100%", "auto"]} color="primary" alignSelf={{ md: "flex-start" }}
                                                    colorScheme="primary" variant="outline" >
                                                    Add Clergy/Priests
                                            </Button>
                                            </VStack>
                                        </Stack>
                                        <Button alignSelf={{ md: "flex-start" }} 
                                            disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                            isLoading={formikProps.isSubmitting}
                                            loadingText={`Updating ${formikProps.values.churchName} details`}
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