import {
    ActionTypes,SetTitleAction,SetChurchForm,
    SetUserForm,SetChurchAction, breakpoints, setBreakpointAction} from "./types"
import {Dispatch} from "redux"
import * as accountService from "core/services/account.service"
import {getChurchById} from "core/services/church.service"
import * as userService from "core/services/user.service"
import * as auth from "utils/auth"
import * as formService from "utils/Form"
import {IChurch} from "core/models/Church"
import {IChurchMember} from "core/models/ChurchMember"
import {ToastFunc} from "utils/Toast"
import {MessageType} from "core/enums/MessageType"
import { AppState } from "store"

export function createUser(churchMember:IChurchMember,toast:ToastFunc){
    return async (dispatch:Dispatch) => {
        try{
            return await accountService.createChurchMember(churchMember)
            .then(payload => {
                toast({
                    title:"New Church Member",
                    subtitle:`Successfully Created ${churchMember.username}`,
                    messageType:MessageType.SUCCESS,
                  })
                login(churchMember.username!,churchMember.password,toast)
            })
        }catch(error){
            toast({
                title:"Something went wrong",
                subtitle:`While creating User:${error}`,
                messageType:MessageType.INFO,
              })
        }
    }
}

export function getChurch(toast:ToastFunc) {
    return async(dispatch:Dispatch,state:() => AppState) => {
        try{
            return await getChurchById(state().system.currentUser.churchId).then(payload => {
                dispatch(setCurrentChurch(payload.data))
            })
        }catch(err){
            toast({
                title:"Unable to get Church Detail",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}

export function login(username:string,password:string,toast:ToastFunc){
    return async function(dispatch:Dispatch){
        dispatch(showLoading())
        try{
            return await userService.login(username,password).then(payload => {
                dispatch(hideLoading())
                const {refreshToken,...userDetail} = payload.data;
                auth.saveUserDetail(JSON.stringify(userDetail))
                auth.saveToken(refreshToken)
                dispatch(setCurrentUser(JSON.parse(auth.getUserDetail() as string)))
                return payload.data
            })
        }catch(err){
            dispatch(hideLoading())
            toast({
                title:"Error",
                subtitle:` Unable to Login User :${err}`,
                messageType:MessageType.ERROR,
            })
        }
    }
}

export function logout() {
    return(dispatch:Dispatch) => {
        auth.removeToken()
        auth.removeUserDetail()
        dispatch(setCurrentUser({}))
        dispatch(setCurrentChurch({}))
    }
}
export function setCurrentUser(user:any) {
    return{
        type:ActionTypes.SETCURRENTUSER,
        payload:user
    }
}
export function setCurrentChurch(church:IChurch | any):SetChurchAction{
    return{
        type:ActionTypes.SET_CURRENT_CHURCH,
        payload:church
    }
}
const churchFormKey = "faithful-church-form"
export function setChurchForm(church:IChurch):SetChurchForm{
    formService.saveForm<IChurch>(church,churchFormKey)
    return{
        type:ActionTypes.SET_CHURCH_FORM,
        payload:church
    }
}
export function getChurchFormFromStorage (){
    const churchForm = localStorage.getItem(churchFormKey)
    if(churchForm){
        setChurchForm(JSON.parse(churchForm || "{}"))
    }
}
export function clearChurchForm(){
    const key = "faithful-church-form"
    formService.clearFormInStorage(key)
    return(dispatch:Dispatch) => {
        dispatch({
            type:ActionTypes.CLEAR_CHURCH_FORM
        })
    }
}
const churchMemberFormKey = "faithful-member-form"
export function setUserForm(userForm:any):SetUserForm{
    formService.saveForm<any>(userForm,churchMemberFormKey)
    return{
        type:ActionTypes.SET_USER_FORM,
        payload:userForm
    }
}
export function getUserFormFromStorage(){
    const churchMemberForm = localStorage.getItem(churchMemberFormKey)
    if(churchMemberForm){
        setUserForm(JSON.parse(churchMemberForm || "{}"))
    }
}
export function clearUserForm(){
    formService.clearFormInStorage(churchMemberFormKey)
    return{
        type:ActionTypes.CLEAR_USER_FORM
    }
}
export function showLoading(){
    return{
        type:ActionTypes.SHOW_SPINNER
    }
}
export function hideLoading(){
    return{
        type:ActionTypes.HIDE_SPINNER
    }
}
export function setPageTitle(newTitle:string):SetTitleAction{
    return{
        payload:newTitle,
        type:ActionTypes.SET_PAGE_TITLE
    }
}
export function setBreakpoint(arg:breakpoints):setBreakpointAction{
    return({
        type:ActionTypes.SET_BREAKPOINT,
        payload:arg
    })
}