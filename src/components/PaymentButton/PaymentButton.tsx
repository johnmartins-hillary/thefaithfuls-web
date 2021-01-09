import React from "react"
import {usePaystackPayment} from 'react-paystack';
// eslint-disable-next-line
import {Flex} from "@chakra-ui/react"
import {useSelector} from "react-redux"
import {AppState} from "store"


interface IPaymentButton {
    onSuccess:any;
    onClose:any;
    onFailure?:any;
    paymentCode:{
        reference:string;
        publicKey:string;
    };
    amount:number
}

const PaymentButton:React.FC<IPaymentButton> = ({onSuccess,onClose,paymentCode,amount,onFailure,children}) => {
    const currentUser = useSelector((state:AppState) => state.system.currentUser)
    const config = {
        reference: paymentCode.reference,
        email: currentUser.email,
        amount,
        publicKey: paymentCode.publicKey,
        metadata:{
            custom_field:([currentUser.fullname,
                currentUser.phoneNumber,currentUser.email] as unknown as Record<string, string>[])
        }
    };
    
    const initializePayment = usePaystackPayment(config);
    
    const handleSubmit = () => {
        initializePayment(onSuccess, onClose)
    }
    // const onPaymentClose = () => {
    //     onClose()
    //     // implementation for  whatever you want to do when the Paystack dialog closed.
    // } 
    return (
        <Flex onClick={handleSubmit}>
            {children}
        </Flex>    
    );
};


export default PaymentButton