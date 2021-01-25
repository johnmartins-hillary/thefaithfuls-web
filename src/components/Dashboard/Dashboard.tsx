import React from "react"
import {Drawer,DrawerBody,DrawerHeader,Flex,Text,Icon,
        Avatar,Heading,DrawerContent,Stack} from "@chakra-ui/react"
import {useLocation,Link} from "react-router-dom"
import useParams from "utils/params"
import {IoMdWallet} from "react-icons/io"
import {MdDashboard,MdCastConnected,MdPermMedia,MdAnnouncement} from "react-icons/md"
import {BsCalendar,BsFillCollectionPlayFill} from "react-icons/bs"
import {RiGroupFill} from "react-icons/ri"
import {AiFillFile} from "react-icons/ai"
import {FaUserAlt,FaPrayingHands,FaCalendarCheck} from "react-icons/fa"
import {makeStyles,createStyles} from "@material-ui/styles"
import {AppState} from "store"
import {useSelector} from "react-redux"


const useStyles = makeStyles(() => (
    createStyles({
        root:{
        },
        headerContainer:{
            flexDirection:"column",
            alignItems:"center",
            display:"flex",
            justifyContent:"center",
            "& h2":{
                textAlign:"center !important",
            }
        },
        optionContainer:{
            "& > *":{
                cursor:"pointer",
                alignItems:"center"
            }
        },
        link:{
            color:"#383838",
            opacity:.7
        },
        activeLink:{
            color:"#B603C9",
            opacity:"1 !important"
        }
    })
))

interface IProps {
    open:boolean;
    handleToggle:any
}

const dashboardMenu = [
    {icon:MdDashboard,name:"Dashboard",link:"/dashboard"},
    {icon:BsCalendar,name:"Church Activities",link:"/activity"},
    {icon:RiGroupFill,name:"Groups",link:"/groups"},
    {icon:MdPermMedia,name:"Media/Content",link:"/media"},
    {icon:MdCastConnected,name:"Post Ads",link:"/ads"},
    {icon:BsFillCollectionPlayFill,name:"Subscription",link:"/subscription"},
    {icon:IoMdWallet,name:"Church Finance",link:"/finance"},
    {icon:AiFillFile,name:"Reports",link:"/report"},
    {icon:FaUserAlt,name:"User Manager",link:"/manager"},
    {icon:MdAnnouncement,name:"Announcement",link:"/announcement"},
    {icon:FaPrayingHands,name:"Prayer/Verses",link:"/prayer"},
    {icon:FaCalendarCheck,name:"Booking/Request",link:"/booking"}
]




const Dashboard:React.FC<IProps> = ({open,handleToggle}) => {
    const params = useParams()
    const location = useLocation()
    const activeLink = location.pathname
    const btnRef = React.useRef() as React.MutableRefObject<HTMLButtonElement>
    const classes = useStyles()
    const currentChurch = useSelector((state:AppState) => state.system.currentChurch)

return (
    <Drawer
        isOpen={open}
        placement="left"
        onClose={handleToggle}
        finalFocusRef={btnRef}
    >
        <DrawerContent pt={16} maxWidth="2xs" zIndex={500} >
            <DrawerHeader className={classes.headerContainer}
            >
                <Avatar border="2px solid #B603C9"
                    size="xl" name={currentChurch.name}
                    src={currentChurch.churchLogo || "https://bit.ly/ryan-florence"} />
                {/* <Heading as="h2" color="primary" fontSize="1.7rem" fontWeight="400" >
                    {currentChurch.name}
                </Heading> */}
            </DrawerHeader>
            {/* <Divider orientation="horizontal" bgColor="grey.500" /> */}
            <DrawerBody pt="12" pl="10" >
                <Stack className={classes.optionContainer} spacing={8}>
                    {dashboardMenu.map((item,idx) => (
                        <Link key={idx} to={`/church/${params.churchId}${item.link}`} >
                            <Flex align="center"
                            className={activeLink.includes(item.link) ? classes.activeLink : classes.link} >
                                <Icon boxSize="1rem" as={item.icon}/>
                                <Text ml="4" fontSize="1.13rem" >{item.name}</Text>
                            </Flex>
                        </Link>
                    ))}
                </Stack>
            </DrawerBody>
        </DrawerContent>
    </Drawer>
)
}

export default Dashboard