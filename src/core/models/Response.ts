export interface IResponse<T>{
    status:number;
    isSuccessful:boolean;
    message:string;
    data:T
}