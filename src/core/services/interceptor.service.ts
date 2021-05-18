import axios from "axios";

export const configureAxios = () => {
    axios.interceptors.response.use(
        response => {
            const {data} = response;
            if(data?.status === false && data?.message) throw data.message;
            if(data?.status === false && !data?.data) throw response;
            if(data?.status === false){
                const message = data?.message ?? 'An error occured';
                throw message;
            }
            return response
        },
        error => {
            if(!error) throw Error('There was an error. Please try again later');
            const {response} = error;
            let message: string | null = null;
            if(response){
                const {status,data} = response;
                switch(status){
                    case 404:
                        message = error.message;
                        break;
                    case 400:
                        if(data?.status === false){
                            message = data?.message
                            break;
                        }
                        if(typeof data === 'object'){
                            if(data?.message){
                                message = data?.message;
                                break;
                            }
                            message = data?.data[0]?.message;
                            break;
                        }else if (typeof data === "string"){
                            message = data;
                            break;
                        }
                        break;
                    case 500:
                        message = data?.message ?? data?.Message;
                        break;
                    case 401:
                        message = `User is unauthorized.`;
                        break;
                    default:
                        if(typeof data === "string"){
                            message = data;
                            break
                        }
                        message = data?.Message;
                        break;
                }
            }else{
                message = error.message;
            }
            throw message ?? error;
        }
    )
}