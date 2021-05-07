import React from "react"
import {Button} from "components/Button"
import { useHistory } from "react-router-dom"




interface IProps {
    children?:any;
    disabled:boolean;
    [key:string]:any
}

const GoBackButton:React.FC<IProps> = ({children,disabled,...props}) => {
    const history = useHistory()
    const goBack = () => {
        history.goBack()
    }

    return(
        <Button variant="outline" disabled={disabled} onClick={goBack} {...props} >
            {children ? children : "Close"}
        </Button>
    )
}


export default GoBackButton