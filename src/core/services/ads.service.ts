import axios,{AxiosRequestConfig,CancelTokenSource} from "axios"
import {IAdvert} from "core/models/Advert"
import {IResponse} from "core/models/Response"


const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Advert`


export const createAdvert = async (arg:IAdvert):Promise<IResponse<IAdvert>> => {
    const url = `${baseUrl}/createAdvert`
    try{
        const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,arg,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const editAdvert = async (arg:IAdvert):Promise<IResponse<IAdvert>> => {
    const url = `${baseUrl}/Advert/editAdvert`
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

export const deleteAdvert = async (advertId:number):Promise<IResponse<IAdvert>> => {
    try{
        const url = `${baseUrl}/Advert/deleteAdvert?AdvertId=${advertId}`
        const config:AxiosRequestConfig = {headers:{
            "Accept":"text/plain"
        }}
        const response = await axios.delete(url,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const getAdvert = async (churchId:number):Promise<IResponse<IAdvert>> => {
    const url = `${baseUrl}/getAdvert?churchId=${churchId}`
    try{
        const config:AxiosRequestConfig = {headers:{
            "Accept":"text/plain"
        }}
        const response = await axios.get(url,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const getAdverts = async (churchId:number,cancelToken:CancelTokenSource):Promise<IResponse<IAdvert[]>> => {
    const url = `${baseUrl}/getAdvert?churchId=${churchId}`
    try{
        const config:AxiosRequestConfig = {headers:{
            "Accept":"text/plain"
        },
        cancelToken:cancelToken.token
    }
        const response = await axios.get(url,config)
        return response.data
    }catch(err){
        throw err
    }
}
