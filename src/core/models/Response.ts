export interface IResponse<T>{
    status:number;
    isSuccessful:boolean;
    message:string;
    data:T
}

export interface PaginatedResult<T> {
    currentPage:number;
    pageSize:number;
    records:T[];
    totalPages:number;
    totalRecords:number
}