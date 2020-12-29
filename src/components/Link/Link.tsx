import React from "react"
import {Link as RouterLink } from "react-router-dom"
import {Link as ChakraLink,LinkProps} from "@chakra-ui/react"


interface ILink extends LinkProps {
    to:string;
    makePurple?:boolean;
    color?:string;
    children:React.ReactNode;
    [key:string]:any
}

const Link:React.FC<ILink> = ({to,color,makePurple,children,...props}) => {
    return(
        <ChakraLink as={RouterLink} textDecoration="underline" to={to }
            color={color || "primary"} {...props}>
            {children}
        </ChakraLink>
    )
}


export default Link