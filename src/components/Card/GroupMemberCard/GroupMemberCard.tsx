import React from "react"
import {Box,AvatarBadge,Text,Icon,Heading,Flex,Avatar} from "@chakra-ui/react"
import {FaUserAlt} from "react-icons/fa"
import {TiCancel} from "react-icons/ti"
import {BiEdit} from "react-icons/bi"


interface IProps {
    name:string;
    imgSrc:string;
    position:string;
}

const GroupMemberCard:React.FC<IProps> = ({name,imgSrc,position}) => {
    return(
        <Flex px="2" py="4" bgColor="white" align="center" >
            <Avatar size="md" name={name} mr="2" bgColor="blue.100"
                src={imgSrc}>
                <AvatarBadge border="2px solid white"
                 transform="translate(-32%,-4%)"
                    boxSize=".6em" bg="green.300" />
            </Avatar>
            <Flex direction="column" width="75%" >
                <Heading as="h6" fontSize="1.125rem" >{name}</Heading>
                <Flex justify="space-between" opacity={.5}>
                    <Flex>
                        <Icon boxSize="1.3rem" as={FaUserAlt} mr="2" />
                        <Text fontSize=".9rem">{position}</Text>
                    </Flex>
                    <Box>
                        <Icon boxSize="1.3rem" as={BiEdit} mr={2} />
                        <Icon boxSize="1.3rem" as={TiCancel} />
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default GroupMemberCard