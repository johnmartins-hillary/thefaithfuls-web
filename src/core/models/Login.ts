export interface Login {
    username:string;
    password:string;
}

export interface LoginData {
    id:string;
    auth_token:string;
    refreshToken:string;
    fullname:string;
    phoneNumber:string;
    email:string;
    expirationTime:number;
    personType:number;
    callingCode:number;
    churchId:number;
    role:string[]
}