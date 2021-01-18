import {IAdvert} from "core/models/Advert"
import {ToastFunc} from "utils/Toast"
import {MessageType} from "core/enums/MessageType"

const advertLocalStorageKey = "thefaithful-advert-draft"

export const saveAdvertToLocalStorage = (advert:IAdvert,toast:ToastFunc) => {
    if(localStorage.getItem(advertLocalStorageKey)){
        const advertDraft:IAdvert[] = JSON.parse((localStorage.getItem(advertLocalStorageKey) as string))
        if(advertDraft.find((item) => item.title === advert.title)){
                toast({
                    title:`Sermon with title ${advert.title} exists in draft`,
                    subtitle:"",
                    messageType:MessageType.INFO
                })
        }else{
            const newAdvert = [...advertDraft,advert]
            localStorage.setItem(advertLocalStorageKey,JSON.stringify(newAdvert))
                toast({
                    title:`Saved advert ${advert.title}`,
                    subtitle:"",
                    messageType:MessageType.SUCCESS
                })
            }
    }else{
        const advertDraft:IAdvert[] = [advert]
        localStorage.setItem(advertLocalStorageKey,JSON.stringify(advertDraft))
        toast({
            title:`Advert ${advert.title} has been saved`,
            subtitle:"",
            messageType:MessageType.SUCCESS
        })
    }
}

export const getAdvertsFromLocalStorage = () => {
    if(localStorage.getItem(advertLocalStorageKey)){
        return JSON.parse((localStorage.getItem(advertLocalStorageKey) as string))
    }
}

export const getAdvertFromLocalStorage = (title:string,toast?:ToastFunc) => {
    if(localStorage.getItem(advertLocalStorageKey)){
        const advertDraft:IAdvert[] = JSON.parse((localStorage.getItem(advertLocalStorageKey) as string))
        const foundDraft = advertDraft.find((item) => item.title === title)
        return foundDraft
    }else{
        if(toast){
            toast({
                title:`No available Sermon with title ${title}`,
                subtitle:"",
                messageType:MessageType.INFO
            })
        }
    }
}

export const removeAdvertFromLocalStorage = (title:string) => {
    if(localStorage.getItem(advertLocalStorageKey)){
        const advertDraft:IAdvert[] = JSON.parse((localStorage.getItem(advertLocalStorageKey) as string))
        const foundDraft = advertDraft.filter((item) => item.title !== title)
        localStorage.setItem(advertLocalStorageKey,JSON.stringify(foundDraft))       
    }
}