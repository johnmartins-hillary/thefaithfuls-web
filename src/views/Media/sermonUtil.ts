import {ISermon} from "core/models/Sermon"
import {ToastFunc} from "utils/Toast"
import {MessageType} from "core/enums/MessageType"

const sermonLocalStorageKey = "thefaithful-sermon-draft"

export const saveSermonToLocalStorage = (sermon:ISermon,toast:ToastFunc) => {
    if(localStorage.getItem(sermonLocalStorageKey)){
        const sermonDraft:ISermon[] = JSON.parse((localStorage.getItem(sermonLocalStorageKey) as string))
        if(sermonDraft.find((item) => item.title === sermon.title)){
                toast({
                    title:`Sermon with title ${sermon.title} exists in draft`,
                    subtitle:"",
                    messageType:MessageType.INFO
                })
        }else{
            const newSermon = [...sermonDraft,sermon]
            localStorage.setItem(sermonLocalStorageKey,JSON.stringify(newSermon))
                toast({
                    title:`Saved sermon ${sermon.title}`,
                    subtitle:"",
                    messageType:MessageType.SUCCESS
                })
            }
    }else{
        const sermonDraft:ISermon[] = [sermon]
        localStorage.setItem(sermonLocalStorageKey,JSON.stringify(sermonDraft))
        toast({
            title:`Sermon ${sermon.title} has been saved`,
            subtitle:"",
            messageType:MessageType.SUCCESS
        })
    }
}

export const getSermonsFromLocalStorage = () => {
    if(localStorage.getItem(sermonLocalStorageKey)){
        return JSON.parse((localStorage.getItem(sermonLocalStorageKey) as string))
    }
}

export const getSermonFromLocalStorage = (title:string,toast?:ToastFunc) => {
    if(localStorage.getItem(sermonLocalStorageKey)){
        const sermonDraft:ISermon[] = JSON.parse((localStorage.getItem(sermonLocalStorageKey) as string))
        const foundDraft = sermonDraft.find((item) => item.title === title)
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

export const removeSermonFromLocalStorage = (title:string) => {
    if(localStorage.getItem(sermonLocalStorageKey)){
        const sermonDraft:ISermon[] = JSON.parse((localStorage.getItem(sermonLocalStorageKey) as string))
        const foundDraft = sermonDraft.filter((item) => item.title !== title)
        localStorage.setItem(sermonLocalStorageKey,JSON.stringify(foundDraft))       
    }
}