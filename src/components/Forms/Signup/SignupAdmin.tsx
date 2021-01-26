import React from "react"
import {
    Box, Flex, Avatar, Image, AspectRatio,
    VStack, Stack, Heading, Text, IconButton, HStack, ModalBody, ModalCloseButton, ModalContent, ModalHeader
} from "@chakra-ui/react"
import { Button } from "components/Button"
import { Fade } from "@material-ui/core"
// eslint-disable-next-line
import { Formik, FormikProps } from "formik"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { Dialog, VerifyDialog } from "components/Dialog"
import { Link } from "components/Link"
import { login } from "store/System/actions"
import { TextInput, Select, Checkbox, PasswordInput } from "components/Input"
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
import { useHistory } from "react-router-dom"



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
        justifyContent: "center",
        flexDirection: "column",
        marginLeft: "0 !important",
        paddingLeft: "0 !important",
        "& p": {
            fontFamily: "MulishRegular",
            fontSize: "1.125rem",
            opacity: ".66 !important"
        },
        "& > div": {
            "& p": {
                fontSize: "1.5rem",
                opacity: ".8 !important"
            }
        },
        "& label": {
            "& p": {
                whiteSpace: "nowrap",
                fontSize: "1rem !important",
                [theme.breakpoints.up("sm")]: {
                    fontSize: "1.125rem !important"
                }
            }
        }
    },
    inputContainer: {
        width: "100%",
    },
    button: {
        marginLeft: "50%",
        transform: "translateX(-50%)"
    }
}))

interface IState {
    country: ICountry[]
    state: IStateResponse[]
    city: ICity[]
}

const phoneRegExp = /^[0]\d{10}$/

export const createChurchValidation = () => (
    Yup.object({
        name: Yup.string().min(3, "Church Denomination Should be longer")
            .required("A Church Name is required"),
        denominationId: Yup.string().notOneOf(["Select Denomination"])
            .required("Church Denomination is required"),
        address: Yup.string().min(20, "Address is too short").required("An address is required").required("Address is required"),
        city: Yup.string().notOneOf(["Select City", "0"]).required("City should be from the Listed"),
        state: Yup.string().notOneOf(["Select State", "0"]).required("State is required"),
        country: Yup.string().notOneOf(["Select Your Country"]).required("Country is required"),
        acceptedTerms: Yup.boolean().oneOf([true], "You need to Agree to our terms and condition")
            .required("You need to agree to our terms and condition")
    }))

const createUserValidation = () => (
    Yup.object({
        firstname: Yup.string().max(20, "First Name is Too Long").required(),
        lastname: Yup.string().max(20, "Last Name is Too Long").required(),
        email: Yup.string().email("Invalid Email address").required(),
        phoneNumber: Yup.string().matches(phoneRegExp, "Phone Number is not valid").min(10, "Phone Number is not valid").max(12, "Phone Number is Too Long").matches(phoneRegExp, "Phone Number is not valid"),
        password: Yup.string().min(5, "Password is too short").required(),
        confirmPassword: Yup.string().min(5, "Password is too short").required(),
    })
)

const GoBack = ({ func }: any) => (
    <IconButton aria-label="go-back" color="primary" bgColor="transparent" onClick={func}
        as={BiLeftArrowCircle} />
)

