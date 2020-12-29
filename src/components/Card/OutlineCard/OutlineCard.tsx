import React from "react"
import {Stack} from "@chakra-ui/react"
import {primary} from "theme/palette"


interface IProps {
    active:boolean;
    children:React.ReactNode;
    [key:string]:any
}

const OutlineCard:React.FC<IProps> = ({children,active,...props}) => {
    return(
        <Stack direction="row" align="center" py="2" px="3" bgColor={active ? "outlinePrimary" : "transparent"}
         {...props}  borderLeft={active ? `5px solid ${primary}` : ""} >
        {/* <Stack direction="row" align="center" h={["3rem","4rem","4.3rem","2.44rem"]} mx="5" my="3" > */}
            {/* <Divider height="100%" borderRadius=".2em 0 0 .2em"
             width=".3em" bgColor={color}
             orientation="vertical"/> */}
             {children}
        </Stack>
    )
}

export default OutlineCard