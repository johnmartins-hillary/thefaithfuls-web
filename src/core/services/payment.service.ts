import axios,{AxiosRequestConfig} from "axios"
import {Payment} from "core/models/Payment"
import {IResponse} from "core/models/Response"

const baseUrl = `${process.env.SERVER_URL}/Payment`;

export const generateReference = async (arg:Payment):Promise<IResponse<Payment>> => {
    try{
        const url = `${baseUrl}/generateReference`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}