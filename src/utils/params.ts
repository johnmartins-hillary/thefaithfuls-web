import {useParams} from "react-router-dom"


interface IParams {
    churchId:string;
    roleId:string
}

export default () => {
    const history:IParams = useParams()

    return history
}