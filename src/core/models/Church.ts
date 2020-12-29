import {IChurchResponse} from "./ChurchResponse"
import {ChurchStatus} from "core/enums/Church"

export interface IChurch extends IChurchResponse {
    // churchStatus:ChurchStatus;
    churchStatus?:string;
    email?:string;
    country?:string
}

export interface IUpdateChurchForm {
    churchName: string;
    churchDenom: string;
    email: string;
    address: string;
    landmark: string;
    state: string;
    country: string;
    phoneNumber: number;
    churchMotto: string;
    priestName: string;
    priestRole: string
    churchID?: number;
    countryID:number;
    stateID:number;
    cityID:number
}


interface ISubscription {
    subscriptionPlanID:number;
    name:string;
    category:string;
    features:string;
    cost:string;
    createdAt:string;
    updatedAt:string;
    createdBy:string;
    updatedBy:string;
    status:number;
    lifetimeDuration:number;
}

interface IPaymentResponse {
    status:string;
    amount:number;
    reference:string;
    message:string;
    publicKey:string;
    customerName:string;
    invoiceCode:string;
}
 