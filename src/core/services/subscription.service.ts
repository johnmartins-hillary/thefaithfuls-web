import axios,{CancelTokenSource} from "axios"
import {IResponse} from "core/models/Response"
import {ISubscription} from "core/models/subscription"


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