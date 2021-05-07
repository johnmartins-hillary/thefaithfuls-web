export interface ISubscription {
    subscriptionPlanID?:number;
    name:string;
    category:string;
    features:string;
    cost:number;
    createdAt:Date;
    updatedAt:Date;
    createdBy:Date;
    updatedBy:Date;
    status:number;
    lifetimeDuration:0;
}
export interface SubscriptionByChurch {
    churchId:number;
    duration:number;
    expirationDate:Date;
    isActive:boolean;
    paymentId:null | string;
    startDate:Date;
    subscriptionID:number;
    timeRemaining?:number;
    subscriptionPlan?:ISubscription
}