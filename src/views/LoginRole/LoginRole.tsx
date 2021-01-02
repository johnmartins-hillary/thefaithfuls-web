import React from "react"
import { Box, Flex, Icon, Heading,Image,Text } from "@chakra-ui/react"
import { SignUpOptions } from "components/SignUpOptions"
import { MinorLoginLayout } from "layouts"
import { Link } from "components/Link"
import { UserAdmin, UserMember } from "assets/images"

const LoginRole = () => {

    return (
        <MinorLoginLayout showLogo={false}>
            <Flex flex={1} overflow="hidden" height="100%" flexDirection="column"
                justifyContent={["center", "", "flex-start"]} p="4"
                alignItems={["center", "", "flex-start"]}>
                <Link to="/" mb="4" display={["block", "none"]}>
                    <Icon name="close" opacity={.6} />
                </Link>
                <Heading my={[20]} mt={{md:"15rem"}} >
                    What role would you like to <Box as="span" color="primary" >sign up</Box> for?
                    </Heading>
                <Flex flexDirection={['column', "row"]} justifyContent={["initial", "initial", "space-between"]}
                    maxWidth="6xl"
                >
                    <Box my={"2"} cursor="pointer" width={["auto", "auto", "50%"]}
                        mx={[0, "3", "5"]} ml={[0, 0, 0]} maxWidth="1xs" >
                        <a href={`${process.env.REACT_APP_MEMBER}/login` || ""}  rel="noopener noreferrer" target="_blank" >
                            <Flex px="8" height="5.625rem"
                                alignItems="center" shadow="0px 5px 10px #410E501A"
                                justifyContent={["center", "flex-start"]}>
                                <Image boxSize="1.875rem" mr="2" fontSize="2em" src={UserAdmin} />
                                <Text fontFamily="MulishBold !important"
                                 whiteSpace="nowrap" textTransform="capitalize"  textStyle="h6">
                                    Sign up as a member
                                    </Text>
                            </Flex>
                            <Text textAlign={["center", "left"]} mt={3} opacity={.8} >
                                You can sign up as a member in to
                                your church. If you can't find your
                                church do communicate with your
                                church admin to sign up
                                </Text>
                        </a>
                    </Box>
                    <SignUpOptions to="/signup/admin" icon={UserMember}
                        title="Sign up as admin"
                        body={`You can sign up as a 
                        church admin to add your church
                        to the Faithful's Database`}
                    />
                </Flex>
            </Flex>
        </MinorLoginLayout>
    )
}


export default LoginRole