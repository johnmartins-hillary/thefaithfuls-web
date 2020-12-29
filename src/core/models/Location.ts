import { IChurch } from "./Church";
import { IDataCaptureSetting } from "./DataCaptureSetting";
import {IPerson} from "./Person"

export interface IState {
    stateID:number;
    name:string;
    countryID:number;
    person:IPerson[];
    city:ICity[];
    church:IChurch;
    country:ICountry;
    dataCaptureSetting:IDataCaptureSetting;
}

export interface ICity {
    cityID:number;
    name:string;
    stateID:number;
    person:IPerson[];
    churchs:IChurch[];
    state:IState
}

export interface ICountry {
    countryID:number;
    sortname:string;
    name:string;
    phoneCode:number;
    persons:IPerson[];
    churchs:IChurch[];
    states:IState[]
}

