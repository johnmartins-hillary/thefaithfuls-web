import React from "react"
import {Route,Redirect,RouteProps} from "react-router-dom"


interface IProps extends RouteProps {
    isAuthenticated:boolean;
    isLoading:boolean;
}


const PrivateRoute:React.FC<IProps> = ({component:Component,isLoading,isAuthenticated,...rest}:any) => {

    return(
        <Route
        {...rest}
        render={() => 
        isLoading ? <div>loading...</div> :
        // isAuthenticated ? (
        true ? (
            <Component/>
        ):(
            <Redirect to={{pathname:"/login"}} />
        )
    }
        />
    )
}


export default PrivateRoute