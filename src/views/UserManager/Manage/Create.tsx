import React from "react"
import { useHistory } from "react-router-dom"
import { Heading, HStack, IconButton, VStack } from "@chakra-ui/react"
import { Button } from "components/Button"
import { TextInput } from "components/Input"
import { Formik, FormikProps } from "formik"
import { getStaffByChurch } from "core/services/account.service"
import { IStaff } from "core/models/Staff"
import { createStyles, makeStyles } from "@material-ui/styles"
import { TagContainer } from "components/Input/TagContainer"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { MessageType } from "core/enums/MessageType"
import * as Yup from "yup"
import { IClaim } from "core/models/Claim"
import { assignRoleClaimToUser, createRole, createRoleClaim, getAllClaims } from "core/services/user.service"
import { CreateLayout } from "layouts"
import axios from "axios"
import { BiLeftArrowAlt } from "react-icons/bi"

interface IForm {
    name: string;
    claim: string;
    staff: string;
}


const useStyles = makeStyles((theme) => createStyles({
    root: {
        alignItems: "flex-start !important",
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
        alignSelf: "flex-start",
        marginTop: "auto !important"
    },
    removeInput: {
        "& input": {
            display: "none"
        }
    }
}))

const CreateRole = () => {
    const classes = useStyles()
    const params = useParams()
    const history = useHistory()
    const toast = useToast()

    const [selectedStaff, setSelectedStaff] = React.useState<IStaff[]>([])
    const [initialStaff, setInitialStaff] = React.useState<IStaff[]>([])
    const [allStaff, setAllStaff] = React.useState<IStaff[]>([])

    const [selectedClaim, setSelectedClaim] = React.useState<IClaim[]>([])
    const [initialClaim, setInitialClaim] = React.useState<IClaim[]>([])
    const [allClaim, setAllClaim] = React.useState<IClaim[]>([])

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

    function useReactEffect<T>(state: T, setState: React.Dispatch<React.SetStateAction<T>>) {
        React.useEffect(() => {
            setState(state)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [state])
        return state
    }
    function useFilterState<T>(state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>, changedState: T[]) {
        React.useEffect(() => {
            const newState = state.filter(item => !changedState.includes(item))
            setState(newState)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [changedState])
    }

    function addToSelected<T>(state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) {
        return (
            (newValue: T) => (
                () => {
                    setState([...state, newValue])
                }
            )
        )
    }

    interface extendsString {
        [key: string]: string
    }

    function removeFromSelected<T>(state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>, filterValue: string) {
        return (
            (newValue: T) => (
                () => {
                    const filteredState = [...state]
                    const idx = filteredState.findIndex((item, idx) => (item as unknown as extendsString)[filterValue] === (newValue as unknown as extendsString)[filterValue])
                    filteredState.splice(idx, 1)
                    setState(filteredState)
                }
            )
        )
    }

    useReactEffect(initialStaff, setAllStaff)
    useFilterState(initialStaff, setAllStaff, selectedStaff)
    const addToSelectedStaff = addToSelected(selectedStaff, setSelectedStaff)
    const removeFromSelectedStaff = removeFromSelected(selectedStaff, setSelectedStaff, "staffID")

    useReactEffect(initialClaim, setAllClaim)
    useFilterState(initialClaim, setAllClaim, selectedClaim)
    const addToSelectedClaim = addToSelected(selectedClaim, setSelectedClaim)
    const removeFromSelectedClaim = removeFromSelected(selectedClaim, setSelectedClaim, "id")

    const initialValues = {
        name: "",
        claim: "",
        staff: ""
    }

    const validationSchema = Yup.object({
        name: Yup.string().min(1, "Name is too short ").required()
    })

    const goBack = () => {
        history.goBack()
    }

    const handleSubmit = async (values: IForm, { ...actions }: any) => {
        setTimeout(() => {
            actions.setErrors({})
        }, 1500)
        if (selectedClaim.length <= 0) {
            return actions.setErrors({
                claim: "Please select At least one Claim"
            })
        }
        actions.setSubmitting(true)
        // First Create A role
        const newRole = encodeURI(`roleName=${values.name}&churchId=${params.churchId}`)
        createRole(newRole).then(payload => {
            let claimString = "";
            // eslint-disable-next-line
            selectedClaim.map((item) => {
                claimString += `&claims=${item.claimName}`
            })
            // Adding claims to role via role claim
            const createRoleString = encodeURI(`roleId=${payload.data.id}${claimString}`)
            createRoleClaim(createRoleString).then(() => {
                let staffRequest: any[] = []

                // Adding role to the staff
                // eslint-disable-next-line
                selectedStaff.map((item) => {
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
                                title: `Successfully Added Role to Staff ${selectedStaff[idx].fullname}`,
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

    return (
        <VStack pl={{ base: 2, md: 12 }} pt={{ md: 6 }}
            className={classes.root} >
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
                    {(formikProps: FormikProps<IForm>) => (
                        <>
                            <VStack width="inherit" align="flex-start">
                                <TextInput width="100%" name="name"
                                    placeholder="Role Name" />
                                <VStack spacing={5} width="100%" >
                                    <TagContainer<IClaim, "claimName"> add={addToSelectedClaim}
                                        remove={removeFromSelectedClaim} tags={allClaim}
                                        active={selectedClaim} value="claimDisplayValue" name="Claim"
                                    />
                                    <TextInput name="claim" className={classes.removeInput} />
                                    <TagContainer<IStaff, "fullname"> add={addToSelectedStaff}
                                        remove={removeFromSelectedStaff} tags={allStaff}
                                        active={selectedStaff} value="fullname" name="Staff"
                                    />
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