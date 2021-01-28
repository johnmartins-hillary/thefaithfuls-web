import {Dispatch} from "redux"
import {IGroup,ICreateGroupMember} from "core/models/Group"
import * as groupService from "core/services/group.service"
import history from "utils/history"
import {ToastFunc} from "utils/Toast"
import {AppState} from "store"
import {MessageType} from "core/enums/MessageType"
import {
    DeleteGroupAction,LoadCurrentGroupAction,LoadMemberForCurrentGroupAction,CreateGroupMemberAction,CreateGroupAction,
    LoadGroupsForChurchAction,ActionTypes,UpdateGroupAction } from "./types"


export function loadGroupForChurch (churchId:string,toast:ToastFunc){
    return async (dispatch:Dispatch) => {
        try{
            return await groupService.getGroupByChurch(churchId).then(payload => {
                dispatch<LoadGroupsForChurchAction>
                ({
                    type:ActionTypes.LOAD_GROUPS_FOR_CHURCH,
                    payload:payload.data
                })
            })
        }catch(err){
            toast({
                title:"Unable to Load Group For Church",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}

export function loadGroupMemberForCurrentGroup(groupId:number,toast:ToastFunc){
    return async (dispatch:Dispatch) => {
        try{
            return await groupService.getGroupMember(groupId).then(payload => {
                dispatch<LoadMemberForCurrentGroupAction>({
                    type:ActionTypes.LOAD_CURRENT_GROUP_MEMBER,
                    payload:payload.data
                })
            })
        }catch(err){
            toast({
                title:"Unable to load member for the current Group",
                subtitle:"",
                messageType:MessageType.INFO
            })
        }
    }
}
        
export function createNewGroup (newGroup:IGroup,toast:ToastFunc,func?:any){
    return async (dispatch:Dispatch) => {
        try{
            return await groupService.createGroup(newGroup).then(payload => {
                dispatch<LoadMemberForCurrentGroupAction>({
                    type:ActionTypes.LOAD_CURRENT_GROUP_MEMBER,
                    payload:[]
                })
                dispatch<CreateGroupAction>
                ({type:ActionTypes.CREATE_GROUP,payload:payload.data})
                toast({
                    title:"New Group",
                    subtitle:`Group ${newGroup.name} has been successfully created`,
                    messageType:MessageType.SUCCESS
                })
                if(func){
                    func(payload,history.push(`/church/${newGroup.churchId}/groups`))
                }
            })
        }catch(err){
            toast({
                title:"Unable to Load Groups",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}

export function createGroupMember (newGroupMember:ICreateGroupMember,toast:ToastFunc) {
    return async (dispatch:Dispatch,getState:() => AppState) => {
        try{
            return await groupService.createGroupMember(newGroupMember).then(payload => { 
                dispatch<CreateGroupMemberAction>({
                    type:ActionTypes.CREATE_GROUP_MEMBER,
                    payload:payload.data
                })
                // toast({
                //     title:"New Group Member Created",
                //     subtitle:`Group Member has been successfully created`,
                //     messageType:MessageType.SUCCESS
                // })
            })
        }catch(err){
            toast({
                title:"Unable to Add Member to Group",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}

export function setCurrentGroup(currentGroupName:string){
    return async(dispatch:Dispatch) => {
        dispatch<LoadCurrentGroupAction>({
            type:ActionTypes.LOAD_CURRENT_GROUP,
            payload:currentGroupName
        })
    }    
}

export function updateGroup (updatedGroup:IGroup,toast:ToastFunc) {
    return async (dispatch:Dispatch) => {
        try{
            return await groupService.updateGroup(updatedGroup).then(payload => {
                dispatch<UpdateGroupAction>({
                    type:ActionTypes.UPDATE_GROUP,
                    payload:payload.data
                })
            })
        }catch(err){
            toast({
                title:"Unable to Update Group For Church",
                subtitle:`Error:${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}

export function deleteGroup (deleteGroupId:number,toast:ToastFunc) {
    return async (dispatch:Dispatch,getState:() => AppState) => {
        try{
            console.log(deleteGroupId)
            await groupService.deleteGroup(deleteGroupId).then(payload => {
                toast({
                    title:"Success",
                    subtitle:`${getState().group.currentGroup.name} has been successfully deleted`,
                    messageType:MessageType.SUCCESS
                })
                dispatch<DeleteGroupAction>({
                    type:ActionTypes.DELETE_GROUP,
                    payload:deleteGroupId
                })
            })
        }catch(err){
            toast({
                title:"Unable to Delete Group For Church",
                subtitle:`Error:${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}