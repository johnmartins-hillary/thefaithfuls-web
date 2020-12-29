
export interface IPrayer {
    prayerID?:number;
    prayerName:string;
    prayerdetail:string;
    denominationID:number;
    denomination?:string
}
export interface IPrayerRequest {
    prayerRequestID?:number;
    prayerTile:string;
    prayerDetail:string;
    personId:string;
    churchId:number;
    dateEntered:Date
}