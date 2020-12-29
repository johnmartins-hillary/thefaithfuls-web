export interface IChurchForm {
    name: string;
    denominationId:string;
    email: string;
    address:string;
    landmark:string;
    city:string;
    state:string;
    country:string;
    acceptedTerms:boolean;
    phoneNumber: number | null;
    churchMotto:string;
    churchLogo?:string | null;
    priestName?:string;
    priestRole?:string;
    churchId?:number
}
