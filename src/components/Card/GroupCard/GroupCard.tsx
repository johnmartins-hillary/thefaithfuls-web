import React from "react"
import {Box,Flex,Heading,AvatarBadge,
    Text,Icon,Avatar} from "@chakra-ui/react"
import {RiGroupFill} from "react-icons/ri"


interface IProps {
    name:string;
    active:boolean;
    member:number;
    imgSrc:string;
    [key:string]:any;
}

const GroupCard:React.FC<IProps> = ({name,active,imgSrc,member,...props}) => {

    return(
        <Flex shadow="0px 5px 10px #00000005" alignItems="center"
         borderRadius="4px" py="5" bgColor="white" px="3" {...props} >
            <Avatar size="md" name={name} mr="2" bgColor="blue.100"
                src={imgSrc}>
                <AvatarBadge border="2px solid white"
                 transform="translate(-32%,-4%)"
                    boxSize=".6em" bg="green.300" />
            </Avatar>
            <Box>
                <Heading as="h4" fontFamily="Bahnschrift" color="secondary" fontSize="1.5rem" >
                    {name}
                </Heading>
                <Text fontSize=".9rem" fontFamily="MontserratRegular !important" color="#383838">
                    {active ? "Active" : "Inactive"}
                </Text>
                <Box opacity={.7} color="#383838">
                    <Icon as={RiGroupFill} color="#383838" />
                    <Box fontWeight={300} color="#383838" fontFamily="MontserratRegular !important" as="span">
                        {member} members
                    </Box>
                </Box>
            </Box>
        </Flex>
    )
}

export default GroupCard