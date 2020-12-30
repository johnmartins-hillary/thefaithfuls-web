import React from "react"
import {Switch,Route} from "react-router-dom"
import {Home} from "views/Home"
import {LoginRole} from "views/LoginRole"
import {AuthForm} from "views/AuthForm"
import {SignupAdmin} from "components/Forms/Signup"
import {PrivateRoute} from "components/PrivateRoute"
import {DashboardLayout} from "layouts/DashboardLayout"
import {useSelector} from "react-redux"
import {AppState} from "store"


const MainRouter = () => {
    const isAuthenticated = useSelector<AppState>((state) => state.system.isAuthenticated) as boolean
    const isLoading = useSelector<AppState>((state) => state.system.isLoading) as boolean

    return(
        <Switch>
            <PrivateRoute isAuthenticated={isAuthenticated} isLoading={isLoading}
             path="/church/:churchId" component={() => (<DashboardLayout/>)} />
            <Route exact path="/signup/admin" render={() => <SignupAdmin/>} />
            <Route exact path="/" render={() => <Home/>} />
            <Route exact path="/signup/role" render={() => <LoginRole/>} />
            <Route exact path="/reset" render={() => <AuthForm/>} />
            <Route exact path="/login" render={() => <AuthForm/>} />
        </Switch>
    )
}

export default MainRouter