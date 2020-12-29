import React from "react"
import {Box,useDisclosure,Heading} from "@chakra-ui/react"
import {Button} from "components/Button"
// eslint-disable-next-line
import {Formik,FormikValues,FormikProps} from "formik"
import {TextInput} from "components/Input"
import {Dialog} from "components/Dialog"
import {ResetEmail} from "components/Dialog/Dialog"
import * as Yup from "yup"



interface IForm {
    currentPassword:string;
    newPassword:string
}


const ResetPassword = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (
        <>
        <Dialog open={isOpen} close={onClose}>
            <ResetEmail/>
        </Dialog>
            <Heading mt={{md:"-5rem"}} mb={{md:"3rem"}} textAlign={["center", "left"]}>
                Reset Password
            </Heading>        
            <Formik initialValues={{
            currentPassword:"",
            newPassword:""
            }}
                validationSchema={Yup.object({
                    email: Yup.string().email("Email is not valid").required(),
                    })}
                onSubmit={(values: FormikValues, { ...actions }: any) => {
                    console.log(actions)
                    actions.setSubmitting(true)
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        actions.setSubmitting(false);
                        actions.resetForm()
                    }, 1000);
                }}
            >
                {(FormikProps: FormikProps<IForm>) => {
                    return (
                        <Box my={["4"]} width={["90vw", "100%"]} maxWidth="sm" >
                            <TextInput name="email" placeholder="email" />
                            {/* <TextInput name="password" placeholder="Confirm New Password" /> */}
                            <Button disabled={!FormikProps.dirty || !FormikProps.isValid}
                             width={["90vw", "100%"]} onClick={onOpen} my="6">
                                {FormikProps.isValid ? "Send Reset Email" : "Please Fill Form"}
                            </Button>
                        </Box>
                    )
                }}
            </Formik>
        </>
        )
}

export default ResetPassword