const TermDialog = () => {
    return (
        <ModalContent pb="5">
            <ModalBody display="flex" flexDirection="column"
                alignItems="center" mt="2">
                <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus lectus nec metus facilisis feugiat. Aliquam non aliquet libero. Etiam aliquet metus ac ex malesuada pretium et in massa. Vestibulum et hendrerit libero. Praesent a semper erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed lobortis dapibus mi, in consectetur libero euismod quis. Donec mi massa, placerat sit amet vestibulum id, suscipit nec nunc. Vestibulum nibh mauris, molestie et est a, aliquam lobortis sem. Mauris sed leo rhoncus, viverra orci sed, vehicula diam. Donec eget justo sit amet nulla mattis porttitor. Morbi ac suscipit ante. Vivamus sit amet sagittis eros, ac sodales tellus. Donec eu ex ligula. Donec commodo id ipsum non convallis. Nullam ut mi nec nibh pulvinar scelerisque ac a mauris.

                    Nam mi ligula, congue ac tellus vel, tempus dapibus neque. Quisque rhoncus mollis justo sed mattis. Sed vel dui at leo blandit bibendum at ut nibh. Ut vel ornare nunc. Morbi mi elit, tincidunt eu ligula ac, rhoncus tincidunt dui. Pellentesque in aliquam mi. Phasellus tincidunt et massa vel fermentum. Fusce convallis efficitur nisl eu consectetur. Etiam nec velit sed eros fringilla tincidunt ut vel nisi. Nunc purus elit, vehicula vel dolor et, lacinia tristique risus. Sed malesuada augue enim, eu placerat magna porta nec. Nam justo lectus, rutrum ut arcu at, tempor laoreet tortor. Nulla facilisi. Aliquam erat volutpat. Donec suscipit lacus vitae neque pulvinar, a dictum tellus dictum. Morbi tincidunt nisi in nulla aliquam varius.

                    Integer ullamcorper sit amet nibh non pellentesque. Donec feugiat ipsum vitae felis varius tempor. Maecenas et urna ut dolor interdum rutrum consequat lobortis elit. Aenean ultricies mi vel suscipit posuere. Nam auctor, mauris vitae dapibus porttitor, enim quam viverra mauris, eget ornare tortor felis eu risus. Curabitur sollicitudin sem sit amet lacus aliquam, molestie facilisis massa rutrum. Cras maximus est ut tortor finibus laoreet. Nullam pharetra pretium ipsum, et efficitur nunc. Aliquam sit amet nunc libero. Fusce pellentesque leo quis augue ullamcorper accumsan. Vestibulum quis leo eget metus dignissim vulputate.

                    Ut velit dolor, ultricies ut gravida sit amet, commodo at justo. Suspendisse porta leo enim, nec finibus mi venenatis vel. Praesent lacinia ipsum auctor feugiat volutpat. Vivamus blandit, elit sed sagittis ultrices, sapien ex posuere quam, at feugiat quam elit eu justo. Suspendisse ac dolor eget dolor tincidunt cursus nec et tellus. Vivamus id condimentum eros, id porta lacus. Pellentesque leo metus, fringilla vel turpis a, placerat luctus felis. Maecenas sed posuere felis. Vivamus tempor euismod laoreet. Aliquam varius in ex ac suscipit. Aliquam ac interdum justo.

                    Quisque id orci at erat rutrum tincidunt. Nullam erat est, laoreet eu mollis in, vehicula ac justo. In at rhoncus nibh. Cras sapien erat, tristique dapibus tempus non, pharetra sit amet leo. Suspendisse nec lorem quis ante suscipit interdum ut sed sem. Cras nec nunc sem. Quisque eu ante nisi. Donec sed velit venenatis, tempor tellus vel, iaculis nisi. Ut porttitor ligula tempus, aliquet lorem nec, commodo sapien. Nullam fringilla hendrerit congue. Maecenas id magna non ipsum luctus euismod. Vivamus semper, ligula at semper elementum, libero nulla fermentum urna, non venenatis tortor nisi quis metus. Duis in nulla ut nisl posuere elementum. Sed dapibus, elit non molestie sagittis, nibh tellus dignissim ante, et pulvinar tellus massa quis sem. In hac habitasse platea dictumst.

                    Aenean luctus purus non volutpat eleifend. Mauris a elit massa. Sed maximus eu elit eu pulvinar. Vestibulum vulputate molestie malesuada. Donec vel euismod magna. Aenean cursus aliquet dolor, vel luctus diam blandit id. Mauris dictum dignissim augue et rhoncus. Praesent feugiat luctus mollis. Proin nulla tellus, porttitor sed ligula sed, imperdiet dignissim mi. Phasellus viverra eleifend sem eu lacinia. Curabitur tempor rhoncus enim, non cursus dolor pulvinar nec. Maecenas efficitur, justo at finibus tristique, augue enim auctor augue, et placerat eros ex nec purus. Aliquam elit massa, lacinia vel metus eget, tincidunt aliquet felis. Suspendisse ex lacus, lacinia et eros eu, vehicula suscipit leo. Sed cursus iaculis mauris, quis elementum turpis aliquet sed. In vitae luctus lectus.

                    Nulla nec aliquam nisi. Suspendisse potenti. In eu nulla ligula. Cras sit amet tincidunt leo. Pellentesque porttitor rutrum neque, vel varius purus congue in. Nulla nec ipsum placerat, mollis massa at, efficitur sapien. Pellentesque a lorem non magna gravida mattis. Maecenas facilisis dui a leo tempus gravida. Quisque ac neque pretium, venenatis lorem eu, interdum tortor. Nam eget purus sit amet tortor sollicitudin fringilla. Duis luctus, nulla ut rutrum hendrerit, nisl tellus feugiat velit, at dignissim augue justo vel ipsum.

                    Duis porttitor risus ut dolor accumsan interdum. Vivamus risus mauris, luctus eu urna a, viverra tristique nulla. Sed ut malesuada erat. Duis ut pharetra odio. Sed vel orci scelerisque, suscipit enim sit amet, sodales neque. Mauris sit amet rhoncus neque. Curabitur facilisis diam id libero posuere tincidunt. Vestibulum fermentum arcu molestie, faucibus massa sit amet, eleifend eros. Fusce suscipit consequat neque quis mollis. Ut finibus, lectus eu mattis rutrum, enim est auctor lectus, ut eleifend mi eros pretium diam. Curabitur non mi quis erat ultricies laoreet pellentesque et purus. Sed convallis urna augue.

                    Aliquam efficitur urna ut felis pharetra, nec mollis arcu maximus. Proin volutpat tincidunt leo, nec maximus nisl ultrices nec. Nulla id dui neque. Nunc lobortis aliquet orci, eu malesuada nulla molestie et. In nec sem id urna pretium semper. Ut aliquam vel mauris nec efficitur. Vivamus erat orci, molestie mattis ultricies nec, congue bibendum libero. Duis tortor nisi, laoreet ac ex eget, rhoncus tincidunt magna. Cras at rutrum sem. Vivamus quis ante diam. Nam sagittis sem mi, ac vulputate justo porta ut. Fusce blandit tempor interdum. Cras imperdiet urna sit amet semper vulputate. Proin massa velit, egestas vitae venenatis at, consectetur sed libero.

                    Vivamus interdum elit non felis eleifend, vitae condimentum enim varius. Vivamus ac auctor lacus. Vestibulum aliquam augue volutpat euismod tristique. Maecenas lobortis quis tortor at pellentesque. Duis euismod cursus placerat. Suspendisse nec laoreet orci. Maecenas convallis, odio at suscipit euismod, turpis justo venenatis nisl, ut fringilla mauris libero in erat. Vivamus vel consequat sem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam viverra gravida metus eget aliquam. Donec vitae fermentum magna. Aenean nec molestie turpis. Vivamus elementum odio id tortor vulputate feugiat. In vitae nisi pretium, eleifend urna nec, aliquam dolor. Vivamus volutpat fringilla nisl, eget dapibus magna posuere eget. Proin sagittis elit sed velit consectetur hendrerit.

                    Phasellus sagittis gravida tellus, at luctus neque suscipit non. Donec accumsan varius rutrum. Vivamus non bibendum magna. Ut gravida nulla purus, in tincidunt turpis vestibulum quis. Donec ultricies ipsum enim, ut posuere ligula molestie nec. Aenean ipsum ex, euismod vel tortor in, tristique rutrum sapien. Vestibulum ultricies, nisi sed volutpat dictum, nisi tortor bibendum tellus, in interdum dui urna vitae augue. Sed fringilla id est non pulvinar. Suspendisse non eros tristique, rhoncus mi in, ultricies leo. Pellentesque ut mi congue nisi blandit sodales. Sed facilisis varius felis eu tristique. Donec sit amet nisi quam. Suspendisse eget ex at augue auctor rhoncus. Cras lectus magna, consectetur bibendum placerat sit amet, cursus non velit. Ut vitae feugiat libero, quis tincidunt orci.

                    Integer sit amet malesuada justo, eu vestibulum diam. Vivamus venenatis magna eget velit elementum, eu rutrum est tempus. Ut bibendum, turpis eu viverra tristique, felis ligula consequat arcu, in tempus mi sem ac magna. Sed justo sapien, molestie ut rutrum sed, euismod et diam. Nam vitae magna condimentum, posuere mauris eu, accumsan nunc. Proin gravida id lacus quis fringilla. Cras vel facilisis eros. Proin ornare enim efficitur eros tristique maximus. Nullam sagittis ullamcorper ante. Maecenas eleifend risus quis sapien fermentum finibus. Suspendisse consequat massa at urna varius, pharetra ornare tellus malesuada. Proin egestas orci vitae tristique bibendum. Sed feugiat lobortis quam vel pellentesque. Vivamus blandit, arcu sit amet tristique vestibulum, metus massa pellentesque risus, sed tincidunt lorem metus ut dolor. Sed fermentum felis interdum orci ultricies, nec finibus dui dictum. Aliquam sit amet nunc quis nunc pharetra facilisis non nec elit.

                    Praesent ullamcorper metus at nisi dictum tempus. Proin tempus erat metus, a tincidunt ligula elementum eget. Nullam pretium, turpis non facilisis luctus, ligula tellus eleifend lorem, et commodo neque erat vitae massa. Nulla diam diam, tincidunt eget gravida sit amet, porttitor feugiat ligula. Mauris ex nisi, pretium sed iaculis eget, molestie in lorem. In cursus malesuada elit ut volutpat. Maecenas et commodo sem. Vestibulum tincidunt ante sit amet ipsum convallis blandit. Nulla facilisi. Vestibulum fermentum purus id urna ultricies, eu ornare libero feugiat. Quisque eu purus eu mi tristique pharetra sed at augue. Nam eu feugiat augue. Proin et finibus massa. Duis in dapibus sapien. Morbi aliquet turpis in ligula aliquam maximus. Aliquam at ante aliquet, elementum quam a, sodales metus.

                    Etiam mattis ligula ut turpis lobortis interdum. Maecenas metus augue, euismod nec ante et, imperdiet tristique dui. Curabitur a feugiat velit, sit amet accumsan nibh. Nam cursus augue ut nisl semper, eu vestibulum magna cursus. Suspendisse potenti. Mauris nec justo eu lacus placerat volutpat eu ac lacus. Cras sit amet maximus sem. Etiam in libero ac risus consequat consectetur. Vivamus leo lectus, imperdiet a faucibus at, convallis ut risus. Morbi ornare pretium feugiat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla facilisi. Sed neque tortor, tincidunt ullamcorper vehicula vel, sagittis at diam. Nulla vulputate elementum arcu, vel suscipit leo suscipit at.

                    Morbi malesuada dictum sapien eget viverra. Pellentesque ligula erat, hendrerit eu dui sed, placerat condimentum diam. Ut sem urna, accumsan in vestibulum efficitur, tristique ac enim. Pellentesque nisi lectus, dignissim et dui sit amet, sodales dictum justo. Nunc nisi sem, volutpat in aliquet ut, bibendum id nulla. Duis porta turpis id tortor auctor rutrum. Nullam a sapien in erat fermentum semper. Nullam in arcu orci. Vivamus tristique libero metus, vitae vulputate ex vestibulum id. Curabitur in viverra nisl. Fusce pellentesque gravida bibendum. Vestibulum eget egestas nunc. Curabitur viverra turpis nec lectus scelerisque, ut sagittis libero aliquet. Nunc lacinia nisl nibh, vitae luctus erat ultrices sed. Phasellus ac rutrum ante. Ut a neque quis dui pretium bibendum sit amet ac nisl.

            </Text>
            </ModalBody>
        </ModalContent>

    )
}


