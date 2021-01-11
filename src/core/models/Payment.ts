import {Payment as PaymentEnum,Purpose} from "core/enums/Payment"


export interface Payment {
    paymentGatewayType:PaymentEnum;
    amount:number;
    organizationType:"church" | "charity";
    organizationId:number;
    purpose:Purpose;
    societyId?:string
}

export interface PaymentResponse {
    state:null | any;
    amount:number;
    reference:string;
    message:null | any;
    publicKey:string;
    customerName:null  | any;
    invoiceCode:null | any;
}