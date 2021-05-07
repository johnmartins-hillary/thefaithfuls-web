import {IGroup} from "core/models/Group"


export interface IChurchMember {
    id?:string;
    username: string;
    password: string;
    phoneNumber?: number | null;
    email: string;
    firstname: string;
    lastname: string;
    othername?: string;
    genderID?: number;
    countryID?: number;
    stateID?: number;
    cityID?: number;
    personTypeID?: number;
    dateOfBirth?: Date | string;
    contact_address?: string;
    home_address?: string;
    role?:string[] | string;
    group?: IGroup[];
    groupPosition?:[];
    work_address?: string;
    picture_url?: string;
    dateOfEmployment?: Date;
    claims?: string[];
    enteredBy?: string;
    status?:number;
    zoneId?: number;
    zonalPosition?:number;
    organId?:number;
    organPosition?:number;
    churchId?:number;
    societies?:string[];
    societyPosition?:string[];
    isDataCapture?: boolean;
    document?:string
    // From getchurch member
    personId?:string;
    fullname?:string;
  }
