import React from "react"
import {Button} from "components/Button"
import {usePaystackPayment} from 'react-paystack';
// eslint-disable-next-line
import {FormikProps } from "formik"


interface IPaymentButton {
    form:any;
    onSuccess:any;
    onClose:any;
    onFailure?:any
}

const PaymentButton:React.FC<IPaymentButton> = ({form,onSuccess,onClose,onFailure}) => {
    const config = {
        reference: (new Date()).getTime().toString(),
        email: form.values.email,
        amount: 200_000,
        publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
        metadata:{
            custom_field:([form.values.name,
                form.values.phoneNumber,form.values.email] as unknown as Record<string, string>[])
        }
    };
    
    const initializePayment = usePaystackPayment(config);
    
    const handleSubmit = (handleSubmit:any) => () => {
        initializePayment(handleSubmit, onPaymentClose)
    }
    const onPaymentClose = () => {
        onClose()
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')
    } 
    return (
        <Button disabled={!form.validateForm}
            width={{base:"90vw",md:"35%"}} backgroundColor="primary" my="6" 
            onClick={handleSubmit(form.handleSubmit)} maxWidth="sm">
            {form.isValid ? "Proceed To Pay":"Please Correct Form"}
        </Button>                            
    );
};


export default PaymentButton