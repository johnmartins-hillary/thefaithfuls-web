import React from "react"
import {Stack,Divider ,Text } from "@chakra-ui/react"


interface IProps {
    color:string;
    heading:string;
}


const DashboardCard:React.FC<IProps> = ({color,heading,...props}) => {

    return(
        <Stack direction="row" align="center"
         minHeight={["3rem","4.3rem","2.44rem"]} my="2" >
            <Divider height="100%" borderRadius=".2em 0 0 .2em"
             width=".3em" bgColor={color}
             orientation="vertical"/>
             <Stack>
                <Text color="#151C4D" fontWeight={600} fontSize="1.15rem">
                    {heading}
                </Text>
                {props.children}
             </Stack>
        </Stack>
    )
}

export default DashboardCard