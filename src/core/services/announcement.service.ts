import axios,{AxiosRequestConfig} from "axios"
import {IResponse} from "core/models/Response"
import {IAnnouncement} from "core/models/Announcement"

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Infomation`


export const createAnnouncement = async (newAnnouncement:IAnnouncement):Promise<IResponse<IAnnouncement>> => {
    const url = `${baseUrl}/AddAnnouncement`
    try{
        const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,newAnnouncement,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const editAnnouncement = async (editAnnouncement:IAnnouncement):Promise<IResponse<IAnnouncement>> => {
    const url = `${baseUrl}/editAnnouncement`
    try{
        const config:AxiosRequestConfig = {headers:{
            "Content-Type":"application/json-patch+json",
            "Accept":"text/plain"
        }}
        const response = await axios.put(url,editAnnouncement,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const deleteAnnouncement = async (announcementId:string):Promise<IResponse<IAnnouncement>> => {
    try{
        const url = `${baseUrl}/DeleteAnnouncementByChurch?id=${announcementId}`
        const config:AxiosRequestConfig = {headers:{
            "Accept":"text/plain"
        }}
        const response = await axios.delete(url,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const getAnnouncementByChurch = async (churchId:string):Promise<IResponse<IAnnouncement[]>> => {
    const url = `${baseUrl}/GetAnnouncementByChurch?churchId=${churchId}`
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