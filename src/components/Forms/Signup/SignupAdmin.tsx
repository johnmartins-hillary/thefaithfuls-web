import React from "react"
import { Box, Flex, Avatar, Image, AspectRatio, VStack, Stack, Heading, Text, IconButton, HStack } from "@chakra-ui/react"
import { Button } from "components/Button"
import {Fade} from "@material-ui/core"
// eslint-disable-next-line
import { Formik, FormikProps } from "formik"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { Dialog, VerifyDialog, Subscription } from "components/Dialog"
import { Link } from "components/Link"
import { login} from "store/System/actions"
import { TextInput, Select, Checkbox } from "components/Input"
import * as Yup from "yup"
import { IChurchResponse } from "core/models/ChurchResponse"
import { MinorLoginLayout } from "layouts"
import { ICity, ICountry, IState as IStateResponse } from "core/models/Location"
import { IDenomination } from "core/models/Denomination"
import { IChurchMember } from "core/models/ChurchMember"
import * as utilityService from "core/services/utility.service"
import { createStaff } from "core/services/account.service"
import * as churchService from "core/services/church.service"
import Toast, { ToastFunc } from "utils/Toast"
import { MessageType } from 'core/enums/MessageType'
import { useDispatch } from "react-redux"
import { IChurchForm } from "components/Forms/Interface"
import { assignRoleClaimToUser } from 'core/services/user.service'
import { BiLeftArrowCircle } from "react-icons/bi"



interface IChurchMemberForm extends IChurchMember {
    confirmPassword: string;
}

const initialValuesForCreateChurch = {
    name: "",
    denominationId: "0",
    email: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    phoneNumber: null,
    churchMotto: "",
    churchLogo: null,
    priestName: "",
    acceptedTerms: false,
    priestRole: "",
}

const useStyles = makeStyles(theme => createStyles({
    root: {
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
        marginLeft: "0 !important",
        paddingLeft: "0 !important"
    },
    inputContainer: {
        width: "100%",
    }
}))

interface IState {
    country: ICountry[]
    state: IStateResponse[]
    city: ICity[]
}

export const createChurchValidation = () => (
    Yup.object({
        name: Yup.string().min(3, "Church Denomination Should be longer")
            .required("A Church Name is required"),
        denominationId: Yup.string().notOneOf(["Select Denomination"])
            .required("Church Denomination is required"),
        email: Yup.string().email("Invalid Email Address").required("A Church Name is required"),
        address: Yup.string().required("An address is required").required("Address is required"),
        landmark: Yup.string().min(3, "Landmark Should be longer").required("Landmark is required"),
        city: Yup.string().notOneOf(["Select City", "0"]).required("City should be from the Listed"),
        state: Yup.string().notOneOf(["Select State", "0"]).required("State is required"),
        country: Yup.string().notOneOf(["Select Your Country"]).required("Country is required"),
        acceptedTerms: Yup.boolean().oneOf([true], "You need to Agree to our terms and condition")
            .required("You need to agree to our terms and condition"),
        phoneNumber: Yup.number().moreThan(1000000000, "Phone Number is not valid").required("Phone Number is required"),
        churchMotto: Yup.string(),
        priestName: Yup.string(),
        priestRole: Yup.string()
    }))

const createUserValidation = () => (
    Yup.object({
        firstname: Yup.string().max(20, "First Name is Too Long").required(),
        lastname: Yup.string().max(20, "Last Name is Too Long").required(),
        email: Yup.string().email("Invalid Email address").required(),
        phoneNumber: Yup.number().moreThan(1000000000, "Phone Number is not valid").required("Phone Number is required"),
        password: Yup.string().min(5, "Password is too short").required(),
        confirmPassword: Yup.string().min(5, "Password is too short").required(),
    })
)

const GoBack = ({ func }: any) => (
    <IconButton aria-label="go-back" color="primary" bgColor="transparent" onClick={func}
        as={BiLeftArrowCircle} />
)


