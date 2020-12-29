// import {IChurch} from "./Church"

export interface IAnnouncement {
    announcementID?:string;
    title:string;
    description:string;
    type:string;
    category:string;
    announcementBanner?:string;
    startDate:Date;
    churchId:number;
    dateEntered:Date;
    expirationDate:Date;
    // church:IChurch;
}