export interface IBank {
    bankID:string;
    bankName:string;
    bankCode:number
}
export interface IChurchBankDetail {
    churchBankId?:number;
    bankCode:string;
    name:string;
    churchId:string;
    accountNumber:string;
    societyId:number;
    defaultAccount:boolean;
    bankName?:string
}
