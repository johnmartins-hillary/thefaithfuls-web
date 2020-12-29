import {Donation} from "core/enums/Donation"
import {IChurchResponse} from "./ChurchResponse"

export interface IDonation {
    donationID?:number;
    donationName:string;
    donationDescription:string;
    churchID:number;
    societyId:number;
    donationType:Donation;
    expirationDate:Date;
    church?:IChurchResponse;
}