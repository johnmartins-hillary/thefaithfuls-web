import React from "react"
import {Box,Flex} from "@chakra-ui/react"
import {BibleImage2x} from "assets/images"


interface IProps {
    children:any;
}

const MainLoginLayout:React.FC<IProps> = ({children}) => {
    return(
        <Flex height="100vh" width="100vw">
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