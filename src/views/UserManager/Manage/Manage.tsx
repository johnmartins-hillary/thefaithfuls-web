import React from "react"
import { Link, useHistory } from "react-router-dom"
import {
    Flex, Wrap, Heading, StackDivider, Avatar, AvatarGroup,
     Stack, VStack, HStack,Text, Icon, IconButton,WrapItem
} from "@chakra-ui/react"
import { Button } from "components/Button"
import { createStyles, makeStyles,Theme } from '@material-ui/core/styles'
import {Divider,Hidden} from "@material-ui/core"
import { DashboardActivity } from "components/Card/ActivityCard/ActivityCard"
import useParams from "utils/params"
import { BiEdit, BiLeftArrowAlt } from "react-icons/bi"
import {RiDeleteBin6Line} from "react-icons/ri"
import { primary } from "theme/palette"
import { getStaffByChurch } from "core/services/account.service"
import { getAllRoleByChurchId } from 'core/services/user.service'
import { setPageTitle } from "store/System/actions"
import * as userService from "core/services/user.service"
import useToast from "utils/Toast"
import { IStaff } from "core/models/Staff"
import { IRole } from "core/models/Role"
import { useDispatch } from "react-redux"
import {SearchInput} from "components/Input"
import axios from "axios"



const useStyles = makeStyles((theme:Theme) => createStyles({
    root: {
        "& > button":{
            backgroundColor:"transparent",
            fontFamily:"MulishRegular",
            "& svg":{
                fontSize:"2rem"
            }
        },
        "& ul":{
            height:"30rem",
            overflowY:"auto",
            justifyContent:"center",
            [theme.breakpoints.up("sm")]:{
                justifyContent:"flex-start"
            }
        },
        "& p":{
            fontFamily:"MulishRegular"
        },
        "& hr":{
            width:"100%",
            [theme.breakpoints.up("md")]:{
                width:"90%"
            }
        }
    }
}))

interface IRolesForStaff extends IRole {
    staff: IStaff[]
}

interface IManageCard {
    heading: string;
    isLoaded:boolean;
    memberAmt: number | string;
    role:IRolesForStaff;
    updateRole(arg:string):void
}


const ManageCard: React.FC<IManageCard> = ({ heading,isLoaded, memberAmt,role,updateRole }) => {
    const history = useHistory()
    const toast = useToast()
    const params = useParams()
    const [submitting,setSubmitting] = React.useState(false)

    const handleDelete = () => {
        setSubmitting(true)
        const deleteRoleString = encodeURI(`churchId=${params.churchId}&rolename=${role.name}`)
        userService.deleteRole(deleteRoleString).then(payload => {
            setSubmitting(false)
            updateRole(role.id)
            toast({
                title:"Role Deleted successful",
                subtitle:"",
                messageType:"success"
            })
        }).catch(err => {
            setSubmitting(false)
            toast({
                title:"Unable To Delete Role",
                subtitle:`Error:${err}`,
                messageType:"error"
            })
        })
    }
    
    return (
        <DashboardActivity isLoaded={isLoaded} width={{ base: "90vw", md: "21rem" }} minHeight="10rem">
            <Flex direction="column" minHeight="10rem" width="100%" px={3} pb={4} >
                <HStack as="div" width="100%" justify="space-between">
                    <Text color="tertiary" fontFamily="MontserratBold" opacity={.5} as="i" >
                        {`${memberAmt} users`}
                    </Text>
                    <AvatarGroup size="xs" max={2}>
                    {new Array(memberAmt).fill("").map(item => (
                        <Avatar border={`2px solid ${primary}`} name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                    ))}
                    </AvatarGroup>
                </HStack>
                <Heading textStyle="h5" fontSize="1.5rem"
                  my={5} color="tertiary" >
                    {heading}
                </Heading>
                <HStack mt="auto " as="div" color="primary" justify="flex-start" >
                    <Flex align="center"
                    >
                        <Icon as={BiEdit} />
                        <Text cursor="pointer"
                        onClick={() => history.push(`/church/${params.churchId}/manager/role/edit/${role.id}`)} >
                            Edit
                        </Text>
                    </Flex>
                    <Flex align="center"
                    >
                        <Icon as={RiDeleteBin6Line} />
                        <Text cursor="pointer" disabled={!submitting} onClick={handleDelete} >
                            Delete
                        </Text>
                    </Flex>
                </HStack>
            </Flex>
        </DashboardActivity>
    )
}

