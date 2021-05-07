import React from "react"
import {Box,Flex ,FlexProps } from "@chakra-ui/react"
import {BibleImage2x} from "assets/images"


interface IProps extends FlexProps {
    children:any;
}

const MainLoginLayout:React.FC<IProps> = ({children,...props}) => {
    return(
        <Flex height="100vh" width="100vw" {...props} >
            <Box flex={[0,2]} display={["none","block"]}
             backgroundImage={`url(${BibleImage2x})`}
            backgroundRepeat="no-repeat" backgroundPosition="center"
            height="100%" backgroundSize="cover"
            />
            {children}
        </Flex>
    )
}


export default MainLoginLayout