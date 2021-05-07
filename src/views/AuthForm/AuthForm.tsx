import React from "react"
import { useLocation } from "react-router-dom"
import {Text, Flex} from "@chakra-ui/react"
import { MinorLoginLayout } from "layouts"
import {Link} from "components/Link"
import {Login,ResetPassword} from "components/Forms"


const AuthForm = () => {
    const location = useLocation()
    // const location = location.pathname
    const isLogin = location.pathname === "/login"
    return (
        <MinorLoginLayout showLogo={true}>
            <Flex flexDirection="column" justifyContent="center" alignItems={{base:"center",md:"initial"}} px={{ sm: "3" }} pl={{sm:0}} flex={[1, 3]} >
                {isLogin ? 
                <Login/>:<ResetPassword/>
                }
                {
                    isLogin ?
                        <Text>Don't have an account? &nbsp;
                            <Link to="/signup/role" makePurple={true} >
                                Sign Up here
                            </Link>
                        </Text>
                        :
                        <Text textStyle="h6" >Already have an account? &nbsp;
                    <Link to="/login">
                        Login here
                    </Link>
                        </Text>
                }
            </Flex>
        </MinorLoginLayout>
    )
}

export default AuthForm