import {LoggedInUser} from "core/models/LoggedInUser"
import {IChurch} from "core/models/Church"
import {IChurchMember} from "core/models/ChurchMember"

export type breakpoints = "base" | "sm" | "md" | "lg" | "xl"

interface IChurchMemberForm extends IChurchMember {
    confirmPassword:string;
}
export interface SystemState {
    isAuthenticated:boolean;
    isLoading:boolean;
    pageTitle:string;
    currentUser:LoggedInUser;
    currentBreakpoints:breakpoints;
    currentChurch:IChurch;
    form:{
        church:IChurch;
        user:IChurchMemberForm
    }
}


export enum ActionTypes {
    SHOW_SPINNER = "[System] Show_Spinner",
    HIDE_SPINNER = "[System] Hide_Spinner",
    LOGIN = "[System] Login",
    SETCURRENTUSER = "[System] SetCurrentUser",
    SET_CURRENT_CHURCH = "[System] SetCurrentChurch",
    SET_PAGE_TITLE = "[System] SetPageTitle",
    SET_BREAKPOINT = "[System] SET_BREAKPOINT",
    SET_CHURCH_FORM = "[System] SET_CHURCH_FORM",
    CLEAR_CHURCH_FORM = "[System] CLEAR_CHURCH_FORM",
    SET_USER_FORM = "[System] SET_USER_FORM",
    CLEAR_USER_FORM = "[System] CLEAR_USER_FORM",
}

export interface SetChurchAction {
    type:ActionTypes.SET_CURRENT_CHURCH,
    payload:IChurch
}
export interface ShowSpinnerAction {
    type:ActionTypes.SHOW_SPINNER
}
export interface HideSpinnerAction {
    type:ActionTypes.HIDE_SPINNER
}
export interface SetTitleAction {
    type:ActionTypes.SET_PAGE_TITLE,
    payload:string
}
export interface setBreakpointAction {
    type:ActionTypes.SET_BREAKPOINT,
    payload:breakpoints
}
export interface LoginAction {
    type: ActionTypes.LOGIN,
    payload: string
}
export interface SetCurrentUserAction {
    type: ActionTypes.SETCURRENTUSER,
    payload: any
} 
export interface SetChurchForm {
    type: ActionTypes.SET_CHURCH_FORM,
    payload: IChurch
} 
export interface SetUserForm {
    type: ActionTypes.SET_USER_FORM,
    payload: IChurchMemberForm
} 
export interface ClearChurchForm {
    type: ActionTypes.CLEAR_CHURCH_FORM
} 
export interface ClearUserForm {
    type: ActionTypes.CLEAR_USER_FORM
} 

export type Action = HideSpinnerAction  | LoginAction | SetCurrentUserAction | ClearChurchForm | ClearUserForm|
 SetChurchAction | ShowSpinnerAction | HideSpinnerAction | SetTitleAction | SetChurchForm | SetUserForm | setBreakpointAction