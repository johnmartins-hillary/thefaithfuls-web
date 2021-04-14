import React from "react"
import {usePaystackPayment} from 'react-paystack';
// eslint-disable-next-line
import {Flex, FlexProps} from "@chakra-ui/react"
import {useSelector} from "react-redux"
import {AppState} from "store"


interface IPaymentButton extends FlexProps {
    onSuccess:any;
    onClose:any;
    onFailure?:any;
    paymentCode:{
        reference:string;
        publicKey:string;
        amount?:string
    };
    amount:number
}

const PaymentButton:React.FC<IPaymentButton> = ({onSuccess,onClose,paymentCode,amount,onFailure,children,...props}) => {
    const currentUser = useSelector((state:AppState) => state.system.currentUser)
    const config = {
        reference: paymentCode.reference,
        email: currentUser.email,
        amount,
        publicKey: paymentCode.publicKey,
        metadata:{
            custom_field:([currentUser.fullname,
                currentUser.phoneNumber,currentUser.email] as any)
        }
    };
    const initializePayment = usePaystackPayment(config);
    
    const handleSubmit = () => {
        console.log("initialiing payment")
        initializePayment(onSuccess, onClose)
    }
    // const onPaymentClose = () => {
    //     onClose()
    //     // implementation for  whatever you want to do when the Paystack dialog closed.
    // } 

    return (
        <Flex onClick={currentUser.id ? handleSubmit : undefined} {...props} >
            {children}
        </Flex>    
    );
};


export default PaymentButton