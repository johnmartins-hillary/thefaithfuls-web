import React from "react"
import {useHistory} from "react-router-dom"
import {Flex,Heading} from "@chakra-ui/react"
// eslint-disable-next-line
import {Verification as VerificationForm } from "components/Forms"
import {createStyles,makeStyles} from "@material-ui/styles"
import {PaymentAnnouncement} from "components/Dialog/Dialog"
import {Dialog} from "components/Dialog"



const useStyles = makeStyles((theme) => (createStyles({
    root:{
        flexDirection:"column",
        backgroundColor:"#F9F5F9",
        alignItems:"center",
        height:"100vh",
        justifyContent:"center",
        "& > *:first-child":{
            textAlign:"center",
            fontSize:"1.875rem"
        }
    },
    formContainer:{
        maxWidth:"78rem",
        flexDirection:"column",
        alignItems:"center",
        backgroundColor:"#F3F3F3",
        maxHeight:"51.25rem"
    },
    inputContainer:{
        "& > *:nth-child":{
            marginRight:"auto",
            marginLeft:"auto"
        },
        "& > button":{
            color:"white",
            marginRight:"50%",
            transform:"translateX(50%)"
        }
    }
})))


const Verification = () => {
    const classes = useStyles()
    const history = useHistory()
    return (
        <Flex className={classes.root} >
            <Heading fontWeight={400}
             my={{base:"4",sm:"2.5rem"}} color="primary">
                Verify Church Location
            </Heading>
            <Flex width={[ "100%","75vw"]} className={classes.formContainer} py="5">
                <Flex flexDirection="column" width={[ "100%","60vw"]}
                 justifyContent="center"
                    alignItems="center" maxWidth="52.38rem" >
                    <Heading alignSelf={"flex-start"} mt={{md:"2.5rem"}} textAlign={["center", "left"]} fontSize="1.5rem" >
                        Please confirm the information you provided
                    </Heading>
                    <VerificationForm handleClose={() => history.push("/dashboard")} handleSuccess={() => history.push("/dashboard")} />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Verification