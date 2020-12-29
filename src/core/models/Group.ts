import {IChurch} from "core/models/Church"
import {IPerson} from "core/models/Person"

export interface ILeaderPosition {
    leadersPositionID:number;
    position:string;
    description:string;
    churchLeaders:any[];
    societyMembers:any[];
    organMembers:any[];
    zonalMembers:any[];
}

export interface IGroup {
    societyID?:number;
    name:string;
    description:string;
    societyType?:string;
    imageUrl?:string;
    churchId:number;
    memberCount:number;
    isDeleted:boolean;
    denominationId:number;
    groupMember?:IGroupMember[];
}
export interface IGroupMember {
    societyMemberID:string;
    personId:string;
    churchId:number;
    societyId:number;
    positionName:string;
    leaderId:number;
    leadersPosition:ILeaderPosition;
    church:IChurch;
    person:IPerson;
    society:IGroup;
}
export interface ICreateGroupMember {
    societies:number[];
    societyPosition:number[];
    churchId:number;
    personId:string
}