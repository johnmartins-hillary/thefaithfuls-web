import React from "react"
import {
    Box, Flex, StackDivider, Stack,
    VStack, HStack,Image,Text, Icon, ModalBody, ModalCloseButton,
    ModalContent,Skeleton, ModalFooter,ModalHeader, IconButton,Wrap,
    Checkbox, Menu, MenuItem, MenuList, MenuButton, AspectRatio, Heading, Avatar, useBreakpoint
} from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { Button } from "components/Button"
import { getStaffByChurch, createStaff,deleteStaff,editStaff } from "core/services/account.service"
import { getAllClaims, getAllRoleByChurchId,assignClaimToUser,
        removeClaimFromUser, removeRoleFromUser, assignRoleClaimToUser } from "core/services/user.service"
import { IChurchMember } from "core/models/ChurchMember"
import { useSelector } from "react-redux"
import { AppState } from "store"
import { IRole } from "core/models/Role"
import { IStaff } from "core/models/Staff"
import { TableRow, Table } from "components/Table"
import { RiDeleteBinLine } from "react-icons/ri"
import { BiEdit } from "react-icons/bi"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Input } from "@material-ui/core"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { Dialog } from "components/Dialog"
import { TextInput, Select } from "components/Input"
import { MessageType } from "core/enums/MessageType"
import { Formik, FormikProps } from "formik"
import { useDispatch } from "react-redux"
import { setPageTitle } from "store/System/actions"
import * as Yup from 'yup'
import { IClaim } from "core/models/Claim"
import { ListItemText } from "@material-ui/core"
import { buttonBackground, primary } from "theme/palette"
import { Tag } from "components/Tag"
import { BsCardImage } from "react-icons/bs"
import {SearchInput} from "components/Input"
import {useInputTextValue} from "utils/InputValue"
import axios, { CancelTokenSource } from "axios"


interface IAddUser {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: number | null;
    password: string;
    role: string
}

const useStyles = makeStyles((theme) => createStyles({
    root: {
        "& input,select": {
            color: "initial !important"
        }
    },
    tableContainer: {
        width: "100%",
        // "& > *": {
        //     width: "95%"
        // }
    },
    input: {
        "& select": {
            color: "initial !important",
        },
        "& svg": {
            color: "black !important "
        }
    }
}))

const changeStaffStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        "& input,select": {
            color: "initial !important"
        }
    },
    menuContainer: {
        "& > *": {
            position: "relative"
        }
    },
    menuListContainer: {
        left: "initial !important",
        width: "60%",
        maxHeight: "15rem",
        overflowY: "auto"
    },
    selectedItem: {
        backgroundColor: "whitesmoke"
    },
    input: {
        "& select": {
            color: "initial !important",
        },
        "& svg": {
            color: "black !important "
        }
    },
    menuItem: {
        "& span": {
            color: primary
        },
        "& p": {
            color: "black"
        }
    },
    claimContainer: {
        overflowY: "auto",
        justifyContent: "center",
        overflowX: "hidden",
        maxHeight:"17.5rem"
    },
    imageContainer: {
        border: "1px dashed rgba(0, 0, 0, .5)",
        borderRadius: "4px",
        width: "25vh",
        height: "20vh",
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
    inputHidden: {
        display: "none"
    },
}))


interface IAddStaff {
    updateStaff(): void
    closeDialog(): void
}

