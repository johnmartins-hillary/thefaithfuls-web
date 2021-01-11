export interface ISubscription {
    subscriptionPlanID?:number;
    name:string;
    category:string;
    features:string;
    cost:number;
    createdAt:Date;
    updatedAt:Date;
    createdBy:string;
    updatedBy:string;
    status:number;
    lifetimeDuration:0
}