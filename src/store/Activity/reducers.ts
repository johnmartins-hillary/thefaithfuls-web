import {ActivityState,Action,ActionTypes} from "./types"

const initialState:ActivityState = {
    activities:[],
    events:[]
}


export function activityReducer(state = initialState,action:Action):ActivityState {
    switch(action.type){
        case ActionTypes.LOAD_ACTIVITIES_FOR_CHURCH:
            return {
                ...state,
                activities:action.payload
            };
        case ActionTypes.CREATE_ACTIVITY:
            return{
                ...state,
                activities:[action.payload,...state.activities],
            };
        case ActionTypes.UPDATE_ACTIVITY:{
            const activities = [...state.activities]
            const foundIdx = activities.findIndex(x => x.activityID === action.payload.activityID)
            activities.splice(foundIdx,1,action.payload)
            return {
                ...state,
                activities:activities
            };
        }
        case ActionTypes.DELETE_ACTIVITY:{
            const filterActivities = [...state.activities]
            const foundIdx = filterActivities.findIndex(x => x.activityID === action.payload.activityID)
            filterActivities.splice(foundIdx,1)
            return{
                ...state,
                activities:filterActivities
            }
        }
        case ActionTypes.LOAD_EVENT_FOR_CHURCH:
            return {
                ...state,
                events:action.payload
            };
        case ActionTypes.CREATE_EVENT:
            return{
                ...state,
                events:[action.payload,...state.events],
            };
        case ActionTypes.UPDATE_EVENT:{
            const filteredEvents = [...state.events]
            const foundIdx = filteredEvents.findIndex(x => x.title === action.payload.title)
            filteredEvents.splice(foundIdx,1,action.payload)
            return {
                ...state,
                events:filteredEvents
            };
        }
        case ActionTypes.DELETE_EVENT:{
            const filterEvents = [...state.events]
            const foundIdx = filterEvents.findIndex(x => x.title === action.payload.title)
            filterEvents.splice(foundIdx,1)
            return{
                ...state,
                events:filterEvents
            }
        }
        default:
        return state;
}
}