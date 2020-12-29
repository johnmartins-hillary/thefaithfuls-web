import {Payment as PaymentEnum} from "core/enums/Payment"

export interface Payment {
    paymentGatewayType:PaymentEnum;
    amount:number;
    organizationType:"church" | "charity";
    organizationId:number;
    purpose:string;
    societyId:string
}