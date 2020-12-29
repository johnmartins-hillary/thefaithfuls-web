import React from "react"
import {useHistory} from "react-router-dom"
import {useDispatch} from "react-redux"
import {Box,Heading,FormHelperText,FormControl} from "@chakra-ui/react"
import {Button} from "components/Button"
import {useSelector} from "react-redux"
import {AppState} from "store"
// eslint-disable-next-line
import {Formik,FormikProps} from "formik"
import {TextInput} from "components/Input"
import useToast from "utils/Toast"
import {login} from "store/System/actions"
import * as Yup from "yup"


interface IForm {
    phoneNo: string;
    password: string;
}


const Signup = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const isAuthenticated = useSelector((state:AppState) => state.system.isAuthenticated)
    const isLoading = useSelector((state:AppState) => state.system.isLoading)
    const currentUser = useSelector((state:AppState) => state.system.currentUser)
    const toast = useToast()
    const moveToChangePassword = () => {
        history.push("/reset?password")
    }

    const validationScheme = Yup.object({
        password: Yup.string().min(5, "Password is too short").required(),
    })

    const handleSubmit = (values: IForm, actions : any) => {
        actions.setSubmitting(true)
        const loginPromise = Promise.resolve(dispatch(login(values.phoneNo,values.password,toast)
        ))

        loginPromise.then((currentUser:any) => {
            actions.setSubmitting(false)
            if(currentUser){
                history.push(`/church/${currentUser.churchId}/dashboard`)
            }
        })
    }

    React.useEffect(() => {
        if(isAuthenticated){
            history.push(`/church/${currentUser.churchId}/dashboard`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated])


    return (
        <>
        <Heading mb={"6"} textAlign={["center", "left"]}>
            Login
        </Heading>   
        <Formik initialValues={{
            password: "",
            phoneNo: "",
        }}
            validationSchema={validationScheme}
            onSubmit={handleSubmit}
        >
            {(formikProps: FormikProps<IForm>) => {
                return (
                    <Box my={["4"]} width={["90vw", "100%"]} maxWidth="sm" >
                        <TextInput name="phoneNo" placeholder="Phone Number" />
                        <TextInput mt="6" name="password" type="password" placeholder="Password" />
                        <FormControl>
                            <FormHelperText cursor="pointer" mb="3" ml="2" onClick={moveToChangePassword}>
                                Forgot Password
                            </FormHelperText>
                        </FormControl>
                        <Button 
                        disabled={ isLoading || formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                        loadingText={`Login User`}
                         width={["90vw", "100%"]} color="white" maxWidth="sm" isLoading={isLoading}
                          onClick={(formikProps.handleSubmit as any)} backgroundColor="primary" my="3">
                            { formikProps.isValid ? "Login" : "Please Fill Form"}
                        </Button>
                    </Box>
                )
            }}
        </Formik>
        </>
        )
}

export default Signup