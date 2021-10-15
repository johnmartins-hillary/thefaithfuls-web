import axios,{AxiosRequestConfig,CancelTokenSource} from "axios"
import {IChurch} from "core/models/Church"
import {IChurchResponse} from "core/models/ChurchResponse"
import {IChurchMember} from 'core/models/ChurchMember'
import {IResponse} from "core/models/Response"
import {IDenomination} from "core/models/Denomination"
import {IDiocese} from "core/models/diocese"
import {IChurchBankDetail} from "core/models/BankAccount"


const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Church`


export const getChurchById = async (churchId:number,cancelToken?:CancelTokenSource) : Promise<IResponse<IChurch>> => {
    try{
        const url = `${baseUrl}/getchurchbyId?churchId=${churchId}`
        const response = await axios.get(url,{
            ...(cancelToken && {cancelToken:cancelToken.token})
        })
        return response.data
    }catch(err){
        throw err
    }
}

export const createChurch = async (createChurch:IChurchResponse):Promise<IResponse<IChurchResponse>> => {
    try{
        const url = `${baseUrl}/createChurch`
        const response = await axios.post(url,createChurch)
        return response.data
    }catch(err){
        throw err
    }
}

export const activateChurch = async (churchId:number):Promise<IResponse<IChurchResponse>> => {
    try{
        const urlBase = new URL(`${baseUrl}/activateChurch`)
        const response = await axios.put(String(urlBase),{})
        return response.data
    }catch(err){
        throw err
    }
}
export const verifyChurch = async (arg:IChurchResponse):Promise<IResponse<IChurchResponse>> => {
    try{
        const url = `${baseUrl}/verifyChurch`
        // const config:AxiosRequestConfig = {headers:{"Accept":"application/json"}}
        const response = await axios.put(url,arg)
        return response.data
    }catch(err){
        throw err
    }
}
 
export const getChurchDenomination = async ():Promise<IResponse<IDenomination[]>> => {
    try{
        const url = `${baseUrl}/getDenomination`

        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

export const getDiocese = async ():Promise<IResponse<IDiocese[]>> => {
    try{
        const url = `${baseUrl}/getDiocese`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}
export const getChurchByDenomination = async (denomationId:number,stateId:number) => {
    try{
        const url = `${baseUrl}/getchurchbydenomination?denominationId=${denomationId}&stateId=${stateId}`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

export const updateChurch = async (updateChurch:IChurchResponse) => {
    try{
        const url = `${baseUrl}/UpdateChurch`
        // const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,updateChurch)
        return response.data    
    }catch(err){
        throw err
    }
}
export const getChurchMember = async (churchId:number):Promise<IResponse<IChurchMember[]>> => {
    try{
        const url = `${baseUrl}/GetChurchMember?churchId=${churchId}`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}
export const createChurchBankDetail = async (newBankDetail:IChurchBankDetail) => {
    try{
        const url = `${baseUrl}/createChurchBankDetail`
        // const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,newBankDetail)
        return response.data
    }catch(err){
        throw err
    }
}
export const getChurchBankAccount = async (churchId:number,cancelToken:CancelTokenSource):Promise<IResponse<IChurchBankDetail[]>> => {
    try{
        const url = `${baseUrl}/getchurchBankAccountByChurch?churchId=${churchId}`
        const response = await axios.get(url,{
            cancelToken:cancelToken.token
        })
        return response.data
    }catch(err){
        throw err
    }
}