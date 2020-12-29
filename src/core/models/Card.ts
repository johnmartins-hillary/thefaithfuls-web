import {Payment} from "core/enums/Payment"

export interface ISavedCardDetail {
        userId:string;
        lastFourDigits:string;
        brand:string;
        expiryMonth:string;
        expiryYear:string;
        emailUsedInInitialChargeLeg:string;
        cardType:string;
        cardBIN:string;
        paymentGatewayEnum:string;
        Enum:Payment;
        active:boolean;
}