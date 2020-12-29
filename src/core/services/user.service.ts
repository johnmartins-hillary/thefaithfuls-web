import axios,{AxiosRequestConfig} from "axios"
import {IResponse} from "core/models/Response"
import {Login,LoginData} from "core/models/Login"
import {IClaim} from "core/models/Claim"
import {IRole} from "core/models/Role"

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Auth`

export async function login(username:string,password:string):Promise<IResponse<LoginData>>{
    try{
        const url = `${baseUrl}/userLogin`
        const request:Login ={
            username,
            password
        }
        const headers:AxiosRequestConfig = { headers: { "Access-Control-Allow-Origin": "*" } }
        const response = await axios.post(url,request,headers);
        return response.data;
    }catch(err){
        throw err
    }
}

export async function verifyToken(token:string){
    const url = `${baseUrl}/refreshToken?refreshToken=${encodeURIComponent(token)}`;
    try{
        const response = await axios.get(url);
        return response.data
    }catch(error){
        throw error
    }
}

export async function getAllClaims():Promise<IResponse<IClaim[]>> {
    const url = `${baseUrl}/GetAllClaims`
    try{
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

export async function createRole(arg:string):Promise<IResponse<IRole>> {
    const url = `${baseUrl}/CreateRole?`.concat(arg)
    
    try{
        const response = await axios.post(String(url))
        return response.data
    }catch(err){
        throw err
    }
}
export async function createRoleClaim(arg:string):Promise<IResponse<IRole>> {
    const url = `${baseUrl}/CreateRoleClaim?`.concat(arg)
    try{
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}
export async function assignRoleClaimToUser(arg:string):Promise<IResponse<any>>{
    const url = `${baseUrl}/AssignRoleClaimToUser?`.concat(arg)
    try{
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}

export async function getAllRoleByChurchId(churchId:number):Promise<IResponse<IRole[]>>{
    const url = `${baseUrl}/GetAllRoleByChurchId?churchId=${churchId}`
    try{
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

export async function UpdateRole(arg:string):Promise<IResponse<IRole>> {
    const url = `${baseUrl}/UpdateRole?`.concat(arg)
    try{
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}
export async function deleteRole(arg:string):Promise<IResponse<null>> {
    const url = `${baseUrl}/DeleteRole?`.concat(arg)
    try{
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}

export async function assignClaimToUser(arg:string):Promise<IResponse<null>>{
    const url = `${baseUrl}/AssignClaimToUser`.concat(arg)
    try{
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}

export async function removeClaimFromUser(arg:string):Promise<IResponse<null>>{
    const url = `${baseUrl}/RemoveClaimFromUser`.concat(arg)
    try{
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}

export async function removeRoleFromUser(arg:string):Promise<IResponse<null>> {
    const url = `${baseUrl}/RemoveRoleFromUser`.concat(arg)
    try{
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}

export async function changeRoleClaimOfUser(arg:string):Promise<IResponse<null>>{
    const url = `${baseUrl}/ChangeRoleClaimOfUser`.concat(arg)
    try{
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}
