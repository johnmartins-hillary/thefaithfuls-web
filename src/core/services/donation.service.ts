import axios,{AxiosRequestConfig,CancelTokenSource} from "axios"
import {IDonation} from "core/models/Donation"
import {IResponse} from "core/models/Response"


const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Donation`


export const AddDonation = async(newDonation:IDonation):Promise<IResponse<IDonation>> => {
    try{
        const url = `${baseUrl}/AddDonation`
        const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,newDonation,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const GetDonationByChurch = async (churchId:number,cancelToken:CancelTokenSource):Promise<IResponse<IDonation[]>> => {
    try{
        const url = `${baseUrl}/GetDonationByChurch?churchId=${churchId}`
        const response = await axios.get(url,{
            cancelToken:cancelToken.token
        })
        return response.data
    }catch(err){
        throw err
    }
}

export const GetDonationTransactionByChurch = async (churchId:number,cancelToken:CancelTokenSource):Promise<IResponse<IDonation>> => {
    try{
        const url = `${baseUrl}/GetDonationTransactionsByChurch?churchId=${churchId}`
        const response = await axios.get(url,{
            cancelToken:cancelToken.token
        })
        return response.data
    }catch(err){
        throw err
    }
}