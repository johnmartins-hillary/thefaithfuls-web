import React from "react"
import {Button as ChakraButton,ButtonProps} from "@chakra-ui/react"


const Button:React.FC<ButtonProps> = (props) => {
    return(
        <ChakraButton fontFamily="Mulish" bgColor={ props.bgColor || !(props.variant) ? "primary" : ""}
         fontWeight={300} fontSize="1.17rem" color={(props.variant) ? "primary" : "white"}
         colorScheme={(props.bgColor as string) || "primary"} {...props} >
            {props.children}
        </ChakraButton>
    )
}

export default Button