const ManageUser = () => {
    const history = useHistory()
    const params = useParams()
    const classes = useStyles()
    const defaultRolesForStaff:IRolesForStaff = {
        churchId:0,
        concurrencyStamp:"",
        id:"",
        name:"",
        normalizedName:"",
        staff:[],
        
    }
    const toast = useToast()
    const dispatch = useDispatch()
    const [inputText,setInputText] = React.useState("")
    const [roles, setRoles] = React.useState<IRole[]>([])
    const [rolesForStaff, setRolesForStaff] = React.useState<IRolesForStaff[]>(new Array(5).fill(defaultRolesForStaff))
    const [displayRoleStaff,setDisplayRoleStaff] = React.useState<IRolesForStaff[]>([])

    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        const getStaff = getStaffByChurch(Number(params.churchId),cancelToken)
        const getRoles = getAllRoleByChurchId(Number(params.churchId),cancelToken)
        const apiCall = () => {
            const getStaffAndRoles = Promise.all([getStaff,getRoles])
            getStaffAndRoles.then((values) => {
                const newRoles: IRole[] = values[1].data
                const newStaffs: IStaff[] = values[0].data
                setRoles(newRoles)
                const newRolesAndStaff: any = []
                // eslint-disable-next-line array-callback-return
                newRoles.map((item, idx) => {
                    let rolesData: IRolesForStaff = {
                        ...item,
                        staff: ([] as any)
                    }
                    // eslint-disable-next-line array-callback-return
                    newStaffs.map((staffItem) => {
                        const {role} = staffItem
                        if (role === item.id) {
                            // eslint-disable-next-line array-callback-return
                            rolesData.staff.push(staffItem)
                        }
                    })
                    newRolesAndStaff.push(rolesData)
                })
                setRolesForStaff(newRolesAndStaff)
            }).catch(err => {
                if(!axios.isCancel(err)){
                    toast({
                        title: "SomeThing Went Wrong",
                        subtitle: `Error: ${err}`,
                        messageType: "error"
                    })
                }
            })
        }
        dispatch(setPageTitle("User Manager"))
        apiCall()
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    React.useEffect(() => {
        const testString = new RegExp(inputText,"i")
        const filteredRolesForStaff = rolesForStaff.filter(item => testString.test(item.name))
        setDisplayRoleStaff([...filteredRolesForStaff])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[inputText])


    React.useEffect(() => {
        setDisplayRoleStaff(rolesForStaff)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[rolesForStaff])

    const goBack = () => {
        history.goBack()
    }
    const handeleInputChange = (e:React.SyntheticEvent<HTMLInputElement>) => {
        setInputText(e.currentTarget.value)
    }
    const updateRole = (id:string) => {
        const newRoles = roles.filter((item) => item.id !== id)
        const newRolesForStaff = rolesForStaff.filter((item) => item.id !== id)
        setRoles([...newRoles])
        setRolesForStaff([...newRolesForStaff])
    }
    
    return (
        <Stack spacing={5} p={{ base: "4", md: "0" }} className={classes.root} pl={{ md: "12" }}
            width={["100%","90%"]} pr={{ md: "5" }} pt={{ md: "12" }}>
            <IconButton aria-label="go-back button"
                boxSize="1.5rem" onClick={goBack}
                icon={<BiLeftArrowAlt />} />
            <Flex mb="-.5rem" width="90%">
                <Button mr=".5rem" px={6}>
                    <Link to={`/church/${params.churchId}/manager/role/create`}>
                        Create a Role
                        </Link>
                </Button>
                <Flex flex={{ sm: 2 }} flexShrink={{ md: 2 }} />
                <SearchInput flex={1.5} ml="auto" display={{ base: "none", md: "inline-block" }}
                value={inputText} setValue={handeleInputChange} />
            </Flex>
                <SearchInput flex={1}  display={{ md: "none" }}
                value={inputText} setValue={handeleInputChange} />
                    <Divider variant="middle" />
            <Stack spacing={5}>
                <Text color="tertiary" maxWidth="md" fontSize="1rem">
                    A role provides access to predefined menus
                    and features so that depending on the assigned role
                    a user can have access to what they need.
                    </Text>
                <Wrap>
                    {displayRoleStaff.length > 0 ? 
                    displayRoleStaff.map((item, idx) => (
                        <WrapItem key={item.id || idx} >
                            <ManageCard updateRole={updateRole} isLoaded={Boolean(item.name.length > 0)} key={item.id || idx} heading={item.name}
                            role={item}    
                            memberAmt={item.staff.length} />
                        </WrapItem>
                    )): 
                    <Text>
                        No Church Role Available
                    </Text>
                    }
                </Wrap>
            </Stack>
        </Stack>
    )
}



export default ManageUser