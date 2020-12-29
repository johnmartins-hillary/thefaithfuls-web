export type TestimonyStatusType = "Approved" | "Pending"  | "Deleted"
export type TestimonyType = "General" | "Thanksgiven"

export interface ITestimony {
    testimonyID?:number;
    testimonyTile:string;
    testimonyDetail:string
    personId:string;
    testimonyType: TestimonyType;
    churchId:number;
    dateEntered:Date;
}