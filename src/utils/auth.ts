import axios from "axios"
import {LoggedInUser} from "core/models/LoggedInUser";
import jwt from "jsonwebtoken"


const storageKey = "thefaithful-token"
const userDetailStorageKey = "thefaithful-userDetailStorageKey"

export function setAuthorizationToken(token:string | boolean){
    if(token){
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }else{
        delete axios.defaults.headers.common["Authorization"]
    }
}

export const saveToken = (token:string) => {
    localStorage.setItem(storageKey,token)
    setAuthorizationToken(token)
}
export const saveUserDetail = (userDetail:string) => {
    localStorage.setItem(userDetailStorageKey,userDetail)
}
export const getUserDetail = () => {
    return localStorage.getItem(userDetailStorageKey) || null
}
export const removeUserDetail = () => {
    localStorage.removeItem(userDetailStorageKey)
}
export const getToken = () => {
    return localStorage.getItem(storageKey) || null;
}
export const removeToken = () => {
    localStorage.removeItem(storageKey)
    setAuthorizationToken(false)
}

export const init = (store:any) => {
    const token = getToken();
    if(token){
        setAuthorizationToken(token);
    }
}

export const mapUser = (token:string) => {
    const data = jwt.decode(token) as LoggedInUser
    return data
}