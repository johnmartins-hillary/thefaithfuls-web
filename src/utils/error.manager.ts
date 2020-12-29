import {AxiosError} from "axios"

export default class {
    static handleApiError(error:AxiosError){
        if(!error)return 'There was an error. Please try again later';
        const {response} = error;
        console.log('error.request ',error.request);
        console.log('error.response',error.response);
        console.log("error.message",error.message);
        console.log("error.config",error.config);
        if(response){
            const {status,data} = response
            switch(status){
                case 404:
                    return error.message;
                case 400:
                    console.log('type of object............',typeof (data));
                    if(typeof data === "object"){
                        if(data?.message){
                            return data?.message;
                        }
                        return data?.data[0]?.message;
                    }else if(typeof data === "string"){
                        return data;
                    }
                    break;
                case 500:
                    return data?.message ? data?.message : data?.Message;
                case 401:
                    return `User is unauthorized`;
                default:
                    if(typeof data === "string") return data;
                    return data?.Message;
            }
        }else{
            return error.message;
        }
    }

    // static displayError(dispatch:Dispatch,error:string){
    //     dispatch(showErrorMessage(error))
    // }
}