import React from "react";
import {Flex,Avatar,Spacer,Heading,IconButton,Icon} from "@chakra-ui/react";
import {GiHamburgerMenu} from "react-icons/gi"
import {CgBell} from 'react-icons/cg'
import {Logo} from "components/Logo"
import {useSelector} from "react-redux"
import {AppState} from "store"

interface IProps {
    handleToggle:any;
}

const DashboardHeader:React.FC<IProps> = ({handleToggle,...props}) => {
  const currentUser = useSelector((state:AppState) => state.system.currentUser)
  const pageTitle = useSelector((state:AppState) => state.system.pageTitle)

  return (
    <Flex position="relative" zIndex={1500}
      as="nav" height="4rem"
      align="center" bgColor="white"
      justify="space-between" py={["1","5"]}
      wrap="nowrap" px={["1","2","8"]}
      shadow="0px 3px 6px #0000001A"
      {...props}
    >
    <Flex align="center" justify="space-around" flex={3}>
        {/* <IconButton aria-label="handle drawer" variant="ghost" onClick={handleToggle}>
            <Icon color="black" w="1.69rem" h="1.13rem" as={GiHamburgerMenu} />
        </IconButton>
        <Logo white={false} />
    </Flex>
    <Flex flex={4} justify="flex-end">
      <Heading color="primary" fontFamily="MulishRegular" fontSize="1.875rem" whiteSpace="nowrap" display={["none","initial"]}>
        {pageTitle}
      </Heading>
    </Flex>
    <Spacer flex={8} />
      <Flex mr={["auto","10"]} align="center" justifyContent="space-around"
       flex={2} >
          <Icon as={CgBell} boxSize="1.82rem" color="black" />
          <Avatar border="2px solid #B603C9"
           size="sm" name="Temitope Emmanuel"
           src={currentUser.picture_url || "https://bit.ly/ryan-florence"} /> */}
      </Flex>
    </Flex>
  );
};

export default DashboardHeader;