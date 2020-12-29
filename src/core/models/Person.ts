import { ICountry, ICity, IState } from "./Location";

export interface IPerson {
    firstname:string;
    lastname:string;
    othername:string;
    dateOfBirth:Date;
    genderID:number;
    countryID:number;
    stateID:number;
    cityID:number;
    personTypeID:number;
    contact_address:string;
    home_address:string;
    lga:string;
    work_address:string;
    picture_url:string;
    fcmToken:string;
    refreshToken:string;
    enteredBy:string;
    fullname:string;
    id:string;
    userName:string;
    normalizedUserName:string;
    email:string;
    normalizedEmail:string;
    emailConfirmed:boolean
    passwordHash:string;
    securityStamp:string;
    concurrencyStamp:string;
    phoneNumber:string;
    phoneNumberConfirmed:boolean;
    twoFactorEnabled:boolean;
    lockoutEnd:Date;
    lockoutEnabled:boolean;
    accessFailedCount:number;
    country:ICountry;
    gender:[{
        genderID:number;
        name:string;
        persons:IPerson
    }];
    city:ICity;
    state:IState;

}