const SignupAdmin = () => {
    const defaultUserForm = {
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: null,
        password: "",
        confirmPassword: "",
        username:""
    }
    const userFormKey = "thefaithful-user-form"
    const [open, setOpen] = React.useState(true)
    const dispatch = useDispatch()
    const classes = useStyles()
    const [location, setLocation] = React.useState<IState>({
        country: [],
        city: [],
        state: []
    })
    const toast = Toast()
    const [showSubscription, setShowSubscription] = React.useState(false)
    const [showDialog, setShowDialog] = React.useState(false)
    // For showing the church form
    const [showChurchForm, setShowChurchForm] = React.useState(false)
    // For Keeping A state of the church
    const [churchForm, setChurchForm] = React.useState({
        submitted: false,
        churchID: 0,
        stateID: 0,
        countryID: 0,
        cityID: 0
    })
    const [userForm, setUserForm] = React.useState<IChurchMemberForm>(
        JSON.parse(localStorage.getItem(userFormKey) || JSON.stringify(defaultUserForm)))
    const [image, setImage] = React.useState({
        banner: {
            base64: "",
            name: ""
        },
        logo: {
            base64: "",
            name: ""
        },
    })
    const [denomination, setDenomination] = React.useState<IDenomination[]>([])

    React.useEffect(() => {
        const getCountry = async (toast: ToastFunc) => {
            try {
                return await utilityService.getCountry().then(data => {
                    setLocation({ ...location, country: data.data })
                })
            } catch (err) {
                toast({
                    messageType: MessageType.WARNING,
                    subtitle: "Unable to get Country"
                })
            }
        }
        const getDenomination = async (toast: ToastFunc) => {
            try {
                return await churchService.getChurchDenomination().then(data => {
                    setDenomination(data.data)
                })
            } catch (err) {
                toast({
                    messageType: MessageType.WARNING,
                    subtitle: "Unable to get church denomination"
                })
            }
        }
        getCountry(toast)
        getDenomination(toast)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (userForm.firstname.length > 0) {
            localStorage.setItem(userFormKey, JSON.stringify(userForm))
        } else {
            localStorage.removeItem(userFormKey)
        }
    }, [userForm])
    // For showing the next church form
    const handleToggle = () => {
        setOpen(!open)
    }

    // For showing the subscription
    const handleSubscription = () => {
        setShowSubscription(!showSubscription)
    }

    // For showing the dialog
    const handleDialog = () => {
        setShowDialog(!showDialog)
    }

    //For showing the church form 2nd part
    const handleFormToggle = () => {
        setShowChurchForm(!showChurchForm)
    }

    // For transforming the selected image to base 64
    const handleImageTransformation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        const { name } = e.currentTarget
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

    // for creating a new church member
    const createNewUser = async (actions: any, userForm: IChurchMemberForm, churchValue: typeof churchForm) => {
        const { email, firstname, lastname, password, phoneNumber} = userForm
        const { countryID, stateID, cityID, churchID } = churchValue
        const newUser: IChurchMember = {
            username: String(phoneNumber),
            password,
            phoneNumber,
            email,
            firstname,
            lastname,
            countryID,
            stateID,
            cityID,
            personTypeID: 3,
            enteredBy: "ChurchAdmin",
            churchId: churchID,
            isDataCapture: false,
            societies: [],
            societyPosition: []
        }


        await createStaff(newUser).then(payloadData => {
            const assignRoleString = `roleName=ChurchAdmin&agentUserId=${payloadData.data.staffID}`
            // assignRoleClaimToUser(assignRoleString).then(payload => {
            assignRoleClaimToUser(assignRoleString).then(payload => {
                actions.resetForm()
                actions.setSubmitting(false)
                dispatch(login(newUser.username!, newUser.password, toast))
                const afterLogin = () => {
                    setShowChurchForm(true)
                    setUserForm({ ...defaultUserForm })
                    // Show dialog if creating a new user is successful
                    handleDialog()
                    // })
                    toast({
                        title: "New Church Admin created",
                        subtitle: `Admin ${newUser.username} Successfully created`,
                        messageType: MessageType.SUCCESS,
                    })
                }
                afterLogin()
            }).catch(err => {
                toast({
                    title:"Unable to add Role to User",
                    subtitle:`Error:${err}`,
                    messageType:MessageType.ERROR
                })
            })

        }).catch(error => {
            actions.setSubmitting(false)
            setShowChurchForm(false)
            toast({
                title: "Something went wrong",
                subtitle: `While creating User:${error}`,
                messageType: MessageType.ERROR,
            })
        })
    }

    // For creating a new church 
    const submitNewChurchForm = async (values: IChurchForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const newChurch: IChurchResponse = {
            name: values.name,
            stateID: Number(values.state),
            cityID: Number(values.city),
            countryID: Number(values.country),
            address: values.address,
            denominationId: Number(values.denominationId),
            ...(image.logo.base64 && { churchLogo: image.logo.base64 }),
            ...(image.banner.base64 && { churchBarner: image.banner.base64 })
        }
        await churchService.createChurch(newChurch).then(async (payload) => {
            setImage({
                logo: {
                    name: "",
                    base64: ""
                },
                banner: {
                    name: "",
                    base64: ""
                }
            })
            toast({
                title: "New Church",
                subtitle: `Successfully Created ${newChurch.name}`,
                messageType: MessageType.SUCCESS,
            })
            actions.resetForm()
            setChurchForm({
                submitted: true,
                countryID: payload.data.countryID,
                churchID: payload.data.churchID!,
                stateID: payload.data.stateID,
                cityID: payload.data.cityID,
            })
            // For creating a new church Staff
            createNewUser(actions, userForm, { ...newChurch, churchID: (payload.data.churchID as number), submitted: true })
        }).catch(err => {
            actions.setSubmitting(false)
            setOpen(!open)
            toast({
                messageType: MessageType.ERROR,
                title: "Unable to create new church",
                subtitle: `${err}`
            })
        })
    }

    // For showing the church form / sending the create church member form
    const submitNewUserForm = (values: IChurchMemberForm, { ...actions }: any) => {
        if (values.password !== values.confirmPassword) {
            actions.setErrors({
                confirmPassword: "Password do not match",
                password: "Password do not match"
            })
        } else {
            setUserForm(values)
            if (!churchForm.submitted) {
                handleFormToggle()
            } else {
                createNewUser(actions, values, churchForm)
            }
        }
    }

    return (
        <>
            <MinorLoginLayout showLogo={true}>
                <Flex className={classes.root} px={{ sm: "3" }}
                    alignItems={["center", "flex-start"]} flex={[1, 3]}>
                    <Stack spacing={3} my={5} align={["center","left"]} >
                        <Heading textStyle="h3" style={{marginTop:30}}>
                            Sign Up
                        </Heading>
                        <Text textStyle="h6" maxWidth="sm">
                            Tell us about your church
                        </Text>
                    </Stack>
                    <Flex className={classes.inputContainer} direction="column" >
                        <Fade mountOnEnter unmountOnExit timeout={150} in={!showChurchForm} >
                                <Box>
                                    <Formik
                                        initialValues={userForm}
                                        validationSchema={createUserValidation()}
                                        onSubmit={submitNewUserForm}
                                    >
                                        {(formikProps: FormikProps<IChurchMemberForm>) => {
                                            return (
                                                <Box my={["4"]} width={["90vw", "100%"]}
                                                    maxWidth="sm" px="1" mx={["auto", "initial"]} >
                                                    <Box>
                                                        <TextInput name="firstname" placeholder="First Name" />
                                                        <TextInput name="lastname" placeholder="Last Name" />
                                                        <TextInput name="email" placeholder="email" />
                                                        <TextInput name="phoneNumber" placeholder="Phone Number" />
                                                        <TextInput name="password"
                                                            type="password" placeholder="Password" />
                                                        <TextInput name="confirmPassword"
                                                            type="password" placeholder="Confirm Password" />
                                                        <Button disabled={formikProps.isSubmitting || !formikProps.isValid}
                                                            my="6" maxWidth="sm" isLoading={formikProps.isSubmitting}
                                                            loadingText={`Creatinag new Church Admin ${formikProps.values.firstname}-${formikProps.values.lastname}`}
                                                            onClick={(formikProps.handleSubmit as any)}
                                                            width={["90vw", "100%"]}>
                                                            {formikProps.isValid ? "Next" : "Please Complete Your Form"}
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            )
                                        }}
                                    </Formik>
                                </Box>
                        </Fade>
                        <Fade mountOnEnter unmountOnExit timeout={150} in={showChurchForm}>
                        <Box>
                                    <Formik initialValues={initialValuesForCreateChurch}
                                        validationSchema={createChurchValidation()}
                                        onSubmit={submitNewChurchForm}
                                    >
                                        {(formikProps: FormikProps<IChurchForm>) => {
                                            const getState = async (countryId: number) => {
                                                try {
                                                    utilityService.getState(countryId).then(data => {
                                                        setLocation({ ...location, state: data.data })
                                                    })
                                                } catch (err) {
                                                    toast({
                                                        title: "Unable to get state",
                                                        subtitle: `Error:${err}`,
                                                        messageType: MessageType.WARNING
                                                    })
                                                }
                                            }
                                            const getCity = async (cityId: number) => {
                                                try {
                                                    utilityService.getCity(cityId).then(data => {
                                                        setLocation({ ...location, city: data.data })
                                                    })
                                                } catch (err) {
                                                    toast({
                                                        messageType: MessageType.WARNING,
                                                        subtitle: "Unable to get city"
                                                    })
                                                }
                                            }
                                            return (
                                                <Box my={["4"]} width={["90vw", "100%"]} maxWidth="sm" px="1" >
                                                    {
                                                        open ?
                                                            <Fade  mountOnEnter unmountOnExit in={open}>
                                                                    <Box>
                                                                        <HStack>
                                                                            <GoBack func={handleFormToggle} />
                                                                            <TextInput name="name" placeholder="Church Name" />
                                                                        </HStack>
                                                                        <Select name="denominationId" placeholder="Select Denomination">
                                                                            {denomination && denomination.map((item, idx) => (
                                                                                <option key={idx} value={item.denominationID}>
                                                                                    {item.denominationName}
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                        <TextInput name="email" placeholder="Church Email" />
                                                                        <TextInput name="address" placeholder="Church Address" />
                                                                        <TextInput name="landmark" placeholder="Closest Landmark" />
                                                                        <TextInput name="phoneNumber" placeholder="Church Phone Number" />
                                                                        <Select name="country" placeholder="Select Your Country"
                                                                            val={Number(formikProps.values.country)} func={getState} >
                                                                            {location.country.map((item, idx) => (
                                                                                <option key={idx} value={item.countryID}>
                                                                                    {item.name}
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                        <Select name="state" placeholder="Select State"
                                                                            val={Number(formikProps.values.state)} func={getCity}>
                                                                            {location.state.map((item, idx) => (
                                                                                <option key={idx} value={item.stateID} >
                                                                                    {item.name}
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                        <Select name="city" placeholder="Select City">
                                                                            {location.city.map((item, idx) => (
                                                                                <option key={idx} value={item.cityID} >
                                                                                    {item.name}
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                        <Checkbox name="acceptedTerms" >
                                                                            <Text textStyle="h6" fontSize="1rem" whiteSpace="nowrap" >
                                                                                Agree to our  &nbsp;
                                                                            <Link to="/" >
                                                                                    Terms of Service and Policy
                                                                            </Link>
                                                                            </Text>
                                                                        </Checkbox>
                                                                        <Button disabled={!formikProps.dirty || !formikProps.isValid}
                                                                            onClick={handleToggle} width={["90vw", "100%"]}
                                                                            my="6" maxWidth="sm">
                                                                            {formikProps.dirty && formikProps.isValid ? "Next" : "Please Complete The Form"}
                                                                        </Button>
                                                                    </Box>
                                                                
                                                            </Fade> :
                                                            <Fade mountOnEnter unmountOnExit in={!open}>
                                                                    <VStack>
                                                                        {image.banner.base64 &&
                                                                            <>
                                                                                <Text color="primary">
                                                                                    Church Banner
                                                                    </Text>
                                                                                <AspectRatio w="100%" ratio={21 / 9}>
                                                                                    <Image src={image.banner.base64} objectFit="cover" />
                                                                                </AspectRatio>
                                                                            </>
                                                                        }
                                                                        <Box>
                                                                            <HStack>
                                                                                <GoBack func={handleToggle} />
                                                                                <TextInput showErrors={false} name="churchMotto" placeholder="Church Motto" />
                                                                            </HStack>
                                                                            <Box border="2px dashed rgba(0,0,0,.4)" >
                                                                                <input id="image" type="file" name="logo" onChange={handleImageTransformation}
                                                                                    accept="image/jpeg, image/png" style={{ display: "none" }} />
                                                                                <label htmlFor="image" >
                                                                                    <Button color="white" as="span"
                                                                                        bgColor="rgba(0,0,0,.6)">
                                                                                        Church Logo
                                                                            </Button>
                                                                                    {image.logo.name && <Text>{image.logo.name}</Text>}
                                                                                </label>
                                                                            </Box>
                                                                            <Box border="2px dashed rgba(0,0,0,.4)" >
                                                                                <input id="banner" type="file" name="banner" onChange={handleImageTransformation}
                                                                                    accept="image/jpeg, image/png" style={{ display: "none" }} />
                                                                                <label htmlFor="banner" >
                                                                                    <Button color="white" as="span"
                                                                                        bgColor="rgba(0,0,0,.6)">
                                                                                        Church Banner
                                                                            </Button>
                                                                                    {image.banner.name ? <Text>{image.banner.name}</Text> :
                                                                                        <Text>
                                                                                            Dimension 468 x 60
                                                                            </Text>
                                                                                    }
                                                                                </label>
                                                                            </Box>
                                                                            <VStack justify="center" mt="4" align="center" >
                                                                                {image.logo.base64 &&
                                                                                    <>
                                                                                        <Text color="primary" >
                                                                                            Church Logo
                                                                        </Text>
                                                                                        <Avatar size="lg" src={image.logo.base64} />
                                                                                    </>}
                                                                            </VStack>
                                                                            <Button disabled={formikProps.isSubmitting} onClick={(formikProps.handleSubmit as any)}
                                                                                width={["90vw", "100%"]}
                                                                                color="white" my="6" maxWidth="sm"
                                                                                bgColor="primary">
                                                                                {formikProps.isSubmitting ? "Creating a New Church" : "Send"}
                                                                            </Button>
                                                                        </Box>
                                                                    </VStack>
                                                            </Fade>
                                                    }
                                                </Box>
                                            )
                                        }}
                                    </Formik>
                                </Box>
                            
                        </Fade>
                    </Flex>
                    <Text textStyle="h6" >Already have an account? &nbsp;
                        <Link to="/login">
                            Login here
                        </Link>
                    </Text>
                </Flex>
            </MinorLoginLayout>
            <Dialog size={showSubscription ? "2xl" : "xl"}
                open={showDialog} close={handleDialog}>
                {showSubscription ?
                    <Subscription /> :
                    <VerifyDialog handleToggle={handleSubscription} />
                }
            </Dialog>

        </>
    )
}

export default React.memo(SignupAdmin)