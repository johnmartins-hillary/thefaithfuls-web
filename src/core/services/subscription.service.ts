import axios,{AxiosRequestConfig} from "axios"
import {IAdvert} from "core/models/Advert"
import {IResponse} from "core/models/Response"
import {ISubscription} from "core/models/subscription"


const baseUrl = `${process.env.SERVER_URL}/Subscription`



export const createSubscription = async (newSubscription:ISubscription):Promise<IResponse<ISubscription>> => {
    try{
        const url = `${baseUrl}/createSubscriptionPlan`
        const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,newSubscription,config)
        return response.data
    }catch(err){
        throw err
    }

}

export const getSubscription = async():Promise<IResponse<ISubscription>> => {
    try{
        const url = `${baseUrl}/getSubscriptionPlan`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}