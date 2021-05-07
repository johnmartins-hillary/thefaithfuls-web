
const form_key = 'theFaithful-user-form'

export const saveForm = <T>(form:T,key?:string):boolean => {
    localStorage.setItem(key || form_key,JSON.stringify(form))
    if(localStorage.getItem(key || form_key)){
        return true
    }else{
        return false;
    }
}

export const getForm = <T>(key?:string):T | false => {
    if(localStorage.getItem(key || form_key)){
        return JSON.parse((localStorage.getItem(key || form_key) as string))
    }else{
        return false
    }
}
export const clearFormInStorage = (key?:string):boolean => {
    if(localStorage.getItem(key || form_key)){
        localStorage.removeItem(key || form_key)
        return true
    }else{
        return false;
    }
}