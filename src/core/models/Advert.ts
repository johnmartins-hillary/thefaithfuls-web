import {Advert} from "core/enums/Advert"

export interface IAdvert {
    advertID?:number;
    title:string
    dateFrom:string | Date; 
    dateTo:string | Date;
    advertUrl?:string
    churchId:number;
    audience:string
    status?:number;
}

export interface IAdvertSetting {
    advertID:number;
    title:string;
    dateFrom:Date;
    detaTo:Date;
    advertUrl:string;
    churchId:number;
    audience:"isInternal" | "isExternal";
    status:number;
    advertLink:string;
    settingId:number;
    advertSetting:{
        id:number;
        title:string;
        duration:string;
        price:number;
        discount:number;
        status:number;
        persons:string[]
    }
}