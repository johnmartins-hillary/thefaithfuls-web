import axios,{AxiosRequestConfig} from "axios"
import {IChurchMember} from "core/models/ChurchMember"
import {IChurch} from "core/models/Church"
import {IStaff} from "core/models/Staff"
import {IResponse} from "core/models/Response"
import {IRole} from "core/models/Role"


const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Account`


export const createChurchMember = async (newChurchMember:IChurchMember):Promise<IResponse<IChurchMember>> => {
    try{
        const url = `${baseUrl}/createChurchMembers`
        const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,newChurchMember,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const createStaff = async(newStaff:IChurchMember):Promise<IResponse<IStaff>> => {
    try{
        const url = `${baseUrl}/createStaff`
        const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,newStaff,config)
        return response.data
    }catch(err){
        throw err
    }

}

export const getStaffByChurch = async (churchId:number):Promise<IResponse<IStaff[]>> => {
    try{
        const url = `${baseUrl}/GetStaffByChurch?churchId=${churchId}`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

export const getUserChurchInfo = async (personId:string):Promise<IResponse<IChurch>> => {
    try{
        const url = `${baseUrl}/GetUserChurchInfo?personId=${personId}`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

export const allRoles = async ():Promise<IResponse<IRole[]>> => {
    try{
        const url = `${baseUrl}/AllRoles`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

export const editStaff = async (edittedStaff:IStaff):Promise<IResponse<IStaff>> => {
    const url = `${baseUrl}/editStaff`
    try{
        const response = await axios.put(url,edittedStaff)
        return response.data
    }catch(err){
        throw err
    }
}

export const suspendStaff = async (suspendStaffId:string):Promise<IResponse<null>> => {
    const url = `${baseUrl}/suspendStaff?pseronId=${suspendStaffId}`
    try{
        const response = await axios.put(url)
        return response.data
    }catch(err){
        throw err
    }

}
export const deleteStaff = async (deleteStaffId:string):Promise<IResponse<null>> => {
    const url = `${baseUrl}/deleteStaff?personId=${deleteStaffId}`
    try{
        const response = await axios.delete(url)
        return response.data
    }catch(err){
        throw err
    }
}