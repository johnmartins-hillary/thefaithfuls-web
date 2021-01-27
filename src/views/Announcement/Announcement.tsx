import React from "react"
import { Link } from "react-router-dom"
import {
    HStack,Text,Heading,Wrap,
    VStack,IconButton, WrapItem
} from "@chakra-ui/react"
import {DashboardActivity} from "components/Card/ActivityCard/ActivityCard"
import * as announcementService from "core/services/announcement.service"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import {IAnnouncement} from "core/models/Announcement"
import {MessageType} from "core/enums/MessageType"
import {RiDeleteBinLine} from "react-icons/ri"
import {Button} from "components/Button"
import {BiEdit} from "react-icons/bi"
import useParams from "utils/params"
import useToast from "utils/Toast"
import {useDispatch} from "react-redux"
import {setPageTitle} from "store/System/actions"
import axios from "axios"
import {NoContent} from "components/NoContent"

const useStyles = makeStyles(theme => createStyles({
    root:{
        "& button":{
            fontFamily:"MulishRegular"
        },
        "& h2":{
            fontSize:"1.5rem"
        },
        "& a":{
            alignSelf:"flex-start"
        },
        "& ul":{
            [theme.breakpoints.up("sm")]:{
                justifyContent:"flex-start"
            }
        },
        "& li":{
            width:"80%",
            "& > div":{
                width:"100%"
            },
            [theme.breakpoints.up("sm")]:{
                width:"initial"
            }
        }
    }
}))

const cardStyles = makeStyles(theme => createStyles({
    cardRoot:{
        paddingBottom:"0 !important"
    },
    headingContainer:{
        justify:"space-between",
        width:"100%",
        alignItems:"flex-start !important",
        "& > *:first-child":{
            fontWeight:400
        },
        "& > *:last-child":{
            fontWeight:400
        }
    },
    textContainer:{
        textAlign:"left",
        fontSize:"1.125rem",
        opacity:.5,
        // maxHeight:"10rem",
        // overflowY:"auto",
        fontFamily:"MontserratRegular"
    }
}))

interface IAnnouncementCard {
    heading:string;
    subheading:string;
    text:string;
    handleDelete():void;
    handleEdit():void;
}

const AnnouncementCard:React.FC<IAnnouncementCard> = ({heading,handleEdit,handleDelete,subheading,text}) => {
    const classes = cardStyles()
    return(
        <DashboardActivity px={6} pb="5" maxWidth="30rem">
            <HStack width="100%" align="flex-start" height="100%" >
                <VStack className={classes.headingContainer}>
                    <Heading textStyle="h5" >
                        {heading}
                    </Heading>
                    <Text color="tertiary" fontFamily="MontserratBold" textAlign="left" as="i" opacity={.5}
                        fontSize="1.125rem" >
                        {subheading}
                    </Text>
                </VStack>
                <HStack color="tertiary">
                    <IconButton aria-label="edit" onClick={(handleEdit as any)} icon={<BiEdit/>} />
                    <IconButton aria-label="delete" onClick={(handleDelete as any)} icon={<RiDeleteBinLine/>} />                      
                </HStack>
            </HStack>
            <Text color="tertiary" className={classes.textContainer} >
                {text}
            </Text>
        </DashboardActivity>
    )
}


const Announcement = () => {
    const classes = useStyles()
    const [announcement,setAnnouncement] = React.useState<IAnnouncement[]>([])
    const params = useParams()
    const dispatch = useDispatch()
    const toast = useToast()

    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        dispatch(setPageTitle("Announcement"))
        const apiAnnouncementCall = async () => {
            await announcementService.getAnnouncementByChurch(params.churchId,cancelToken).then(payload => {
                setAnnouncement(payload.data)
            }).catch(err => {
                if(!axios.isCancel(err)){
                    toast({
                        title: "Unable to load Announcement",
                        subtitle:`Error: ${err}`,
                        messageType:MessageType.ERROR
                    })
                }
            })
        }
        apiAnnouncementCall()
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleDelete = (announcementId:string,idx:number) => () => {
        announcementService.deleteAnnouncement(announcementId).then(payload => {
            const newAnnouncement = [...announcement]
            newAnnouncement.splice(idx,1)
            setAnnouncement(newAnnouncement)
            toast({
                title:`Announcement ${announcement![idx].title} as been deleted`,
                subtitle:"",
                messageType:MessageType.SUCCESS
            })
        }).catch(err => {
            toast({
                title:`Unable to Delete Announcement ${announcement![idx].title}`,
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        })
    }
    
    const handleEdit = (announcement:IAnnouncement) => () => {
        announcementService.editAnnouncement(announcement).then(payload => {
            toast({
                title:"Successful Update",
                subtitle:`Announcement ${announcement.title} as bees successfully updated`,
                messageType:MessageType.SUCCESS
            })
        }).catch(err => {
            toast({
                title:"Unable to update Announcement",
                subtitle:`Error:${err}`,
                messageType:MessageType.ERROR
            })
        })
    }

    return (
        <VStack spacing={14} p={{ base: "4", md: "0" }} bgColor="bgColor"
                justify="flex-start" className={classes.root}
                pl={{ md: "12" }} width={["100%", "100%", "93%"]} pt={{ md: "12" }}>
                        <Link to={`/church/${params.churchId}/announcement/create`} >
                            <Button>
                                Create Announcement
                            </Button>
                        </Link>
                    <Wrap w="100%">
                         { announcement && announcement.length > 0 ? 
                            announcement?.map((item,idx:number) => (
                                <WrapItem  key={item.announcementID || idx}>
                                <AnnouncementCard subheading={`to all:${item.category}`}
                                    heading={item.title} 
                        handleDelete={handleDelete((item.announcementID as string),idx)}
                                    text={item.description} handleEdit={handleEdit(item)}
                                />
                                </WrapItem>
                            )) :
                            <NoContent>
                                <Text>No Available Announcement Yet</Text>
                            </NoContent> 
                        }
                    </Wrap>
            </VStack>
    )
}


export default Announcement