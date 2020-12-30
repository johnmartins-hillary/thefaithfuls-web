import React from "react"
import {Link} from "react-router-dom"
import { Box, Heading, Flex,ModalContent,ModalHeader,
        Menu,MenuButton,MenuList,MenuItem,
        ModalFooter, ModalBody,ModalCloseButton,
        Icon, Stack, StackDivider, Text,} from "@chakra-ui/react"
import {Button} from "components/Button"
import { GroupCard } from "components/Card/GroupCard"
import { GroupMemberCard } from "components/Card/GroupMemberCard"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import { CgMoreAlt } from "react-icons/cg"
import {TiCancel} from "react-icons/ti"
import {FiEdit2} from "react-icons/fi"
import {Dialog} from "components/Dialog"
import { OutlineCard } from "components/Card/OutlineCard"
import {loadGroupForChurch,deleteGroup,createGroupMember,
        updateGroup,loadGroupMemberForCurrentGroup,setCurrentGroup} from "store/Group/actions"
import {Select} from "components/Input"
import {getStaffByChurch} from "core/services/account.service"
import {Formik,FormikProps} from "formik"
import {useSelector,useDispatch} from "react-redux"
import {setPageTitle} from "store/System/actions"
import {getGroupPosition} from "core/services/utility.service"
import {ILeaderPosition} from "core/models/Group"
import {MessageType} from "core/enums/MessageType"
import useParams from "utils/params"
import useToast from "utils/Toast"
import {AppState} from "store"
import {IStaff} from "core/models/Staff"
import * as Yup from 'yup'

interface IAddUser {
    member:string;
    position:number;
}

const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        "& > div:first-child":{
            minWidth:"20rem",
            "& > h2":{
                whiteSpace:"nowrap"
            }
        }
    },
    select:{
        color:"black",
        "& > option":{
            color:"black"
        }
    }
}))



