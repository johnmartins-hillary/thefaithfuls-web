import {MessageType} from "core/enums/MessageType"
import {IAdvert} from "core/models/Advert"

export interface AdvertState {
    groups:IAdvert[]
}


export enum ActionTypes {
    LOAD_GROUPS_FOR_CHURCH = "[GROUP] LOAD_GROUPS_FOR_CHURCH",
    CREATE_GROUP = "[GROUP] CREATE_GROUP",
    UPDATE_GROUP = "[GROUP] UPDATE_GROUP",
    DELETE_GROUP = "[GROUP] DELETE_GROUP"
}

export interface LoadGroupsForChurchAction {
    type:ActionTypes.LOAD_GROUPS_FOR_CHURCH,
    payload:IAdvert[]
}
export interface UpdateGroupAction {
    type:ActionTypes.UPDATE_GROUP,
    payload:IAdvert
}
export interface CreateGroupAction {
    type:ActionTypes.CREATE_GROUP,
    payload:IAdvert
}
export interface DeleteGroupAction {
    type:ActionTypes.DELETE_GROUP,
    payload:number
}

export type Action = LoadGroupsForChurchAction |
 UpdateGroupAction | DeleteGroupAction | CreateGroupAction