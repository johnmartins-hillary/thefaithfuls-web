import {IChurch} from "core/models/Church"


export interface IDiocese{
    dioceseID:number;
    name:string;
    denominationId:number;
    deanary:IDeanary;
    church:IChurch
}

export interface IProvince {
    provinceID:number;
    name:string;
    church:IChurch
}

export interface IRegion {
    regionID:number;
    name:string;
    church:IChurch;
}

export interface IDeanary {
    deanaryID:number;
    name:string;
    dioceseId:number;
    diocese:IDiocese;
    church:IChurch
}