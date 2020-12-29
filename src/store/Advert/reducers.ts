import {MessageType} from "core/enums/MessageType"
import {LoggedInUser} from "core/models/LoggedInUser"
import {IGroup} from "core/models/Group"

export interface GroupState {
    groups:IGroup[],
    currentGroup:IGroup
}


export enum ActionTypes {
    LOAD_GROUPS_FOR_CHURCH = "[GROUP] LOAD_GROUPS_FOR_CHURCH",
    LOAD_CURRENT_GROUP = "[GROUP] LOAD_CURRENT_GROUP",
    CREATE_GROUP = "[GROUP] CREATE_GROUP",
    CREATE_GROUP_MEMBER = "[GROUP] CREATE_GROUP_MEMBER",
    UPDATE_GROUP = "[GROUP] UPDATE_GROUP",
    DELETE_GROUP = "[GROUP] DELETE_GROUP"
}

export interface LoadGroupsForChurchAction {
    type:ActionTypes.LOAD_GROUPS_FOR_CHURCH,
    payload:IGroup[]
}
export interface LoadCurrentGroupAction {
    type:ActionTypes.LOAD_CURRENT_GROUP,
    payload:IGroup
}
export interface UpdateGroupAction {
    type:ActionTypes.UPDATE_GROUP,
    payload:IGroup
}
export interface CreateGroupAction {
    type:ActionTypes.CREATE_GROUP,
    payload:IGroup
}
export interface CreateGroupMemberAction {
    type:ActionTypes.CREATE_GROUP_MEMBER,
    payload:IGroup
}
export interface DeleteGroupAction {
    type:ActionTypes.DELETE_GROUP,
    payload:number
}

export type Action = LoadGroupsForChurchAction | LoadCurrentGroupAction |
 UpdateGroupAction | DeleteGroupAction | CreateGroupAction | CreateGroupMemberAction