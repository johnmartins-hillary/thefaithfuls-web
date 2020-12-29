import {Advert} from "core/enums/Advert"

export interface IAdvert {
    advertID?:number;
    title:string
    dateFrom:string;
    dateTo:string;
    advertUrl?:string
    churchId:number;
    audience:string
    status?:number;
}