import React from "react"
import {useHistory} from "react-router-dom"
import {Flex,Icon,Stack,Heading} from "@chakra-ui/react"
// eslint-disable-next-line
import {Verification as VerificationForm } from "components/Forms"
import {createStyles,makeStyles} from "@material-ui/styles"
import {CgCloseO} from "react-icons/cg"


const useStyles = makeStyles((theme) => (createStyles({
    root:{
        paddingTop:"1.3rem",
        flexDirection:"column",
        bgColor:"#F9F5F9",
        alignItems:"flex-start",
        justifyContent:"flex-start",
        "& > *:first-child":{
            alignSelf:"flex-start",
            fontSize:"1.875rem"
        }
    },
    formContainer:{
        minHeight:"80vh",
        flexDirection:"column",
        backgroundColor:"#F3F3F3"
    }
})))


const VerifyChurch = () => {
    const classes = useStyles()
    const history = useHistory()
    const goBack = () => {
        history.goBack()
    }
    
    return (
        <Flex className={classes.root} pl={{md:16}}>
                <Heading fontWeight={400} ml={5} color="primary">
                    Verify Church Location
                </Heading>
                <Flex width={[ "100%","85vw"]} pl={{md:16}}
                 pt={{md:5}} pr={{md:4}}
                 className={classes.formContainer}>
                        <Stack justify="space-between" align="center"
                         direction={["column-reverse","row"]} width="100%" >
                            <Heading alignSelf={"flex-start"} textAlign={["center", "left"]}
                                fontSize="1.5rem" >
                                Please confirm the information you provided
                            </Heading>
                                <Icon as={CgCloseO} color="#383838"
                                onClick={goBack}
                                opacity={.5} boxSize="2rem"  />  
                        </Stack>
                    <Flex flexDirection="column" width={[ "100%","60vw"]}
                        maxWidth="52.38rem" align={"center"} >
                        <VerificationForm showText={true} align="flex-start" />
                    </Flex>
                </Flex>
            </Flex>
    )
}

export default VerifyChurch