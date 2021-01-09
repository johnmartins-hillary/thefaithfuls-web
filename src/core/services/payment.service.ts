import axios,{AxiosRequestConfig,CancelTokenSource} from "axios"
import {Payment,PaymentResponse} from "core/models/Payment"
import {IResponse} from "core/models/Response"
import {Payment as PaymentEnum} from "core/enums/Payment"

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Payment`;

export const generateReference = async (arg:Payment,cancelToken:CancelTokenSource):Promise<IResponse<PaymentResponse>> => {
    try{
        const url = `${baseUrl}/generateReference?paymentGatewayType=${arg.paymentGatewayType}&amount=${arg.amount}&organizationType=${arg.organizationType}${arg.societyId ? `&societyId=${arg.societyId}` : ""}`
        const response = await axios.get(url,{
            cancelToken:cancelToken.token
        })
        return response.data
    }catch(err){
        throw err
    }
}

export const verifyTransaction = async (paymentGateWay:PaymentEnum,ref:string):Promise<IResponse<any>> => {
    const url = `${baseUrl}/VerifyTransaction?paymentGatewayType=${paymentGateWay}&referenceCode=${ref}`
    try{
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}