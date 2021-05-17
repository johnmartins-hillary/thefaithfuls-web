import React from "react"
import {
    HStack,Avatar, VStack, Stack,
    Textarea, Text, Box
} from "@chakra-ui/react"
import { Button } from "components/Button"
import NormalInput from "components/Input/Normal"
import { GoBackButton } from "components/GoBackButton"
import { createNewGroup, createGroupMember } from "store/Group/actions"
import { IStaff } from "core/models/Staff"
import { getStaffByChurch } from "core/services/account.service"
import { useDispatch } from "react-redux"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { Formik, Field, FieldProps, FormikProps } from "formik"
import { createStyles, makeStyles } from "@material-ui/styles"
import { MessageType } from "core/enums/MessageType"
import { CreateLayout } from "layouts"
import {MaterialSelect} from "components/Input"
import axios from "axios"
import * as Yup from "yup"


const useStyles = makeStyles((theme) => createStyles({
    root: {
        "& label": {
            display: "flex",
            flexDirection: "column"
        },
        "& button":{
            fontFamily:"MulishRegular"
        }
    },
    formContainer: {
        backgroundColor: "#F3F3F3",
        minHeight: "70vh",
        overflowX: "hidden",
        paddingBottom: "2rem",
        alignItems: "flex-start !important"
    },
    inputContainer: {
        width: "inherit",
        alignItems: "flex-start",
        "& > *:first-child": {
            width: "inherit",
            cursor: "pointer",
            justifyContent: "space-between",
            "& button": {
                fontFamily: "Bahnschrift"
            },
            "& p": {
                fontFamily: "MontserratRegular"
            }
        }
    },
    input: {
        display: "none"
    }
}))

const defaultStaff:IStaff = {
    churchId: 0,
    claim: [],
    email: "",
    fullname: "",
    imageUrl: null,
    lastLogin: "",
    phoneNumber: 0,
    role: null,
    staffID: "",
    status: "",
}


const initialValues = {
    group: "",
    detail: "",
    // member: "",
    groupLeader:defaultStaff,
    groupMember:[] as IStaff[]
}

type FormType = typeof initialValues

const EditGroup = () => {
    const [image, setImage] = React.useState({
        name: "",
        base64: ""
    })
    const dispatch = useDispatch()
    const classes = useStyles()
    const params = useParams()
    const toast = useToast()
    const [initialGroupMember, setInitialGroupMember] = React.useState<IStaff[]>([])
    

    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        const apiStaffCall = async () => {
            await getStaffByChurch(Number(params.churchId), cancelToken).then(payload => {
                setInitialGroupMember(payload.data)
            }).catch(err => {
                if (!axios.isCancel(err)) {
                    toast({
                        title: "Unable to load Church Member",
                        subtitle: `Error:${err}`,
                        messageType: MessageType.ERROR
                    })
                }
            })
        }
        apiStaffCall()
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const validationSchema = Yup.object({
        group: Yup.string().min(3, "Group Name is too short").required()
    })
    const handleSubmit = (values: FormType, { ...actions }: any) => {
        actions.setSubmitting(true)
        const newGroup = {
            name: values.group,
            description: values.detail,
            denominationId: 3,
            churchId: Number(params.churchId),
            memberCount: values.groupMember.length,
            ...(image.base64 && { imageUrl: image.base64 }),
            isDeleted: false
        }
        const addMemberToGroup = (newValues: any, cb: any) => {
            const newMembers = values.groupMember.map((item, idx) => (
                {
                    societies: [newValues.data.societyID!],
                    churchId: Number(params.churchId),
                    societyPosition: [2],
                    personId: (item.staffID as string)
                }
            ))
            const newGroupsMember = [
                {
                    societies: [newValues.data.societyID!],
                    churchId: Number(params.churchId),
                    societyPosition: [1],
                    personId: values.groupLeader.staffID as string
                },
                ...newMembers
            ]
            for (let i = 0; i < newGroupsMember.length; i++) {
                dispatch(createGroupMember(newGroupsMember[i], toast))
            }
            actions.setSubmitting(false)
            if (cb) {
                cb()
            }
        }
        dispatch(createNewGroup(newGroup, toast, addMemberToGroup))
    }
    const handleImageTransformation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setImage({ ...image, base64: (reader.result as string), name: file.name })
            }
            reader.readAsDataURL(file)
        }
    }

    const compareStaff = (option:any, value:any) => {
        return option.fullname === value.fullname
    }


    return (
        <VStack pt={{ md: 6 }}
            className={classes.root} >
            <Text textStyle="styleh5" >
                New Church Group
            </Text>
            <CreateLayout>
                <Stack w="100%" maxW="70rem" align="flex-start">
                    <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {(formikProps: FormikProps<FormType>) => {
                            return(
                                <>
                                    <VStack alignSelf="flex-start" className={classes.inputContainer}>
                                        <VStack>
                                            <Box borderRadius={image.base64 ? "50%" : ""} cursor="pointer" border="2px dashed rgba(0,0,0,.4)" >
                                                <input id="image" type="file" onChange={handleImageTransformation}
                                                    accept="image/jpeg, image/png" style={{ display: "none" }} />
                                                <label htmlFor="image" >
                                                    {
                                                        image.base64 ?
                                                            <Avatar src={image.base64} size="2xl" /> :
                                                            <>
                                                                <Button as="span"
                                                                    bgColor="rgba(0,0,0,.6)">
                                                                    Choose Group Image
                                                            </Button>
                                                                {image.name && <Text>{image.name}</Text>}
                                                            </>
                                                    }
                                                </label>
                                            </Box>
                                        </VStack>
                                        <NormalInput width="100%" name="group" placeholder="Group Name" />
                                        <MaterialSelect style={{width:"100%"}} name="groupLeader" label="Select Group Leader" 
                                            getSelected={compareStaff}
                                            options={initialGroupMember} getLabel={(label:IStaff) => label.fullname}
                                        />
                                        <MaterialSelect style={{width:"100%"}} name="groupMember"
                                            label="Invite Church Members" multiple={true} 
                                            getSelected={compareStaff}
                                            options={initialGroupMember} getLabel={(label:IStaff) => label.fullname}
                                        />
                                        <Field name="detail" >
                                            {({ field }: FieldProps) => (
                                                <Textarea placeholder="Enter description for group"
                                                    rows={7} width="100%" {...field} />
                                            )}
                                        </Field>
                                    </VStack>
                                    <HStack spacing={2} justifyContent="center" width="100%" my={{ base: 5, md: 12 }}>
                                        <Button px={10} disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                            onClick={(formikProps.handleSubmit as any)}
                                            isLoading={formikProps.isSubmitting} loadingText={`Creating New ${formikProps.values.group}`}
                                        >
                                            {formikProps.isSubmitting ? "Creating a new Group" : "Save"}
                                        </Button>
                                        <GoBackButton px={10} disabled={formikProps.isSubmitting} />
                                    </HStack>
                                </>
                            )
                        }}
                    </Formik>
                </Stack>
            </CreateLayout>
        </VStack>
    )
}


export default EditGroup