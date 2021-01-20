import React from "react"
import {
    Heading, HStack, Avatar, VStack, Stack,
    Textarea, Text, Box
} from "@chakra-ui/react"
import { Button } from "components/Button"
import NormalInput from "components/Input/Normal"
import { GoBackButton } from "components/GoBackButton"
import { createNewGroup,createGroupMember } from "store/Group/actions"
import {IGroup} from "core/models/Group"
import { IStaff } from "core/models/Staff"
import { getStaffByChurch } from "core/services/account.service"
import { useDispatch } from "react-redux"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { Formik, Field, FieldProps, FormikProps } from "formik"
import { createStyles, makeStyles } from "@material-ui/styles"
import { MessageType } from "core/enums/MessageType"
import { CreateLayout } from "layouts"
import { TagContainer } from "components/Input/TagContainer"
import axios from "axios"
import * as Yup from "yup"

interface IForm {
    group: string;
    detail: string;
    member: string;
}

const useStyles = makeStyles((theme) => createStyles({
    root: {
        "& label":{
            display:"flex",
            flexDirection:"column"
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

const Create = () => {
    const [image, setImage] = React.useState({
        name: "",
        base64: ""
    })
    const dispatch = useDispatch()
    const classes = useStyles()
    const params = useParams()
    const toast = useToast()
    const [initialGroupMember, setInitialGroupMember] = React.useState<IStaff[]>([])
    const [selectedMember, setSelectedMember] = React.useState<IStaff[]>([])
    const [allGroupMember, setAllGroupMember] = React.useState<IStaff[]>([])

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

    React.useEffect(() => {
        setAllGroupMember(initialGroupMember)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialGroupMember])

    React.useEffect(() => {
        const newAllGroupMember = initialGroupMember?.filter((item, idx) =>
            !selectedMember.includes(item))
        setAllGroupMember(newAllGroupMember)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMember])

    const addToSelectedMember = (e: IStaff) => () => {
        setSelectedMember([...selectedMember, e])
    }
    const removeSelectedMember = (e: IStaff) => () => {
        const filteredMember = [...selectedMember]
        const idx = filteredMember.findIndex((item, idx) => item.fullname === e.fullname)
        filteredMember.splice(idx, 1)
        setSelectedMember(filteredMember)
    }
    const initialValues = {
        group: "",
        detail: "",
        member: ""
    }

    const validationSchema = Yup.object({
        group: Yup.string().min(3, "Group Name is too short").required()
    })
    const handleSubmit = (values: IForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const newGroup = {
            name: values.group,
            description: values.detail,
            denominationId: 3,
            churchId: Number(params.churchId),
            memberCount: selectedMember.length,
            ...(image.base64 && { imageUrl: image.base64 }),
            isDeleted: false
        }
        const addMemberToGroup = (values:any,cb:any) => {
            console.log("this is the returned value",values)
            const newGroupsMember = selectedMember.map((item,idx) => (
                {
                    societies:[values.data.societyID!],
                    churchId:Number(params.churchId),
                    societyPosition:[2],
                    personId:(item.staffID as string)
                    }
            ))
            for(let i= 0; i < newGroupsMember.length; i++){
                dispatch(createGroupMember(newGroupsMember[i],toast))    
            }
            actions.setSubmitting(false)
            if(cb){
                cb()
            }
        }
        dispatch(createNewGroup(newGroup, toast,addMemberToGroup ))
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


    return (
        <VStack pt={{ md: 6 }}
            className={classes.root} >
            <Heading textStyle="h4" >
                New Church Group
                </Heading>
            <CreateLayout>
                <Stack w="100%" maxW="70rem" align="flex-start">
                    <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {(formikProps: FormikProps<IForm>) => (
                            <>
                                <VStack alignSelf="flex-start" className={classes.inputContainer}>
                                    <VStack>
                                        {
                                            image.base64 &&
                                            <Avatar src={image.base64} size="2xl" />
                                        }
                                        <Box cursor="pointer" border="2px dashed rgba(0,0,0,.4)" >
                                            <input id="image" type="file" onChange={handleImageTransformation}
                                                accept="image/jpeg, image/png" style={{ display: "none" }} />
                                            <label htmlFor="image" >
                                                <Button as="span"
                                                    bgColor="rgba(0,0,0,.6)">
                                                    Choose Group Image
                                                        </Button>
                                                {image.name && <Text>{image.name}</Text>}
                                            </label>
                                        </Box>
                                    </VStack>
                                    <NormalInput width="100%" name="group" placeholder="Group Name" />
                                    <TagContainer<IStaff, "fullname" > add={addToSelectedMember}
                                        remove={removeSelectedMember} active={selectedMember} value="fullname"
                                        name="Invite Members" tags={(allGroupMember as IStaff[])} />
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
                        )}
                    </Formik>
                </Stack>
            </CreateLayout>
        </VStack>
    )
}


export default Create