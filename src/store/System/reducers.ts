import { SystemState, Action, ActionTypes } from "./types"
import isEmpty from "lodash/isEmpty"

const defaultChurchForm = {
    address:"",
    cityID:0,
    countryID:0,
    denominationId:0,
    name:"",
    stateID:0,
    churchID:0
}

const defaultUserForm = {
    confirmPassword:"",
    email:"",
    firstname:"",
    lastname:"",
    password:"",
    phoneNumber:null,
    username:""
}

const initialState: SystemState = {
    isAuthenticated: false,
    isLoading:true,
    pageTitle:"",
    currentUser: {
        id: "",
        auth_token: "",
        fullname: "",
        phoneNumber: 0,
        email: "",
        expirationTime: 0,
        personType: 0,
        callingCode: 0,
        picture_url:"",
        churchId: 0,
        role: []
    },
    currentChurch:{
        name: "",
        address: "",
        churchLogo:"",
        denominationId: 0,
        countryID: 0,
        country:"",
        stateID:0,
        cityID: 0,
        churchStatus: ""
    },
    form:{
        church:defaultChurchForm,
        user:defaultUserForm
    }
}


export function systemReducer(state = initialState, action: Action): SystemState {
    switch (action.type) {
        case ActionTypes.SET_CHURCH_FORM:
            return{
                ...state,
                form:{
                    ...state.form,
                    church:{
                        ...state.form.church,
                        ...action.payload
                    }
                }
            }
        case ActionTypes.CLEAR_CHURCH_FORM:
            return{
                ...state,
                form:{
                    ...state.form,
                    church:{
                        ...defaultChurchForm
                    }
                }
            }
        case ActionTypes.SET_USER_FORM:
            return{
                ...state,
                form:{
                    ...state.form,
                    user:{
                        ...state.form.user,
                        ...action.payload
                    }
                }
            }
        case ActionTypes.CLEAR_USER_FORM:
            return{
                ...state,
                form:{
                    ...state.form,
                    user:{
                        ...defaultUserForm
                    }
                }
            }
        case ActionTypes.SETCURRENTUSER:
            return {
                ...state,
                currentUser: {
                    ...action.payload
                },
                isAuthenticated: !isEmpty(action.payload)
            };
        case ActionTypes.SET_CURRENT_CHURCH:
            return {
                ...state,
                currentChurch: action.payload
            };
        case ActionTypes.SHOW_SPINNER:
            return {
                ...state,
                isLoading:true
            }
        case ActionTypes.HIDE_SPINNER:
            return {
                ...state,
                isLoading:false
            }
        case ActionTypes.SET_PAGE_TITLE:
            return {
                ...state,
                pageTitle:action.payload
            }
        default:
            return state;
    }
}