import React from "react"
import { useHistory } from "react-router-dom"
import { Heading, HStack, IconButton, VStack } from "@chakra-ui/react"
import { Button } from "components/Button"
import { TextInput,MaterialSelect } from "components/Input"
import { Formik, FormikProps } from "formik"
import { getStaffByChurch } from "core/services/account.service"
import { IStaff } from "core/models/Staff"
import { createStyles, makeStyles } from "@material-ui/styles"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { MessageType } from "core/enums/MessageType"
import * as Yup from "yup"
import { IClaim } from "core/models/Claim"
import { assignRoleClaimToUser, createRole, createRoleClaim, getAllClaims } from "core/services/user.service"
import { CreateLayout } from "layouts"
import axios from "axios"
import { BiLeftArrowAlt } from "react-icons/bi"


const useStyles = makeStyles((theme) => createStyles({
    root: {
        // "& p,button":{
        //     fontFamily:"MulishRegular"
        // },
        "& > div:first-child":{
            "& svg":{
                fontSize:"2rem"
            }
        }
    },
    inputContainer: {
        backgroundColor: "#F3F3F3",
        minHeight: "60vh",
        overflowX: "hidden",
        paddingBottom: "2rem",
        alignItems: "flex-start !important"
    },
    buttonContainer: {
        alignSelf: "center"
    },
    removeInput: {
        "& input": {
            display: "none"
        }
    }
}))


const initialValues = {
    name: "",
    claimsArr: [] as IClaim[],
    staffArr: [] as IStaff[]
}

type TypeForm = typeof initialValues
const CreateRole = () => {
    const classes = useStyles()
    const params = useParams()
    const history = useHistory()
    const toast = useToast()
    const [initialStaff, setInitialStaff] = React.useState<IStaff[]>([])
    const [initialClaim, setInitialClaim] = React.useState<IClaim[]>([])

    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        const getChurchStaffApi = async () => {
            await getStaffByChurch(Number(params.churchId),cancelToken).then(payload => {
                // setInitialStaff(payload.data)
                const removeStaffWithRole = payload.data.filter(item => item.role === null)
                setInitialStaff(removeStaffWithRole)
            }).catch(err => {
                toast({
                    title: "Unable to get list of staff Members",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.ERROR
                })
            })
        }

        const getRoleClaimApi = async () => {
            await getAllClaims(cancelToken).then(payload => {
                setInitialClaim(payload.data)
            }).catch(err => {
                toast({
                    title: "Unable to get list of Claim",
                    subtitle: `Error: ${err}`,
                    messageType: MessageType.ERROR
                })
            })
        }

        getChurchStaffApi()
        getRoleClaimApi()
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const validationSchema = Yup.object({
        name: Yup.string().min(1, "Name is too short ").required()
    })

    const goBack = () => {
        history.goBack()
    }

    const handleSubmit = async (values: TypeForm, { ...actions }: any) => {
        // actions.setSubmitting(true)
        if (values.claimsArr.length <= 0) {
            setTimeout(() => {
                actions.setErrors({})
            }, 1000)
            // actions.setSubmitting(false)
            return actions.setErrors({
                claim: "Please select At least one Claim"
            })
        }
        // First Create A role
        const newRole = encodeURI(`roleName=${values.name}&churchId=${params.churchId}`)
        createRole(newRole).then(payload => {
            let claimString = "";
            // eslint-disable-next-line
            values.claimsArr.map((item) => {
                claimString += `&claims=${item.claimName}`
            })
            // Adding claims to role via role claim
            const createRoleString = encodeURI(`roleId=${payload.data.id}${claimString}`)
            createRoleClaim(createRoleString).then(() => {
                let staffRequest: any[] = []

                // Adding role to the staff
                // eslint-disable-next-line
                values.staffArr.map((item) => {
                    let roleClaimUserString = "";
                    roleClaimUserString += encodeURI(`roleName=${values.name}&agentUserId=${item.staffID}`

                    )
                    staffRequest.push(assignRoleClaimToUser(roleClaimUserString))
                })
                const resultArr = Promise.allSettled([...staffRequest])
                resultArr.then(value => {
                    // eslint-disable-next-line
                    value.map((item, idx) => {
                        if (item.status === "fulfilled") {
                            toast({
                                title: `Successfully Added Role to Staff ${values.staffArr[idx].fullname}`,
                                subtitle: "",
                                messageType: "success"
                            })
                        } else {
                            toast({
                                title: `Error Unable To Complete Request`,
                                subtitle: `Error:${item.reason}`,
                                messageType: "error"
                            })
                        }
                    })
                }).then(() => {
                    goBack()
                })
            }).catch(err => {
                toast({
                    title: "Unable to Create Add Claim to Role",
                    subtitle: `Error:${err}`,
                    messageType: "error"
                })
            })
        }).catch(err => {
            toast({
                title: "Unable to Create Role",
                subtitle: `Error:${err}`,
                messageType: "error"
            })
        })
    }

    const compareClaim = (option:any, value:any) => {
        return option.id === value.id
    }
    const compareStaff = (option:any, value:any) => {
        return option.staffID === value.staffID
    }

    return (
        <VStack p={{ md: 6 }} pt={["2rem","auto"]} className={classes.root} >
                <HStack>
                    <IconButton aria-label="go-back button" bgColor="transparent"
                    boxSize="2.5rem" onClick={goBack}
                    icon={<BiLeftArrowAlt />} />
                    <Heading textStyle="h4" >
                        Create a Role
                    </Heading>
                </HStack>
            <CreateLayout showCancel={false}>
                <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<TypeForm>) => (
                        <>
                            <VStack width="inherit" align="flex-start">
                                <TextInput width="100%" name="name"
                                    placeholder="Role Name" />
                                <VStack spacing={5} width="100%" >
                                    <MaterialSelect style={{width:"100%"}} name="claimsArr" label="Select all Claim to add to Role" 
                                        getSelected={compareClaim} multiple
                                        options={initialClaim} getLabel={(label:IClaim) => label.claimName}
                                    />
                                    <MaterialSelect style={{width:"100%"}} name="staffArr" label="Invite all Members and groups" 
                                        getSelected={compareStaff} multiple
                                        options={initialStaff} getLabel={(label:IStaff) => label.fullname}
                                    />
                                    <TextInput name="claim" className={classes.removeInput} />
                                    <TextInput name="staff" className={classes.removeInput} />
                                </VStack>
                            </VStack>
                            <HStack className={classes.buttonContainer} spacing={2}>
                                <Button px={12} onClick={(formikProps.handleSubmit as any)}
                                    disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                    isLoading={formikProps.isSubmitting} loadingText="Creating new Role Claim"
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
            </CreateLayout>
        </VStack>
    )
}


export default CreateRole