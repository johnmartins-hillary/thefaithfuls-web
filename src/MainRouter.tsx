import React from "react"
import {Switch,Route} from "react-router-dom"
import {Home} from "views/Home"
import {LoginRole} from "views/LoginRole"
import {AuthForm} from "views/AuthForm"
import {SignupAdmin} from "components/Forms/Signup"
import {PublicRoute} from "components/PublicRoute"
import {DashboardLayout} from "layouts"


const MainRouter = () => {
    return(
        <Switch>
            <PublicRoute path="/church/:churchId" component={DashboardLayout} />
            <Route exact path="/signup/admin" component={SignupAdmin} />
            <Route exact path="/" component={Home} />
            <Route exact path="/signup/role" component={LoginRole} />
            <Route exact path="/reset" component={AuthForm} />
            <Route exact path="/login" component={AuthForm} />
        </Switch>
    )
}

export default MainRouter