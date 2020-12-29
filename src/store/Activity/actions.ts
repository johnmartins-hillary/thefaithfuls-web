import {Dispatch} from "redux"
import {IActivity} from "core/models/Activity"
import {IEvent} from "core/models/Event"
import * as activityService from "core/services/activity.service"
import history from "utils/history"
import {ToastFunc} from "utils/Toast"
import {MessageType} from "core/enums/MessageType"
import {
    ActionTypes,CreateActivityAction,UpdateActivityAction,
    LoadActivitiesForChurchAction,
    LoadEventsForChurchAction,
    CreateEventAction,
    UpdateEventAction} from "./types"

// #region activity Action
export function LoadActivitiesForChurch (churchId:string,toast:ToastFunc){
    return async (dispatch:Dispatch) => {
        try{
            return await activityService.getChurchActivity(churchId).then(payload => {
                dispatch<LoadActivitiesForChurchAction>
                ({
                    type:ActionTypes.LOAD_ACTIVITIES_FOR_CHURCH,
                    payload:payload.data
                })
            })
        }catch(err){
            toast({
                title:"Unable to Load Activities For Church",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}
export function createNewActivity (newActivity:IActivity,toast:ToastFunc){
    return async (dispatch:Dispatch) => {
        try{
            return await activityService.createActivity(newActivity).then(payload => {
                dispatch<CreateActivityAction>
                ({type:ActionTypes.CREATE_ACTIVITY,payload:payload.data})
            })
        }catch(err){
            toast({
                title:"Unable to Create new Activity",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}
export function updateActivity (updateActivity:IActivity,toast:ToastFunc){
    return async (dispatch:Dispatch) => {
        try{
            return await activityService.updateActivity(updateActivity).then(payload => {
                dispatch<UpdateActivityAction>
                ({type:ActionTypes.UPDATE_ACTIVITY,payload:payload.data})
            })
        }catch(err){
            toast({
                title:"Unable to Update Activity",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}
//#endregion

//#region events Actions
export function LoadEventsForChurch (churchId:string,toast:ToastFunc){
    return async (dispatch:Dispatch) => {
        try{
            return await activityService.getChurchEvent(churchId).then(payload => {
                dispatch<LoadEventsForChurchAction>
                ({
                    type:ActionTypes.LOAD_EVENT_FOR_CHURCH,
                    payload:payload.data
                })
            })
        }catch(err){
            toast({
                title:"Unable to Load Events For Church",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}
export function createNewEvents (newEvents:IEvent,toast:ToastFunc){
    return async (dispatch:Dispatch) => {
        try{
            return await activityService.createEvent(newEvents).then(payload => {
                dispatch<CreateEventAction>
                ({type:ActionTypes.CREATE_EVENT,payload:payload.data})
            })
        }catch(err){
            toast({
                title:"Unable to Create new Activity",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}
export function updateEvent (updateEvents:IEvent,toast:ToastFunc){
    return async (dispatch:Dispatch) => {
        try{
            return await activityService.updateEvent(updateEvents).then(payload => {
                dispatch<UpdateEventAction>
                ({type:ActionTypes.UPDATE_EVENT,payload:payload.data})
            })
        }catch(err){
            toast({
                title:"Unable to Update Event",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}

//#endregion