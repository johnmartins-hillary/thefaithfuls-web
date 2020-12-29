export interface LoggedInUser {
    id: string;
    auth_token: string;
    fullname: string;
    phoneNumber: number;
    email: string;
    expirationTime: number;
    picture_url:string;
    personType: number;
    callingCode:number;
    churchId: number;
    role:string[]
}