const AddStaff: React.FC<IAddStaff> = ({ updateStaff, closeDialog }) => {
    const classes = useStyles()
    const params = useParams()
    const church = useSelector((state: AppState) => state.system.currentChurch)
    const [roles, setRoles] = React.useState<IRole[]>([])
    const toast = useToast()
    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        const getRolesApiCall = async () => {
            getAllRoleByChurchId(Number(params.churchId),cancelToken).then(payload => {
                setRoles(payload.data)
            }).catch(err => {
                toast({
                    title: "Unable to to get List of Roles",
                    subtitle: `Error :${err}`,
                    messageType: "error"
                })
            })
        }
        getRolesApiCall()
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const initialValues = {
        email: "",
        phoneNumber: null,
        firstname: "",
        lastname: "",
        password: "",
        role: ""
    }
    const validationSchema = Yup.object({
        firstname: Yup.string().min(3, "Name is too Short").required(),
        lastname: Yup.string().min(3, "Name is too Short").required(),
        email: Yup.string().email("Invalid Email address").required(),
        phoneNumber: Yup.number().required(),
        password: Yup.string().min(6, "Password is too short").required(),
        role: Yup.string().oneOf(roles.map((item) => item.name), "Role is not included in the accepted list")
    })

    const handleSubmit = (values: IAddUser, { ...actions }: any) => {
        actions.setSubmitting(true)
        const { firstname, lastname, email, phoneNumber, password, role } = values
        const newChurchStaff: IChurchMember = {
            username:String(phoneNumber),
            password,
            phoneNumber,
            email,
            firstname,
            lastname,
            countryID:church.countryID,
            stateID:church.stateID,
            cityID:church.cityID,
            personTypeID: 3,
            enteredBy: "ChurchAdmin",
            role,
            churchId: Number(church.churchID),
            isDataCapture: false,
            societies: [],
            societyPosition: []
        }


        createStaff(newChurchStaff).then(payload => {
            actions.setSubmitting(false)
            actions.resetForm()
            toast({
                title: "New User",
                subtitle: `New User ${newChurchStaff.username} has been created`,
                messageType: MessageType.SUCCESS
            })
            updateStaff()
            closeDialog()
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to create new User",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    return (
        <ModalContent py={10} bgColor="bgColor2" className={classes.root}>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalHeader color="primary" textStyle="h4"
                textAlign="center" mt={5} fontSize="1.875rem">
                Add A Staff
            </ModalHeader>
            <Formik initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(formikProps: FormikProps<IAddUser>) => {
                    return (
                        <>
                            <ModalBody color="#F3F3F3" display="flex"
                                flexDirection="column" alignItems="center">
                                <VStack my={[5, 10]} width={["95%", "80%"]} >
                                    <TextInput name="firstname" placeholder="firstname" />
                                    <TextInput name="lastname" placeholder="lastname" />
                                    <TextInput name="email" placeholder="Email" />
                                    <TextInput name="phoneNumber" placeholder="Phone Number" />
                                    <TextInput name="password" placeholder="Password" />
                                    <Select placeholder="select Roles" name="role" className={classes.input} >
                                        {roles.map((item, idx) => (
                                            <option key={item.concurrencyStamp} value={item.name} >
                                                {item.name}
                                            </option>
                                        ))}
                                    </Select>
                                </VStack>
                            </ModalBody>
                            <ModalFooter display="flex" justifyContent="center">
                                <Button px={5}
                                    isLoading={formikProps.isSubmitting} loadingText={`Creating User ${formikProps.values.firstname}`}
                                    disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                    onClick={(formikProps.handleSubmit as any)}
                                >
                                    Add
                                </Button>
                            </ModalFooter>
                        </>
                    )
                }}
            </Formik>
        </ModalContent>

    )
}

interface IChangeStaffProps extends IAddStaff {
    currentStaff: IStaff
}

const ChangeStaff: React.FC<IChangeStaffProps> = ({ updateStaff, closeDialog,...props}) => {
    interface IStaffClaims extends IClaim {
        staffHasClaim: boolean
    }
    const classes = changeStaffStyles()
    const church = useSelector((state: AppState) => state.system.currentChurch)

    const [initialStaffClaims, setInitialStaffClaims] = React.useState<IStaffClaims[]>([])
    const [selectedStaffClaims, setSelectedStaffClaims] = React.useState<IStaffClaims[]>([])
    const [notSelectedStaffClaims, setNotSelectedStaffClaims] = React.useState<IStaffClaims[]>([])
    const [currentStaff,setCurrentStaff] = React.useState<IStaff>(props.currentStaff)
    const [loading,setLoading] = React.useState(true) 
    const [churchRoles, setChurchRoles] = React.useState<IRole[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const [image, setImage] = React.useState({
        name: "",
        base64: ""
    })
    const params = useParams()
    const toast = useToast()


    const handleImageTransformation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setImage({
                    base64: (reader.result as string),
                    name: file.name
                })
            }
            reader.readAsDataURL(file)
        }
    }

    // Check if the user has the claim on the claim property
    const checkStaffClaims = (claimArg: IClaim[]) => {
        const {claim} = currentStaff
        return claimArg.map(item => ({
            ...item,
            staffHasClaim: claim!.includes(item.claimName)
        })
        )
    }

    // For Getting the API call
    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        const getClaimApiCall = async () => {
            getAllClaims(cancelToken).then(payload => {
                const checkStaffHasClaims: IStaffClaims[] = checkStaffClaims(payload.data)
                setInitialStaffClaims(checkStaffHasClaims)
            }).catch(err => {
                toast({
                    title: "Unable to to get List of Roles",
                    subtitle: `Error :${err}`,
                    messageType: "error"
                })
            })
        }
        
        const getRolesByChurchApiCall = async () => {
            getAllRoleByChurchId(Number(params.churchId),cancelToken).then(payload => {
                setChurchRoles(payload.data)
                const foundRole = payload.data.find(item => item.id === currentStaff.role)
                setCurrentStaff({
                    ...currentStaff,
                    role:foundRole?.name || currentStaff.role
                })
                setLoading(false)
            }).catch(err => {
                toast({
                    title: "Unable To Get List of Church Roles",
                    subtitle: `Error:${err}`,
                    messageType: "error"
                })
            })
        }
        getClaimApiCall()
        getRolesByChurchApiCall()
        return () => {
            cancelToken.cancel()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    React.useEffect(() => {
        const newSelectedStaffClaims = initialStaffClaims.filter(item => item.staffHasClaim)
        setSelectedStaffClaims([...newSelectedStaffClaims])
        setNotSelectedStaffClaims([...initialStaffClaims])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[initialStaffClaims])
    
    
    const handleIsOpen = () => {
        setIsOpen(!isOpen)
    }
    const showOpen = (e: React.SyntheticEvent<any>) => {
        setIsOpen(true)
    }

    const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue(e.currentTarget.value)
    }
    // For searching for the claims in the ones that are not selected
    React.useEffect(() => {
        const stringTest = new RegExp(inputValue, "i")
        const filterCreate = initialStaffClaims.filter(item => !(selectedStaffClaims.includes(item)))
        const newNotSelectedStaffClaim = filterCreate.filter((item) => stringTest.test(item.claimName))
        setNotSelectedStaffClaims([...newNotSelectedStaffClaim])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue])

    React.useEffect(() => {
        const filterNotSelectedStaffClaim = initialStaffClaims.filter(item => !(selectedStaffClaims.includes(item)))
        setNotSelectedStaffClaims([...filterNotSelectedStaffClaim])
        setInputValue("")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStaffClaims])


    const addToSelected = (claim: IStaffClaims) => {
        setSelectedStaffClaims([...selectedStaffClaims, claim])
    }


    function removeFromSelected<T>(state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>, filterValue: string) {
        interface extendsString {
            [key: string]: any
        }
        return (
            (newValue: T) => (
                () => {
                    const filteredState = [...state]
                    const idx = filteredState.findIndex((item, idx) => (item as unknown as extendsString)[filterValue] === (newValue as unknown as extendsString)[filterValue])
                    filteredState.splice(idx, 1)
                    setState(filteredState)
                }
            )
        )
    }

    const removeFromSelectedClaims = removeFromSelected(selectedStaffClaims, setSelectedStaffClaims, "id")

    const { email, fullname, phoneNumber,role } = currentStaff
    const name = fullname.split(" ")
    const initialValues = {
        email,
        phoneNumber: phoneNumber || null,
        firstname: name[0],
        lastname: name[1],
        claim: "",
        password: "",
        role:(role as string)
    }


    const validationSchema = Yup.object({
        firstname: Yup.string().min(3, "Name is too Short").required(),
        lastname: Yup.string().min(3, "Name is too Short").required(),
        email: Yup.string().email("Invalid Email address").required(),
        phoneNumber: Yup.number().required(),
        // role: Yup.string().oneOf(roles.map((item) => item.name), "Role is not included in the accepted list")
    })


    const handleSubmit = (values: IAddUser, { ...actions }: any) => {
        actions.setSubmitting(true)
        const { firstname, lastname, email, phoneNumber, password,} = values
        const newChurchStaff: IChurchMember | any = {
            username: `${firstname}-${lastname}`,
            password,
            phoneNumber,
            email,
            firstname,
            lastname,
            countryID: church.countryID,
            stateID: church.stateID,
            cityID: church.cityID,
            personTypeID: 3,
            enteredBy: "ChurchAdmin",
            churchId: Number(church.churchID),
            isDataCapture: false,
            ...(image.base64 && {picture_url:image.base64}),
            societies: [],
            societyPosition: [],
            // claim:"",
            // role:"newer"
        }
        const newRole = churchRoles.find(item => item.name === values.role)
        // Change The Detail on the Staff data
        editStaff((newChurchStaff as any)).then(payload => {
            actions.resetForm()
            toast({
                title: "Staff Edited",
                subtitle: `New User ${newChurchStaff.username} has been created`,
                messageType: MessageType.SUCCESS
            })
            // Check if Value of the role of staff remain the same
            if(values.role !== currentStaff.role){
                // Else change the role on staff
                const foundRole = churchRoles.find(item => item.name === currentStaff.role)
                const removeRoleQuery = encodeURI(`agentUserId=${currentStaff.staffID}&roleId=${foundRole!.id}`)
                removeRoleFromUser(removeRoleQuery).then(payload => {
                    // Add the new Role to the staff
                    const assignRoleClaimString = encodeURI(`agentUserId=${currentStaff.staffID}&roleName=${newRole!.name}`)
                    assignRoleClaimToUser(assignRoleClaimString).then(() => {
                        toast({
                            title:"Updated Role Successful",
                            subtitle:"",
                            messageType:"success"
                        })
                    })
                }).catch(err => {
                    toast({
                        title:`Something Went Wrong:${err}`,
                        subtitle:"Please Try Again Later",
                        messageType:"error"
                    })
                })
            }

            // Remove claim From staff
            let addClaimString = ""
            // eslint-disable-next-line
            selectedStaffClaims.map((item) => {
                addClaimString += `&claims=${item.claimName}`
            })
            const assignClaimString = encodeURI(`userId=${currentStaff.staffID}${addClaimString}&roleId=${newRole!.id}`)
            assignClaimToUser(assignClaimString).then(payload => {
                toast({
                    title:"Successfully Added Claim To User",
                    subtitle:"",
                    messageType:"success"
                })
            }).catch(err => {
                toast({
                    title:"Unable To Complete Request",
                    subtitle:`Error:${err}`,
                    messageType:MessageType.ERROR
                })
            })
            // Remove The Claim from The Staff
            let removeClaimString = ""
            // eslint-disable-next-line
            notSelectedStaffClaims.map(item => {
                removeClaimString +=`&claims=${item.claimName}`
            })
            const removeClaimStringQuery = encodeURI(`agentUserId=${currentStaff.staffID}${removeClaimString}`)
            removeClaimFromUser(removeClaimStringQuery).then(payload => {
                toast({
                    title:"Completed Request",
                    subtitle:"",
                    messageType:MessageType.SUCCESS
                })
            }).catch(err => {
                toast({
                    title:"Unable To Remove Claims From User",
                    subtitle:`Error:${err}`,
                    messageType:MessageType.ERROR
                })
            })
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to create new User",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }


    return (
        <ModalContent py={10} bgColor="bgColor2" className={classes.root}>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalHeader color="primary" textStyle="h4"
                textAlign="center" fontSize="1.875rem">
                Edit Staff
            </ModalHeader>
            <Stack justify="center" direction={{ base: "column-reverse", md: "row" }} >
                        <Flex className={classes.imageContainer} p={5} >
                            <input accept="image/jpeg,image/png" onChange={handleImageTransformation} type="file"
                                className={classes.inputHidden} id="icon-button-file" />
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
            {
                !loading &&
                <Skeleton isLoaded={!loading}>
                    <Formik initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(formikProps: FormikProps<IAddUser>) => {
                    return (
                        <>
                            <ModalBody color="#F3F3F3" display="flex"
                                overflow='auto'
                                flexDirection={["column","row"]} alignItems="center">
                                <VStack className={classes.menuContainer} my={[5, 10]} width={["95%", "80%"]} >
                                    <Menu isOpen={isOpen}>
                                        <Flex width="100%">
                                            <Input value={inputValue} onChange={handleInputValueChange}
                                                onFocus={showOpen}
                                                fullWidth={true} placeholder="Select Claims to add to Staff" />
                                            <MenuButton as={IconButton} onClick={handleIsOpen}
                                                icon={isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />} />
                                        </Flex>
                                        <MenuList className={classes.menuListContainer}>
                                            {
                                                notSelectedStaffClaims.length > 0 ?
                                                    notSelectedStaffClaims.map((item, index) => (
                                                        <MenuItem className={classes.menuItem} key={item.id}
                                                        disabled={item.staffHasClaim}    
                                                        onClick={() => { addToSelected(item) }}
                                                        >
                                                            <ListItemText
                                                                primary={item.claimDisplayValue}
                                                                secondary={item.claimType}
                                                            />
                                                            <Checkbox isChecked={item.staffHasClaim} />
                                                        </MenuItem>
                                                    ))
                                                    : <Text>No Available Claim </Text>
                                            }
                                            {
                                                selectedStaffClaims.map((item, index) => (
                                                    <MenuItem className={classes.menuItem} key={item.id}
                                                    disabled={item.staffHasClaim}    
                                                    >
                                                        <ListItemText
                                                            primary={item.claimDisplayValue}
                                                            secondary={item.claimType}
                                                        />
                                                        <Checkbox isChecked={item.staffHasClaim} />
                                                    </MenuItem>
                                                ))
                                            }
                                        </MenuList>
                                    </Menu>
                                    <TextInput name="firstname" placeholder="firstname" />
                                    <TextInput name="lastname" placeholder="lastname" />
                                    <TextInput name="email" placeholder="Email" />
                                    <TextInput name="phoneNumber" placeholder="Phone Number" />
                                    <Select placeholder="select Roles" name="role" className={classes.input} >
                                        {churchRoles.map((item, idx) => (
                                            <option key={item.concurrencyStamp || idx}
                                             value={item.name} >
                                                {item.name}
                                            </option>
                                        ))}
                                    </Select>
                                </VStack>
                                <Wrap className={classes.claimContainer} width={["100%","70%"]}>
                                    {selectedStaffClaims.map((item, idx) => (
                                        <Tag key={item.id} name={item.claimDisplayValue} remove={removeFromSelectedClaims(item)} />
                                    ))}
                                </Wrap>
                            </ModalBody>
                            <ModalFooter display="flex" pt={0} justifyContent="center">
                                <Button
                                    isLoading={formikProps.isSubmitting} loadingText={`Editing Staff ${formikProps.values.firstname}`}
                                    disabled={formikProps.isSubmitting || !formikProps.isValid}
                                    onClick={(formikProps.handleSubmit as any)}
                                >
                                    Add
                                </Button>
                            </ModalFooter>
                        </>
                    )
                }}
            </Formik>
                </Skeleton>
            }
        </ModalContent>
    )
}




const UserManager = () => {
    const defaultStaff: IStaff = {
        churchId: 0,
        fullname: "",
        email: "",
        role: '[""]',
        claim: ""
    }
    const toast = useToast()
    const dispatch = useDispatch()
    const breakpoint = useBreakpoint()
    const notBaseBreakpoint = breakpoint !== "base"
    const params = useParams()
    const [staffMember, setStaffMember] = React.useState<IStaff[]>(new Array(3).fill(defaultStaff))
    const [displayStaffMember,setDisplayStaffMember] = React.useState<IStaff[]>([])
    const [inputValue,setInputValue] = useInputTextValue("")
    const [open, setOpen] = React.useState(false)
    const [dialog, setDialog] = React.useState("privileges")
    const [currentStaff, setCurrentStaff] = React.useState<IStaff>(defaultStaff)
    const [submitting,setSubmitting] = React.useState(false)
    const cancelToken = axios.CancelToken.source()
    const handleToggle = () => {
        setOpen(!open)
    }

    const staffMemberCall = (cancelToken:CancelTokenSource) => async() => {
        getStaffByChurch(Number(params.churchId),cancelToken).then(payload => {
        const parseStaffRole = payload.data.map((item) => ({
            ...item,
            claim: JSON.parse(item.claim as string)
        }))
        setStaffMember(parseStaffRole)
        setDisplayStaffMember(parseStaffRole)
        setCurrentStaff(parseStaffRole[0])
        }).catch(err => {
            toast({
                title: "Unable to get list of church Staff",
                subtitle: `Error:${err}. Pleaseg try again`,
                messageType: "error"
            })
        })
    }
    const apiStaffMemberCall = staffMemberCall(cancelToken)
    React.useEffect(() => {
        const testString = new RegExp(inputValue,"i")
        const filteredStaffMember = staffMember.filter(item => testString.test(item.fullname))
        setDisplayStaffMember([...filteredStaffMember])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[inputValue])
    const handleDialog = (dialogString: string) => {
        setDialog(dialogString)
    }
    const showPrivileges = (arg: IStaff) => () => {
        setCurrentStaff(arg)
        handleDialog("privileges")
        handleToggle()
    }
    const deleteStaffFunc = (staffId:string) => () => {
        setSubmitting(true)
        deleteStaff(staffId).then(payload => {
            toast({
                title:"Delete Staff Successfully",
                subtitle:``,
                messageType:MessageType.SUCCESS
            })
            const churchStaff = staffMember.filter((item) => item.staffID !== staffId)
            setStaffMember([...churchStaff])
            setSubmitting(false)
        }).catch(err => {
            setSubmitting(false)
            toast({
                title:"Unable To Delete Staff",
                subtitle:`Error:${err}`,
                messageType:MessageType.ERROR
            })
        })
    } 
    const showAddStaff = () => {
        handleDialog("addStaff")
        handleToggle()
    }

    React.useEffect(() => {
        dispatch(setPageTitle("User Manager"))
        apiStaffMemberCall()
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Stack spacing={5} p={{ base: "4", md: "0" }} pl={{ md: "12" }}
                width={["100%", "90%"]} pr={{ md: "5" }} pt={{ md: "12" }}
                divider={<StackDivider borderColor="gray.200" />}
            >
                <Flex mb="-.5rem">
                    <Button mr=".5rem" disabled={submitting} px={6} onClick={showAddStaff}>
                        Add A User
                        </Button>
                    <Button variant="outline" px={6} fontFamily="Bahnschrift" disabled={submitting}>
                        <Link to={`/church/${params.churchId}/manager/role`} >
                            Manage Roles
                            </Link>
                    </Button>
                    <Flex flex={{ sm: 2 }} flexShrink={{ md: 2 }} />
                    <SearchInput display={{ base: "none", md: "inline-block" }} flex={1.5} ml="auto"
                        value={inputValue} setValue={setInputValue}
                    />
                </Flex>
                <SearchInput flex={4} display={{ md: "none" }}
                    value={inputValue} setValue={setInputValue}
                />
                <Stack spacing={5} mt={[7, 10]} width="90%" overflow="auto"
                    divider={<StackDivider borderColor="gray.200" />}>
                    <Box>
                        <Text>
                            Sort By Roles
                            <Icon ml={1} as={IoIosArrowDown} />
                        </Text>
                    </Box>
                    <Table rowLength={displayStaffMember.length} heading={["","","Name", "Email", "Phone",""]}>
                        {displayStaffMember.map((item, idx) => (
                            <TableRow key={item.staffID || idx} isLoaded={Boolean(item.staffID)}
                             fields={[
                                <Checkbox/>,<Avatar name="Dan Abrahmov" size={!notBaseBreakpoint ? "sm" : "md"} src="https://bit.ly/dan-abramov" />,
                                item.fullname, item.email, item.phoneNumber,
                                <HStack spacing={3}>
                                    <Icon as={BiEdit} cursor="pointer" onClick={showPrivileges(item)} />
                                    <Icon as={RiDeleteBinLine} cursor="pointer" onClick={deleteStaffFunc(item.staffID as string)} />
                                </HStack>]}
                            />
                        ))}
                    </Table>
                </Stack>
            </Stack>
            <Dialog open={open} size="lg" close={handleToggle} >
                {
                    dialog === "privileges" ?
                        <ChangeStaff closeDialog={handleToggle} currentStaff={currentStaff} updateStaff={apiStaffMemberCall} />
                        :
                        <AddStaff closeDialog={handleToggle} updateStaff={apiStaffMemberCall} />
                }
            </Dialog>
        </>
    )
}



export default UserManager