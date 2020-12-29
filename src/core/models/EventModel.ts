import {IBaseModel} from "core/models/BaseEventModel"

export interface IEventModel extends IBaseModel {
    eventId:number;
    startDateTime:Date;
    endDateTime:Date;
}