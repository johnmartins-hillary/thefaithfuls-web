import React from "react"
import {Link} from "components/Link"
import {
    Modal, ModalOverlay, ModalContent,
    Icon,Flex, ModalHeader,
    ModalFooter, ModalBody,
    Text, Heading,
    ModalCloseButton
} from "@chakra-ui/react";
import {Button} from "components/Button"
import { BsCheckCircle } from "react-icons/bs"


interface IProps {
    open: boolean;
    close: any;
    size?: string | undefined;
    children: React.ReactNode
}
interface IAddUser {
    email:string
}

export const ResetEmail = () => (
    <ModalContent>
        <ModalBody display="flex" flexDirection="column"
            justifyContent="center" alignItems="center">
            <Icon name="check-circle" boxSize="24px" color="primary" />
            <Heading textAlign="center" my="4" color="primary">
                Please check your email
            </Heading>
            <Text textAlign="center">
                An email has been sent to your
                inbox with a link to reset your password
            </Text>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="center" >
            <Link to="/dashboard" >
                Resend Link
            </Link>
        </ModalFooter>
    </ModalContent>
)

export const PaymentAnnouncement = () => {
    return (
        <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalBody>
                <Flex direction="column" align="center" >
                    <Icon color="primary" as={BsCheckCircle}
                        boxSize={["3rem", "4rem", "5.5rem"]} />
                    <Heading fontSize="1.5rem" lineHeight="2rem"
                        textAlign="center" mt="2" >
                        Your payment was successful
                        </Heading>
                    <Text maxWidth="sm" textAlign="center" my="3"
                        fontSize="1.25rem" lineHeight="1.5rem" >
                        Your verification status will be confirmed within the next 14 days
                        </Text>
                </Flex>
            </ModalBody>
            <ModalFooter display="flex" justifyContent="center" width="100%">
                <Button color="white" bgColor="primary" maxWidth="sm" width="100%" >
                    <Link to="/dashboard" >
                        Proceed
                        </Link>
                </Button>
            </ModalFooter>
        </ModalContent>
    )
}


const Dialog: React.FC<IProps> = ({ open, close, size = "sm", children }) => {
    return (
        <Modal size={size} scrollBehavior="inside" isCentered={true}
            isOpen={open} onClose={close}>
            <ModalOverlay>
                {children}
            </ModalOverlay>
        </Modal>
    );
}

export default Dialog