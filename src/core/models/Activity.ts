import {IBaseModel} from "core/models/BaseEventModel"

export interface ISchedule {
    time:{
        startDate:Date | string;
        endDate:Date | string;
    },
    recurrence?:string;
    attendee:string[]
}

type ScheduleType = string | ISchedule | null

export interface IActivity<T extends ScheduleType = string> extends IBaseModel  {
    activityID?:number;
    schedule:T;
    recuring:string;
}
// For updating either activity and event
export interface updatedActivityType {
    title:string;
    description:string;
    speaker:string;
    bannerUrl?:string
    type:"activity" | "event",
    id:number;
} 