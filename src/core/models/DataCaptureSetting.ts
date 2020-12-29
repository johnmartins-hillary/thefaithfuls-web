import { IDenomination } from "./Denomination";
import { IState } from "./Location";

export interface IDataCaptureSetting {
    dataCaptureSettingID:number;
    name:string;
    dioceseId:number;
    denominationId:number;
    activated:boolean;
    denomination:IDenomination;
    state:IState;
}