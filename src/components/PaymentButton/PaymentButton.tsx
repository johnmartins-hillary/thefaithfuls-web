import React from "react"
import {Button} from "components/Button"
import {usePaystackPayment} from 'react-paystack';
// eslint-disable-next-line
import {FormikProps } from "formik"


interface IPaymentButton {
    form:any;
    onSuccess:any;
    onClose:any;
    onFailure?:any;
    paymentCode:{
        reference:string
        publicKey:string
    };
    amount:number
}

const PaymentButton:React.FC<IPaymentButton> = ({form,onSuccess,onClose,paymentCode,amount,onFailure}) => {
    const config = {
        reference: paymentCode.reference,
        email: form.values.email,
        amount,
        publicKey: paymentCode.publicKey,
        metadata:{
            custom_field:([form.values.name,
                form.values.phoneNumber,form.values.email] as unknown as Record<string, string>[])
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
        <Button disabled={!form.validateForm}
            width={{base:"90vw",md:"35%"}} backgroundColor="primary" my="6" 
            onClick={handleSubmit} maxWidth="sm">
            {form.isValid ? "Proceed To Pay":"Please Correct Form"}
        </Button>                            
    );
};


export default PaymentButton