const AddUserToGroup = ({close}:any) => {
    const dispatch = useDispatch()
    const currentGroup = useSelector((state:AppState) => state.group.currentGroup)
    const params = useParams()
    const classes = useStyles(0)
    const toast = useToast()
    const [position,setPosition] = React.useState<ILeaderPosition[]>()
    const [member,setMember] = React.useState<IStaff[]>()

    React.useEffect(() => {
        const apiPositionCall = async () => {
            await getGroupPosition().then(payload => {
                setPosition(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to load Group Position",
                    subtitle:`Error:${err}`,
                    messageType:MessageType.ERROR
                })
            })
        }
        const apimemberCall = async () => {
            await getStaffByChurch(Number(params.churchId)).then(payload => {
                setMember(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to load Church member",
                    subtitle:`Error:${err}`,
                    messageType:MessageType.ERROR
                })
            })
        }
        apiPositionCall()
        apimemberCall()
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleSubmit = (values: IAddUser,actions: any) => {
        actions.setSubmitting(true)
        const newGroupMember = {
            societies:[currentGroup.societyID!],
            churchId:Number(params.churchId),
            societyPosition:[values.position],
            personId:values.member
        }
        dispatch(createGroupMember(newGroupMember,toast))
        actions.setSubmitting(false)
        actions.resetForm()
        close()
    }
    const validationSchema = Yup.object({
        // eslint-disable-next-line no-mixed-operators
        position:Yup.number().oneOf((position && position.map((item,idx) => item.leadersPositionID) as number[] || []),
        `Item must be one of the following ${position?.map((item,idx) => item.position)} `).required(),
        // eslint-disable-next-line no-mixed-operators
        member:Yup.string().oneOf((member && member.map((item,idx) => item.staffID)|| []),
        `Item must be one of the following ${member?.map((item,idx) => item.fullname)} `).required()
    })
    const initialValues = {
        member: "",
        position:0
    }
    

    return (
        <ModalContent bgColor="bgColor2">
            <ModalHeader></ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
                <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<IAddUser>) => (
                        <>
                            <ModalBody color="#F3F3F3" display="flex"
                                flexDirection="column" alignItems="center">
                                    <Select name="position" label="Choose Member Position"
                                        placeholder="Select Group Position" className={classes.select}>
                                        {position?.map((item,idx) => (
                                            <option value={item.leadersPositionID} key={idx} >
                                                {item.position}
                                            </option>
                                        ))}
                                    </Select>
                                    <Select name="member" label="Add Member"
                                        placeholder="Choose Member to Add" className={classes.select}>
                                        {member?.map((item,idx) => (
                                            <option value={item.staffID} key={idx} >
                                                {item.fullname}
                                            </option>
                                        ))}
                                    </Select>
                            </ModalBody>
                            <ModalFooter display="flex" justifyContent="center">
                                <Button disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                 bgColor="primary" width="45%" color="white"
                                 onClick={(formikProps.handleSubmit as any)} >
                                   {formikProps.isSubmitting ? "Creating a new Group Member" 
                                   : formikProps.isValid ?  "Add" : "Please fill Form"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </Formik>
        </ModalContent>

    )
}

const Group = (props:any) => {
    const groups = useSelector((state:AppState) => state.group.groups)
    const currentGroup = useSelector((state:AppState) => state.group.currentGroup)
    const dispatch = useDispatch()
    const [open,setOpen] = React.useState(false)
    const classes = useStyles()
    const params = useParams()
    const toast = useToast()
    
    React.useEffect(() => {
        dispatch(setPageTitle("Church Groups"))
        dispatch(loadGroupForChurch(params.churchId,toast))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const setCurrentGroupMember = (societyId:number) => {
        dispatch(loadGroupMemberForCurrentGroup(societyId,toast))
    }
    React.useEffect(() => {
        if(!currentGroup.name && groups[0]?.name.length > 0){
            console.log("calling us")
            dispatch(setCurrentGroup(groups[0].name))
            setCurrentGroupMember((groups[0].societyID as number))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[groups])
    
    const handleToggle = () => {
        setOpen(!open)
    }
    const changeActive = (groupName: string,groupId:number) => () => {
        setCurrentGroupMember(groupId)
       dispatch(setCurrentGroup(groupName))
    }
    const handleUpdate = () => {
        dispatch(updateGroup)
    }
    const handleDelete = (societyID:number) => () => {
        dispatch(deleteGroup(societyID,toast))
    }
    

    return (
        <>
            <Flex direction={["column","column", "row"]} className={classes.root} {...props}>
                <Flex flex={2} bgColor="#F3F3F3" pt="3" maxWidth={{md:"md"}}
                    direction="column" height="100vh" >
                    <Button width={{base:"90%",md:"65%"}} mx="2">
                        <Link to="groups/create" >
                            Add Group
                        </Link>
                    </Button>
                    <Heading fontWeight="400" mt="3" color="primary" >
                        Church Groups
                    </Heading>
                    <Stack spacing={3} maxHeight={["30vh", "30vh", "75vh", "auto"]}
                     overflowY="auto">
                        {groups.length > 0 ? 
                        groups.map((item,idx) => (
                            <OutlineCard my="3" cursor="pointer" key={idx}
                                onClick={changeActive(item.name,item.societyID!)}
                                active={currentGroup.name === item.name} >
                                <GroupCard member={item.memberCount} imgSrc={item.imageUrl || "https://bit.ly/ryan-florence"}
                                    active={!item.isDeleted} name={item.name} width="95%"
                                />
                            </OutlineCard>
                        )) : <Text>No Group Available</Text>}
                    </Stack>
                </Flex>
                <Flex flex={5} flexShrink={5} pt="10" pl={{base:0,md:5}} bgColor="#F9F5F9">
                    <Stack spacing={5} width={[ "95%","75%"]} maxWidth={{md:"3xl"}}
                        divider={<StackDivider borderColor="gray.200" />}>
                        <Flex justify="space-between">
                            <Box>
                                <Text fontSize="1rem" color="#383838" >
                                    Group Name
                                </Text>
                                <Heading fontSize="1.5rem" color="#151C4D">
                                    {currentGroup.name}
                                </Heading>
                            </Box>
                            {
                                currentGroup.name &&
                                <Menu>
                                    <MenuButton>
                                    <Icon bgColor="primary" color="white"
                                                boxSize="2.5rem" as={CgMoreAlt}
                                                borderRadius="50%"/>
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={handleUpdate}>
                                            <Icon as={FiEdit2}/>
                                            <Text>Edit</Text>
                                        </MenuItem>
                                        <MenuItem onClick={handleDelete((currentGroup.societyID as number))}>
                                            <Icon as={TiCancel}/>
                                            <Text>Delete</Text>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            }
                        </Flex>
                        <Box>
                            <Heading as="h6" fontSize="1rem" color="#383838" >
                                Group Description
                    </Heading>
                        <Text letterSpacing={"0.02rem"} maxWidth="2xl" fontSize='1rem' >
                            {currentGroup.description}
                        </Text>
                        </Box>
                        <Box width={{base:"90vw",md:"65vw"}}>
                            <Heading as="h6" fontSize="1rem"
                             color="#383838" my="2" >
                                Group Members
                            </Heading>
                            <Stack overflowY="auto"
                                maxHeight={["30vh", "30vh", "75vh", "auto"]}
                                maxWidth={{md:"sm"}} >
                                    {currentGroup && currentGroup.groupMember && currentGroup.groupMember.length > 0 ? 
                                    currentGroup.groupMember?.map((item,idx) => (
                                        <GroupMemberCard key={idx} imgSrc={(item as any).imgSrc || "https://bit.ly/ryan-florence"}
                                         name={(item as any).fullname} position={item.positionName} />
                                    )) : <Text>No Church Member belongs to this group Yet</Text>
                                }
                            </Stack> {
                                currentGroup.name &&
                                <Button my={"5"} color="primary" onClick={handleToggle}
                                width={["100%","75%","50%"]} py={["2","5"]} variant="outline"
                                colorScheme="primary" px={["5","7"]}>
                                    Invite a Member
                                </Button>
                            }
                        </Box>
                    </Stack>
                </Flex>
            </Flex>
        <Dialog open={open} size="lg" close={handleToggle} >
            <AddUserToGroup close={handleToggle} />
        </Dialog>
        </>
    )
}


export default Group