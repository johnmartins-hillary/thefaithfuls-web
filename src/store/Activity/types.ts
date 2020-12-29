import {IActivity} from "core/models/Activity"
import {IEvent} from "core/models/Event"

export interface ActivityState {
    activities:IActivity[];
    events:IEvent[]
}

export enum ActionTypes {
    LOAD_ACTIVITIES_FOR_CHURCH = "[ACTIVITY] LOAD_ACTIVITIES_FOR_CHURCH",
    CREATE_ACTIVITY = "[ACTIVITY] CREATE_ACTIVITY",
    UPDATE_ACTIVITY = "[ACTIVITY] UPDATE_ACTIVITY",
    DELETE_ACTIVITY = "[ACTIVITY] DELETE_ACTIVITY",
    
    LOAD_EVENT_FOR_CHURCH = "[EVENT] LOAD_EVENT_FOR_CHURCH",
    CREATE_EVENT = "[EVENT] CREATE_EVENT",
    UPDATE_EVENT = "[EVENT] UPDATE_EVENT",
    DELETE_EVENT = "[EVENT] DELETE_EVENT"
}

//#region Action creator for Activity
export interface LoadActivitiesForChurchAction {
    type:ActionTypes.LOAD_ACTIVITIES_FOR_CHURCH,
    payload:IActivity[]
}
export interface UpdateActivityAction {
    type:ActionTypes.UPDATE_ACTIVITY,
    payload:IActivity
}
export interface CreateActivityAction {
    type:ActionTypes.CREATE_ACTIVITY,
    payload:IActivity
}
export interface DeleteActivityAction {
    type:ActionTypes.DELETE_ACTIVITY,
    payload:IActivity
}
//#endregion

//#region Action creator for event
export interface LoadEventsForChurchAction {
    type:ActionTypes.LOAD_EVENT_FOR_CHURCH,
    payload:IEvent[]
}
export interface UpdateEventAction {
    type:ActionTypes.UPDATE_EVENT,
    payload:IEvent
}
export interface CreateEventAction {
    type:ActionTypes.CREATE_EVENT,
    payload:IEvent
}
export interface DeleteEventAction {
    type:ActionTypes.DELETE_EVENT,
    payload:IEvent
}
//#endregion

export type Action = LoadActivitiesForChurchAction |
 UpdateActivityAction | DeleteActivityAction | CreateActivityAction |
LoadEventsForChurchAction | UpdateEventAction | CreateEventAction | DeleteEventAction