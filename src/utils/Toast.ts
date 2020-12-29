import {MessageType} from "core/enums/MessageType"
import {useToast} from "@chakra-ui/react"

interface IToastArg {
    title?:string;
    subtitle:string;
    messageType:'success' | 'info' | 'warning' | 'error' | MessageType;
    duration?:number;
    isClosable?:boolean
}

export type ToastFunc = (arg:IToastArg) => void 

const Toast = () => {
    const toast = useToast()
    return (arg:IToastArg) => (
        toast({
            title: arg.title || arg.messageType,
            description:arg.subtitle,
            status: arg.messageType,
            duration: arg.duration || 3000,
            isClosable: arg.isClosable || true 
        })
    )
}


export default Toast