import {GroupState,Action,ActionTypes} from "./types"
import {IGroupMember} from "core/models/Group"

const initialState:GroupState = {
    groups:[],
    currentGroup:{
        societyID:0,
        name:"",
        description:"",
        societyType:"",
        memberCount:0,
        imageUrl:"",
        churchId:0,
        isDeleted:false,
        denominationId:0,
        groupMember:[],
        
    }
}


export function groupReducer(state = initialState,action:Action):GroupState {
    switch(action.type){
        case ActionTypes.LOAD_GROUPS_FOR_CHURCH:
            return {
                ...state,
                groups:action.payload
            };
        case ActionTypes.CREATE_GROUP:
            return{
                ...state,
                // groups:[action.payload,...state.groups],
                // currentGroup:action.payload
            };
        case ActionTypes.CREATE_GROUP_MEMBER:{
            const filterGroups = [...state.groups]
            const foundIdx = filterGroups.findIndex(x => x.societyID === state.currentGroup.societyID)
            const newUpdatedGroup = {
                ...filterGroups[foundIdx],
                memberCount:filterGroups[foundIdx].memberCount ? filterGroups[foundIdx].memberCount+1 : 1
            }
            filterGroups.splice(foundIdx,1,newUpdatedGroup)
            return{
                ...state,
                groups:[...filterGroups],
                // groups:[action.payload,...state.groups],
                currentGroup:{
                    ...state.currentGroup,
                    groupMember:[
                        ...(state.currentGroup.groupMember as IGroupMember[] || []),
                        ...action.payload
                    ]
                }
            };
        }
        case ActionTypes.LOAD_CURRENT_GROUP:{
            const currentGroupIdx = state.groups.findIndex((item,idx) => item.name === action.payload)
            return{
                ...state,
                currentGroup:state.groups[currentGroupIdx]
            };
        }
        case ActionTypes.LOAD_CURRENT_GROUP_MEMBER:{
            console.log(action.payload)
            return{
                ...state,
                currentGroup:{
                    ...state.currentGroup,
                    groupMember:action.payload
                }
            }
        }
        case ActionTypes.UPDATE_GROUP:{
            const filterGroups = [...state.groups]
            const foundIdx = filterGroups.findIndex(x => x.societyID === action.payload.societyID)
            filterGroups.splice(foundIdx,1,action.payload)
            return {
                ...state,
                currentGroup:action.payload,
                groups:filterGroups
            };
        }
        case ActionTypes.DELETE_GROUP:{
            const filterGroups = [...state.groups]
            const foundIdx = filterGroups.findIndex(x => x.societyID === action.payload)
            filterGroups.splice(foundIdx,1)
            return{
                ...state,
                groups:filterGroups,
                currentGroup:initialState.currentGroup
            }
        }
        default:
        return state;
}
}