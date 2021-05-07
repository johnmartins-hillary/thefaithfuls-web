import {usePaystackPayment} from "react-paystack"

const public_key = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY

const PaymentHook = (form:any) => {
    const config= {
        reference: (new Date()).getTime().toString(),
        email: form.email,
        amount: 200_000,
        publicKey: public_key,
        metadata:{
            custom_field:([form.name,
                form.phoneNumber,form.email] as unknown as Record<string, string>[])
        }
    };
    return usePaystackPayment(config as any);
}

export default PaymentHook