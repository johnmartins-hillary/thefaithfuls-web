import axios,{AxiosRequestConfig,CancelTokenSource} from "axios"
import {ISermon} from "core/models/Sermon"
import {IResponse} from "core/models/Response"


const baseUrl = new URL(`${process.env.REACT_APP_SERVER_URL}/Sermon`)

export const createSermon = async (arg:any):Promise<IResponse<ISermon>> => {
    const url = `${baseUrl}/CreateSermon`
    try{
        const config:AxiosRequestConfig = {headers:{
            "Content-Type":"multipart/form-data"
        }}
        const response = await axios.post(url,arg,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const editSermon = async (arg:ISermon):Promise<IResponse<ISermon>> => {
    const url = `${baseUrl}/editSermon`
    try{
        const config:AxiosRequestConfig = {headers:{
            "Content-Type":"application/json-patch+json",
            "Accept":"text/plain"
        }}
        const response = await axios.put(url,arg,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const deleteSermon = async (SermonId:string):Promise<IResponse<ISermon>> => {
    try{
        const url = `${baseUrl}/deleteSermon?SermonId=${SermonId}`
        const config:AxiosRequestConfig = {headers:{
            "Accept":"text/plain"
        }}
        const response = await axios.delete(url,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const getSermonById = async (sermonId:number):Promise<IResponse<ISermon>> => {
    try{
        const base = new URL(`${baseUrl}/GetSermonById`)
        new URLSearchParams(String(base)).append("id",String(sermonId))
        const response = await axios.get(String(base))
        return response.data
    }catch(err){
        throw err
    }
}

export const getChurchSermon = async (churchId:string,cancelToken:CancelTokenSource):Promise<IResponse<ISermon[]>> => {
    const url = `${baseUrl}/GetSermonByChurch?churchId=${churchId}`
    try{
        const config:AxiosRequestConfig = {headers:{Accept:"text/plain"},cancelToken:cancelToken.token}
        const response = await axios.get(url,config)
        return response.data
    }catch(err){
        throw err
    }
}
