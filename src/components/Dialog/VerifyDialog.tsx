import React from "react"
import {Link,useHistory} from "react-router-dom"
import {Link as CustomLink} from "components/Link"
import {useSelector} from "react-redux"
import {AppState} from "store"
import {Flex,ModalHeader,Text,Image,ModalBody,
     ModalCloseButton, ModalContent, ModalFooter } from "@chakra-ui/react"
import {Button} from "components/Button"
import {VerifyImg} from "assets/images"

interface IVerifyDialog {
    handleToggle():void
}


const VerifyDialog:React.FC<IVerifyDialog> = (props) => {
    const history = useHistory()
    const currentUser = useSelector((state:AppState) => state.system.currentUser)
    const handleSubscribe = () => {
        props.handleToggle()
        history.push(`/church/${currentUser.churchId}/subscription`)
    }
    return (
        <ModalContent pb="5">
            <ModalHeader></ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalBody display="flex" flexDirection="column"
                alignItems="center" mt="2">
                <Text color="tertiary" maxWidth="xl" lineHeight="30px" textAlign="center">
                    To enjoy the full functions of this platform,
                    we need to verify that your church address exist,
                    you will be charged a token of ₦2000.
                    But if you subscribe to our pro plan your verification will be free
                </Text>
                <Image my="1" w="17.825rem" h="11rem"
                 objectFit="cover" src={VerifyImg}
                />
            </ModalBody>
            <ModalFooter display="flex" flexDirection="column"
                alignItems="center" >
                <Flex width="98%" flexDirection={["column", "row"]}
                    justifyContent="space-between" mb={3} >
                    <Button onClick={handleSubscribe} mb={["2", "auto"]} 
                     px="18" bgColor="primary" mr={{sm:4}} color="white" >
                        Proceed to subscribe
                    </Button>
                    <Button px="18" colorScheme="primary"
                        variant="outline" color="primary"  >
                        <Link to={`/church/${currentUser.churchId}/verify`} >
                            Proceed to verify
                        </Link>
                    </Button>
                </Flex>
                    <CustomLink to={`/church/${currentUser.churchId}/dashboard`}>
                        Verify Later
                    </CustomLink>
            </ModalFooter>
        </ModalContent>

    )
}

export default VerifyDialog