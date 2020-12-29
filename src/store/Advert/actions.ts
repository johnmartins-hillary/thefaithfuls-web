import {MessageType} from "core/enums/MessageType"
import {LoggedInUser} from "core/models/LoggedInUser"
import {IAdvert} from "core/models/Advert"
import {IGroup} from "core/models/Group"

export interface GroupState {
    groups:IGroup[]
}


export enum ActionTypes {
    LOAD_GROUPS_FOR_CHURCH = "[GROUP] LOAD_GROUPS_FOR_CHURCH",
    UPDATE_GROUP = "[GROUP] UPDATE_GROUP",
    DELETE_GROUP = "[GROUP] DELETE_GROUP"
}

export interface LoadGroupsForChurchAction {
    type:ActionTypes.LOAD_GROUPS_FOR_CHURCH,
    payload:IGroup[]
}
export interface UpdateGroupAction {
    type:ActionTypes.UPDATE_GROUP,
    payload:IGroup
}
export interface DeleteGroupAction {
    type:ActionTypes.DELETE_GROUP,
    payload:number
}

export type Action = LoadGroupsForChurchAction |
 UpdateGroupAction | DeleteGroupAction