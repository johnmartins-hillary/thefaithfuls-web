import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link, useLocation } from "react-router-dom"
import {
  Stack, Icon, Heading, Text, Flex, Avatar,
  Spacer, Menu, MenuButton, MenuItem, MenuList, DrawerHeader
} from "@chakra-ui/react"
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import { CgBell, CgProfile } from 'react-icons/cg'
import { Logo } from "components/Logo"
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from "react-redux"
import { FiLogOut } from "react-icons/fi"
import { GiHamburgerMenu } from "react-icons/gi"
import { getChurch, logout } from "store/System/actions"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { AppState } from 'store';
import { IoMdWallet } from "react-icons/io"
import { MdDashboard, MdCastConnected, MdPermMedia, MdAnnouncement } from "react-icons/md"
import { BsCalendar, BsFillCollectionPlayFill } from "react-icons/bs"
import { RiGroupFill } from "react-icons/ri"
import { AiFillFile } from "react-icons/ai"
import { FaUserAlt, FaPrayingHands, FaCalendarCheck } from "react-icons/fa"



const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      // "& h2":{
      //   textAlign:"center"
      // }
    },
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      backgroundColor: "white",
      zIndex: theme.zIndex.drawer + 1,
    },
    optionContainer: {
      margin: ".5rem",
      "& a": {
        textDecoration: "none",
        "& > div": {
          transition: ".3s all linear"
        }
      },
      "& p": {
        margin: ".5rem 0",
        fontFamily:"MulishRegular"
      },
      "& svg": {
        marginRight: ".5rem"
      },
      "& > *": {
        cursor: "pointer",
        alignItems: "center"
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'none'
      }
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      display: "flex",
      justifyContent: "flex-start",
      paddingTop: "5rem",
      alignItems: "center"
    },
    content: {
      flexGrow: 1,
      backgroundColor: "#F9F5F9"
    },
    link: {
      color: "#383838",
      opacity: .8
    },
    activeLink: {
      color: "#B603C9",
      transform: "scale(1.1)",
      marginLeft: ".7rem",
      opacity: "1 !important"
    }
  }),
);

interface IProps {
  children: any
}



export const dashboardMenu = [
  { icon: MdDashboard, name: "Dashboard", link: "/dashboard" },
  { icon: BsCalendar, name: "Church Activities", link: "/activity" },
  { icon: RiGroupFill, name: "Groups", link: "/groups" },
  { icon: MdPermMedia, name: "Media/Content", link: "/media" },
  { icon: MdCastConnected, name: "Post Ads", link: "/ads" },
  { icon: BsFillCollectionPlayFill, name: "Subscription", link: "/subscription" },
  { icon: IoMdWallet, name: "Church Finance", link: "/finance" },
  { icon: AiFillFile, name: "Reports", link: "/report" },
  { icon: FaUserAlt, name: "User Manager", link: "/manager" },
  { icon: MdAnnouncement, name: "Announcement", link: "/announcement" },
  { icon: FaPrayingHands, name: "Prayer/Verses", link: "/prayer" },
  { icon: FaCalendarCheck, name: "Booking/Request", link: "/booking" }
]



const DashboardLayout: React.FC<IProps> = (props) => {
  const location = useLocation()
  const activeLink = location.pathname
  const dispatch = useDispatch()
  const params = useParams()
  const toast = useToast()
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const currentChurch = useSelector((state: AppState) => state.system.currentChurch)
  const currentUser = useSelector((state: AppState) => state.system.currentUser)
  const pageTitle = useSelector((state: AppState) => state.system.pageTitle)


  const atProfile = location.pathname.includes("/profile")
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  // const handleDesktopToggle = () => {
  //   setDesktopOpen(!desktopOpen)
  // };

  React.useEffect(() => {
    dispatch(getChurch(toast))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const drawer = (
    <>
      <div className={classes.toolbar} />
      <Stack className={classes.optionContainer} spacing={4}>
        {dashboardMenu.map((item, idx) => (
          // <Link key={idx} to={`/church/${params.churchId}${item.link}`} >
          //   <Flex align="center"
          //     className={activeLink.includes(item.link) ? classes.activeLink : classes.link} >
          //     <Icon boxSize="1rem" as={item.icon} />
          //     <Text ml="4" fontSize="1rem" >{item.name}</Text>
          //   </Flex>
          // </Link>
          <Link key={idx} to={`/church/${params.churchId}${item.link}`} >
            <Flex align="center"
              className={activeLink.includes(item.link) ? classes.activeLink : classes.link} >
              <Icon boxSize="1rem" as={item.icon} />
              <Text ml="4" fontSize="1.13rem" >{item.name}</Text>
            </Flex>
          </Link>
        ))}
      </Stack>
    </>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <Icon color="black" w="1.69rem" h="1.13rem" as={GiHamburgerMenu} />
          </IconButton>
          <Flex align="center" justify="space-around" flex={3}>
            <Logo white={false} />
          </Flex>
          <Flex flex={4} justify="flex-end">
            <Heading color="primary" fontFamily="MulishRegular" fontSize="1.875rem" whiteSpace="nowrap" display={["none", "initial"]}>
              {pageTitle}
            </Heading>
          </Flex>
          <Spacer flex={8} />
          <Flex mr={["auto", "10"]} align="center" justifyContent="space-around"
            flex={2} >
            <Icon as={CgBell} boxSize="1.82rem" color="black" />
            <Menu>
              <MenuButton>
                <Avatar border="2px solid #B603C9"
                  size="sm" name={currentUser.fullname}
                  src={currentUser.picture_url} />
              </MenuButton>
              <MenuList>
                {
                  !atProfile &&
                  <MenuItem as={Link} to={`/church/${params.churchId}/profile`} color="rgba(0,0,0,.6)">
                    <Icon as={CgProfile} />
                    Profile
                  </MenuItem>
                }
                <MenuItem color="rgba(0,0,0,.6)" onClick={logout}>
                  <Icon as={FiLogOut} />
                    Logout
                  </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <Flex flexDirection="column" alignItems="center"
              display="flex" justifyContent="center"
            >
              <Avatar border="2px solid #B603C9"
                size="2xl" name={currentChurch.name}
                src={currentChurch.churchLogo || "https://bit.ly/ryan-florence"} />
              <Heading as="h2" color="primary" fontSize="1.7rem" fontWeight="400" >
                {currentChurch.name}
              </Heading>
            </Flex>

            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <Flex flexDirection="column" alignItems="center"
              display="flex" justifyContent="center"
            >
              <Avatar border="2px solid #B603C9"
                size="xl" name={currentChurch.name}
                src={currentChurch.churchLogo || "https://bit.ly/ryan-florence"} />
              <Heading as="h2" color="primary" textAlign="center" fontSize="1.7rem" fontWeight="400" >
                {currentChurch.name}
              </Heading>
            </Flex>

            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
}

export default DashboardLayout