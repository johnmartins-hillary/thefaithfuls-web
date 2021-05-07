import React from "react";
import {Image,Flex} from "@chakra-ui/react";
import {useHistory} from 'react-router-dom'
import {Logo as LogoImage,LogoBlack} from "assets/images"



const Logo = ({white = true}) => {
  const history = useHistory()
  return (
      <Flex onClick={() => history.push("/church")} cursor="pointer" align="center" mx="1em" ml="0">
        <Image src={white ? LogoImage : LogoBlack} 
        objectFit="contain"
         color="primary" width={["10rem","7.5rem"]} height={["3rem","2rem"]} />
      </Flex>
    );
};

export default Logo;