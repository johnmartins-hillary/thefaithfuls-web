import React from "react"
import {Box} from "@chakra-ui/react"
import "./Wrapper.css"



const Wrapper = ({children,...props}:any) => (
    <Box {...props} className="wrapper">
        {children}
    </Box>
)


export default Wrapper