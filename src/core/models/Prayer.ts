
export interface IPrayer {
    prayerID?:number;
    prayerName:string;
    prayerdetail:string;
    denominationID:number;
    denomination?:string
}
interface IUserPrayer {
    fullName:string;
    personPrayedId:string;
    personPrayedPictureUrl:string;
    pictureUrl:string;
    prayedPrayerRequestID:number;
    prayerRequestID:number
}
export interface IPrayerRequest {
    prayerRequestID?:number;
    prayerTile:string;
    prayerDetail:string;
    personId:string;
    churchId:number;
    dateEntered:Date;
    hasPrayed?:boolean;
    prayedPrayerRequests?:IUserPrayer[]
}