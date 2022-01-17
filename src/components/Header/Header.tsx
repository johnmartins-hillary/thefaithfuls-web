import React from "react";
import {Link, LinkProps, useHistory} from "react-router-dom"
import {createStyles,makeStyles} from "@material-ui/styles"
import {
  Box,Flex,Menu,MenuButton,
  MenuList,MenuItem,Text, chakra, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import {Logo} from "components/Logo"
import {Button} from "components/Button"
import {useSelector} from 'react-redux'
import {AppState} from "store"
import useToast, { ToastFunc } from "utils/Toast"
import { NormalSelect } from "components/Input";
import { MessageType } from "core/enums/MessageType";
import { IDenomination } from "core/models/Denomination";
import { ICountry, ICity,IState as IStateResponse } from "core/models/Location";
import * as utilityService from "core/services/utility.service"
import * as churchService from "core/services/church.service"
import {Dialog} from "components/Dialog"

const useStyles = makeStyles((theme:any) => (
  createStyles({
    root:{
      fontFamily:"MulishRegular",
      position:"absolute",
      top:0,
      width:"100%",
      fontWeight:"normal",
      fontStyle: "normal",
      zIndex:3,
      alignItems:"center",
      justifyContent:"space-between",
      flexWrap:"nowrap",
      padding:"1.5rem",
      "& p,a":{
        textAlign:"center",
        // color:"white",
        fontSize:"1rem",
        letterSpacing:"0px",
        fontWeight:"normal"
      }
    },
    linkContainer:{
    
    }
  })
))
  

interface IMenuItem extends LinkProps {
    children:React.ReactNode
}

const ChakraLink = chakra(Link)

const MenuItems:React.FC<IMenuItem> = ({ children,...props }) => (
  <ChakraLink mt={{ base: 4, md: 0 }} mr={6} display="block" {...props}>
    {children}
  </ChakraLink>
);

interface IProps {
  [key:string]:string
}


interface IPropsModal {
  handleClose:() => void
}

interface IState {
  country: ICountry[]
  state: IStateResponse[]
  city: ICity[]
}



const SearchChurch:React.FC<IPropsModal> = ({handleClose}) => {
  const toast = useToast()
  const [denomination, setDenomination] = React.useState<IDenomination[]>([])
  const [location, setLocation] = React.useState<IState>({
      country: [],
      city: [],
      state: []
  })

  console.log({denomination})
  
  

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

  return(
      <ModalContent>
          <ModalBody display="flex" flexDirection="column"
              justifyContent="center" alignItems="center">
                  <NormalSelect name="Select Country" >

                  </NormalSelect>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center" >
              <Button onClick={handleClose}>
                  Cancel
              </Button>
          </ModalFooter>
      </ModalContent>
  )
}


const Header:React.FC<IProps> = props => {
  const classes = useStyles()
  const [open,setOpen] = React.useState(false)
  const isAuthenticated = useSelector((state:AppState) => state.system.isAuthenticated)
  const currentUser = useSelector((state:AppState) => state.system.currentUser)

  const handleToggle = () => {
    setOpen(!open)
  }

  return (
    <>
    <Dialog open={open} close={handleToggle} >
      <SearchChurch handleClose={handleToggle} />
    </Dialog>
    <Flex className={classes.root}
      as="nav"
      {...props}
      p={{base:"3",md:"10"}}
    >
      <Flex display={{base:"none",md:"inline-block"}} flex={1} justifyContent="space-between"/>
      <Logo/>
      <Menu>
       <Box display={{md: "none", sm:"flex" }}>
        <MenuButton
          px={4}
          py={2}
          transition="all 0.2s"
          rounded="md"
          borderWidth="1px"
        >
          <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
        </MenuButton>
       </Box>
        <MenuList display="flex" flexDirection="column">
          <MenuItem as={Link} to="/signup/admin" color="primary">Find Your Church</MenuItem>
          <MenuItem color="primary">About us</MenuItem>
          <MenuItem color="primary">Contact us</MenuItem>
          {
            isAuthenticated ? 
            <MenuItem color="primary">
            <Link to={`/church/${currentUser.churchId}/dashboard`}>
              church
            </Link>
          </MenuItem>
          :
          <MenuItem color="primary">
            <Link to="/login">
              Login
            </Link>
          </MenuItem>
          
          }
          <Link to="/signup/role">
            <MenuItem color="primary">
                Sign Up
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
      <Flex flex={2}  display={{base:"none",md:"inline-block"}} />
      <Box
        display={["none","","flex" ]}
        width={["full","","auto" ]}
        alignItems="center" flexDirection="row"
        justifyContent="flex-end"
        flexGrow={1} className={classes.linkContainer}
      >
        <Text mt={{ base: 4, md: 0 }} mr={6} cursor="pointer"
         display="block" onClick={handleToggle}>
           Find your church
        </Text>
        <MenuItems to="/#section">About us</MenuItems>
        <MenuItems to="/#section">Contact us</MenuItems>
      </Box>
      <Flex flex={2} display={{base:"none",md:"inline-block"}} />
      <Flex
        alignItems="center"
        flexDirection="row" mr="2.5rem"
        display={["none","","flex" ]}
        mt={{ base: 4, md: 0 }}
      >
        <MenuItems to="/login">
            Login
        </MenuItems>
        <Button px="9" height="2em">
          <Link to="/signup/role" >
            Sign Up
          </Link>
        </Button>
      </Flex>
    </Flex>
  
    </>
  );
};

export default Header;