const SignupAdmin = () => {
    const defaultUserForm = {
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: null,
        password: "",
        confirmPassword: "",
        username: ""
    }
    const userFormKey = "thefaithful-user-form"
    const history = useHistory()
    const [open, setOpen] = React.useState(true)
    const dispatch = useDispatch()
    const classes = useStyles()
    const [location, setLocation] = React.useState<IState>({
        country: [],
        city: [],
        state: []
    })
    const [showTerm, setSetShowTerm] = React.useState(false)
    const toast = Toast()
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
        }
    })
    const [denomination, setDenomination] = React.useState<IDenomination[]>([])

    React.useEffect(() => {
        const getCountry = async (toast: ToastFunc) => {
            try {
                return await utilityService.getCountry().then(payload => {
                    const foundCountry = payload.data.find(item => item.countryID === 160)
                    // setCountry([foundCountry as ICountry,...payload.data.filter(item => item.countryID !== 160)])
                    setLocation({
                        ...location, country:
                            [foundCountry as ICountry, ...payload.data.filter(item => item.countryID !== 160)]
                    })
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

    // For showing the dialog
    const handleDialog = () => {
        setShowDialog(!showDialog)
    }

    const closeDialog = () => {
        setShowDialog(false)
        history.push(`/church/${churchForm.churchID}/dashboard`)
    }
    const showTermDialog = () => {
        setSetShowTerm(true)
        handleDialog()
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
        const { email, firstname, lastname, genderID, password, phoneNumber } = userForm
        const { countryID, stateID, cityID, churchID } = churchValue
        const newUser: IChurchMember = {
            username: String(phoneNumber),
            password,
            phoneNumber,
            email,
            firstname,
            lastname,
            genderID,
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
            // Assign the role of admin to the newly created staff
            assignRoleClaimToUser(assignRoleString).then(payload => {
                actions.resetForm()
                actions.setSubmitting(false)
                // Login the user
                dispatch(login(newUser.username!, newUser.password, toast))
                const afterLogin = () => {
                    setShowChurchForm(true)
                    setUserForm({ ...defaultUserForm })
                    setSetShowTerm(false)
                    // Show dialog if creating a new user is successful
                    handleDialog()
                    // })
                    toast({
                        title: "New Church Admin created",
                        subtitle: `Admin ${newUser.firstname}-${newUser.lastname} Successfully created`,
                        messageType: MessageType.SUCCESS,
                    })
                }
                afterLogin()
            }).catch(err => {
                toast({
                    title: "Unable to add Role to User",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.ERROR
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
            churchMotto: values.churchMotto,
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
                    <Stack spacing={3} my={5} align={["center", "flex-start"]} >
                        <Heading fontSize="43px" >
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
                                                maxWidth="24rem" px="1" mx={["auto", "initial"]} >
                                                <Box>
                                                    <TextInput name="firstname" placeholder="First Name" />
                                                    <TextInput name="lastname" placeholder="Last Name" />
                                                    <TextInput name="email" placeholder="email" />
                                                    <TextInput name="phoneNumber" placeholder="Phone Number" />
                                                    <Select name="genderID" placeholder="Gender">
                                                        <option value={1}>
                                                            Male
                                                        </option>
                                                        <option value={2}>
                                                            Female
                                                        </option>
                                                    </Select>
                                                    <PasswordInput name="password" placeholder="Password" />
                                                    <PasswordInput name="confirmPassword" placeholder="Confirm Password" />
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
                                            <Box my={["4"]} px="4" maxWidth={image.banner.base64 ? "lg" : "24rem"}>
                                                {
                                                    open ?
                                                        <Fade mountOnEnter unmountOnExit in={open}>
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
                                                                <TextInput name="address" placeholder="Church Address" />
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
                                                                    <Text>
                                                                        Agree to our  &nbsp;
                                                                            <Button variant="link" textDecoration="underline" onClick={showTermDialog}>
                                                                            Terms of Service and Policy
                                                                            </Button>
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
                                                            <VStack w="100%">
                                                                <Box alignSelf="flex-start" w={image.banner.base64 ? "100%" : ""} >
                                                                    <HStack>
                                                                        <GoBack func={handleToggle} />
                                                                        <TextInput showErrors={false} name="churchMotto" placeholder="Church Motto" />
                                                                    </HStack>
                                                                    <Box border="2px dashed rgba(0,0,0,.4)" >
                                                                        <input id="image" type="file" name="logo" onChange={handleImageTransformation}
                                                                            accept="image/jpeg, image/png" style={{ display: "none" }} />
                                                                        <label htmlFor="image" >
                                                                            {image.logo.base64 ?
                                                                                <VStack justify="center" mt="4" align="center" >
                                                                                    <Text color="primary" >
                                                                                        Church Logo
                                                                            </Text>
                                                                                    <Avatar size="2xl" src={image.logo.base64} />
                                                                                </VStack> :
                                                                                <Button color="white" as="span"
                                                                                    bgColor="rgba(0,0,0,.6)">
                                                                                    Church Logo
                                                                                    </Button>
                                                                            }
                                                                            {image.logo.name && <Text>{image.logo.name}</Text>}
                                                                        </label>
                                                                    </Box>
                                                                    <Box border="2px dashed rgba(0,0,0,.4)" >
                                                                        <input id="banner" type="file" name="banner" onChange={handleImageTransformation}
                                                                            accept="image/jpeg, image/png" style={{ display: "none" }} />
                                                                        <label htmlFor="banner" >
                                                                            {
                                                                                image.banner.base64 ?
                                                                                    <>
                                                                                        <Text color="primary">
                                                                                            Church Banner
                                                                                    </Text>

                                                                                        <AspectRatio w="100%" ratio={21 / 9}>
                                                                                            <Image src={image.banner.base64} objectFit="cover" />
                                                                                        </AspectRatio>
                                                                                    </> :
                                                                                    <Button color="white" as="span"
                                                                                        bgColor="rgba(0,0,0,.6)">
                                                                                        Church Banner
                                                                                        </Button>
                                                                            }
                                                                            {image.banner.name && <Text>{image.banner.name}</Text>}
                                                                        </label>
                                                                    </Box>
                                                                    <Button disabled={formikProps.isSubmitting} className={classes.button}
                                                                        width={["90vw", "100%"]} my="6" maxWidth="sm"
                                                                        onClick={(formikProps.handleSubmit as any)}>
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
            <Dialog size="xl"
                open={showDialog} close={showTerm ? handleDialog : closeDialog}>
                {showTerm ? <TermDialog/> : <VerifyDialog handleToggle={handleDialog} />}
            </Dialog>

        </>
    )
}

export default React.memo(SignupAdmin)