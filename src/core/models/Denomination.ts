import { IChurch } from "./Church";
import { IDataCaptureSetting } from "./DataCaptureSetting";
import { IPrayer } from "./Prayer";

export interface IDenomination {
    denominationID:number;
    denominationName:string;
    activated:boolean;
    church:IChurch;
    dataCaptureSetting:IDataCaptureSetting;
    prayers:IPrayer[]
}
