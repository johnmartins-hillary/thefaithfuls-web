import React from "react"
import './App.css'
import {Router} from "react-router-dom"
import MainRouter from "./MainRouter"
import history from "utils/history"
import {useDispatch} from "react-redux";
import {logout,setCurrentUser,hideLoading} from "store/System/actions"
import useToast from "utils/Toast"
import * as userService from "core/services/user.service"
import * as authManager from "utils/auth"

const App = () => {
  const dispatch = useDispatch();
  const toast = useToast()
  const token = authManager.getToken();
  const userDetail = JSON.parse(authManager.getUserDetail() as string)
  // Removed the marker from the app.tsx
  
  React.useEffect(() => {
    if(!token || !userDetail){
      dispatch(hideLoading())
      dispatch(logout())
    }else{
      userService.verifyToken(token).then(payload => {
        if(!payload) dispatch(logout());
        const {auth_token,refreshToken} = payload.data;
        authManager.saveToken(refreshToken)
        const newUserDetail = {
          ...userDetail,
          auth_token
        }
        authManager.saveUserDetail(JSON.stringify(newUserDetail))
        const savedUserDetail = JSON.parse(authManager.getUserDetail() as string)
        dispatch(setCurrentUser(savedUserDetail))
        dispatch(hideLoading())
      }).catch((err) => {
        dispatch(hideLoading())
        toast({
          title:"Please Login Again",
          subtitle:`Error: ${err}`,
          messageType:"info"
        })
        dispatch(logout());
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return(
    <Router history={history} >
      <MainRouter/>
    </Router>
  )
}

export default App