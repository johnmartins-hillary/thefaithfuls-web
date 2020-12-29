import React from "react"
import {Route,Redirect} from "react-router-dom"
import {useSelector} from "react-redux"
import {AppState} from "store"


const PublicRoute = ({component:Component,...rest}:any) => {
    const isAuthenticated = useSelector<AppState>((state) => state.system.isAuthenticated)
    const isLoading = useSelector<AppState>((state) => state.system.isLoading)

    return(
        <Route
        {...rest}
        render={(props) => 
        isLoading ? <div>loading...</div> :
        isAuthenticated ? (
            <Component {...props} />
        ):(
            <Redirect to={{pathname:"/login"}} />
        )
    }
        />
    )
}


export default PublicRoute