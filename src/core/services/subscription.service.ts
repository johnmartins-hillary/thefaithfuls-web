import axios,{CancelTokenSource} from "axios"
import {IResponse} from "core/models/Response"
import {ISubscription,SubscriptionByChurch} from "core/models/subscription"


const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Subscription`


export const getSubscription = async(cancelToken:CancelTokenSource):Promise<IResponse<ISubscription[]>> => {
    try{
        const url = `${baseUrl}/getSubscriptionPlan`
        const response = await axios.get(url,{
            cancelToken:cancelToken.token
        })
        return response.data
    }catch(err){
        throw err
    }
}
export const getSubscriptionById = async(subscriptionId:string,cancelToken?:CancelTokenSource):Promise<IResponse<ISubscription[]>> => {
    try{
        const url = `${baseUrl}/getSubscriptionById?Id${subscriptionId}`
        const response = await axios.get(url,{
            ...(cancelToken && {cancelToken:cancelToken.token})
        })
        return response.data
    }catch(err){
        throw err
    }
}
export const getSubscriptionByChurchId = async(churchId:string,cancelToken?:CancelTokenSource):Promise<IResponse<SubscriptionByChurch[]>> => {
    try{
        const url = `${baseUrl}/getSubscriptionsByChurchId?churchId=${churchId}`
        const response = await axios.get(url,{
            ...(cancelToken && {cancelToken:cancelToken.token})
        })
        return response.data
    }catch(err){
        throw err
    }
}