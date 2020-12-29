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