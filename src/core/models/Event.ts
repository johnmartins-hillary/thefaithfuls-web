import {IBaseModel} from "./BaseEventModel"

interface EventSchedule {
    atttendee:string[]
}

export interface IEvent extends IBaseModel {
    eventId?:number;
    schedule:string | EventSchedule;
    startDateTime:Date | string;
    endDateTime:Date | string;
}