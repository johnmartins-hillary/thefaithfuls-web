import {IGroup,IGroupMember} from "core/models/Group"

export interface GroupState {
    groups:IGroup[],
    currentGroup:IGroup
}


export enum ActionTypes {
    LOAD_GROUPS_FOR_CHURCH = "[GROUP] LOAD_GROUPS_FOR_CHURCH",
    LOAD_CURRENT_GROUP = "[GROUP] LOAD_CURRENT_GROUP",
    LOAD_CURRENT_GROUP_MEMBER = "[GROUP] LOAD_CURRENT_GROUP_MEMBER",
    CREATE_GROUP = "[GROUP] CREATE_GROUP",
    CREATE_GROUP_MEMBER = "[GROUP] CREATE_GROUP_MEMBER",
    UPDATE_GROUP = "[GROUP] UPDATE_GROUP",
    DELETE_GROUP = "[GROUP] DELETE_GROUP"
}

export interface LoadGroupsForChurchAction {
    type:ActionTypes.LOAD_GROUPS_FOR_CHURCH,
    payload:IGroup[]
}
export interface LoadMemberForCurrentGroupAction {
    type:ActionTypes.LOAD_CURRENT_GROUP_MEMBER,
    payload:IGroupMember[]
}
export interface LoadCurrentGroupAction {
    type:ActionTypes.LOAD_CURRENT_GROUP,
    payload:string;
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
    payload:IGroupMember[]
}
export interface DeleteGroupAction {
    type:ActionTypes.DELETE_GROUP,
    payload:number
}

export type Action = LoadGroupsForChurchAction | LoadCurrentGroupAction | LoadMemberForCurrentGroupAction |
 UpdateGroupAction | DeleteGroupAction | CreateGroupAction | CreateGroupMemberAction