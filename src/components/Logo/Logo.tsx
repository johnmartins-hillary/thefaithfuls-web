import React from "react";
import {Image,Flex} from "@chakra-ui/react";
import {useHistory} from 'react-router-dom'
import {Logo as LogoImage,LogoBlack} from "assets/images"



const Logo = ({white = true}) => {
  const history = useHistory()
  return (
      <Flex onClick={() => history.push("/")} cursor="pointer" align="center" mx="1em" ml="0">
        <Image src={white ? LogoImage : LogoBlack}
         color="primary" width={["15rem","10.5rem"]} height={["5rem","3rem"]} />
        {/* <Heading fontFamily="ProductSans" as="h3"
         size="xs">
           <Stack color="black" ml="2" spacing="1">
             <Text  >THE</Text>
             <Text>FAITHFULS</Text>
           </Stack>
        </Heading> */}
      </Flex>
    );
};

export default Logo;