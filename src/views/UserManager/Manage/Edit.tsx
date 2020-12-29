import React from "react"
import { useHistory } from "react-router-dom"
import { Heading, HStack, VStack } from "@chakra-ui/react"
import { Button } from "components/Button"
import { TextInput } from "components/Input"
import { Formik, FormikProps } from "formik"
import { createStyles, makeStyles } from "@material-ui/styles"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { MessageType } from "core/enums/MessageType"
import * as Yup from "yup"
import * as userService from "core/services/user.service"
import { IRole } from "core/models/Role"
import { CreateLayout } from "layouts"

interface IForm {
    name: string;
    newName: string;
}


const useStyles = makeStyles((theme) => createStyles({
    root: {
        alignItems: "flex-start !important"
    },
    inputContainer: {
        backgroundColor: "#F3F3F3",
        minHeight: "60vh",
        overflowX: "hidden",
        paddingBottom: "2rem",
        alignItems: "flex-start !important"
    },
    buttonContainer: {
        alignSelf: "flex-start",
        marginTop: "auto !important"
    },
    removeInput: {
        "& input": {
            display: "none"
        }
    }
}))

const EditRole = () => {
    const classes = useStyles()
    const params = useParams()
    const history = useHistory()
    const toast = useToast()
    const [churchRole, setChurchRole] = React.useState<IRole>()
    const [apiCalled, setApiCalled] = React.useState(false)
    React.useEffect(() => {
        const getChurchRoles = () => {
            userService.getAllRoleByChurchId(Number(params.churchId)).then(payload => {
                const foundRole = payload.data.find((item) => item.id === params.roleId)
                if (foundRole) {
                    setChurchRole(foundRole)
                    setApiCalled(true)
                } else {
                    history.goBack()
                }
            }).catch(err => {
                toast({
                    title: "Unable to Get Role",
                    subtitle: `Error:${err}`,
                    messageType: "error"
                })
            })
        }
        getChurchRoles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const validationSchema = Yup.object({
        name: Yup.string().min(1, "Name is too short ").required(),
        newName: Yup.string().min(1, "new Name is too short ").required(),
    })

    const goBack = () => {
        history.goBack()
    }

    const handleSubmit = async (values: IForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const encodeUpdateRole = encodeURI(`churchId=${params.churchId}&rolename=${values.name}&newrolename=${values.newName}`)
        userService.UpdateRole(encodeUpdateRole).then(payload => {
            actions.setSubmitting(false)
            toast({
                title: "Successfully Updated Role",
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
            history.goBack()
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to Complete Request",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }


    return (
        <VStack pl={{ base: 2, md: 12 }} pt={{ md: 6 }}
            className={classes.root} >
            <Heading textStyle="h4" >
                Create a Role
                </Heading>
            <CreateLayout>
                <VStack flex={1} width="100%">
                    {apiCalled &&
                        <Formik initialValues={{
                            name: churchRole!.name,
                            newName: ""
                        }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {(formikProps: FormikProps<IForm>) => (
                                <>
                                    <VStack width="inherit" align="flex-start" >a
                                        <TextInput width="100%" name="name"
                                            placeholder="Role Name" />
                                        <TextInput width="100%" name="newName"
                                            placeholder="Input New Role Name" />
                                    </VStack>
                                    <HStack className={classes.buttonContainer} spacing={2}>
                                        <Button px={12} onClick={(formikProps.handleSubmit as any)}
                                            disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                            isLoading={formikProps.isSubmitting} loadingText="Updating New Role"
                                        >
                                            Save
                                        </Button>
                                        <Button px={12} variant="outline" onClick={goBack}
                                            isDisabled={formikProps.isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                    </HStack>
                                </>
                            )
                            }
                        </Formik>

                    }
                </VStack>

            </CreateLayout>
        </VStack>
    )
}


export default EditRole