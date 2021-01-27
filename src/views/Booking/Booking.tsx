import React from "react"
import {
    Tabs, Flex, Tab, TabList, TabPanel, Textarea,
    TabPanels, HStack, SimpleGrid, ModalFooter, ModalHeader,
    ModalBody, ModalCloseButton, ModalContent, Text
} from "@chakra-ui/react"
import { Button } from "components/Button"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { Dialog } from "components/Dialog"
import useParams from "utils/params"
import useToast, { ToastFunc } from "utils/Toast"
import { DetailCard } from "components/Card"
import { setPageTitle } from "store/System/actions"
import { useDispatch, useSelector } from "react-redux"
import { ITestimony, TestimonyStatusType } from "core/models/Testimony"
import { getTestimony, ChangeTestimonyStatus, CommentOnTestimony } from "core/services/prayer.service"
import { MessageType } from "core/enums/MessageType"
import { Formik, Field, FieldProps, FormikProps } from "formik"
import { AppState } from "store"
import * as Yup from "yup"
import axios from "axios"
import {NoContent} from "components/NoContent"

const useStyles = makeStyles((theme) => {
    return (
        createStyles({
            root: {
                "& button,p":{
                    fontFamily:"MulishRegular"
                },
                "& > div": {
                    [theme.breakpoints.up("sm")]: {
                        width: "95%",
                    },
                    "& > div:first-child": {
                        borderBottom: "1px solid #E0DEE6",
                        overflow: "auto",
                        [theme.breakpoints.up("sm")]: {
                            paddingRight: "15%",
                            marginLeft: "3%",
                            width: "97%",
                            marginRight: "10%"
                        }
                    }
                }
            },
            reportCard: {
                "& > p": {
                    marginTop: "0px !important"
                }
            },
            tabContainer: {
                "& > div": {
                    width: "100%"
                },
                "& > *:last-child": {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    "& > button": {
                        margin: "1.5rem 0"
                    },
                    "& > div:last-child": {
                        width: "100%"
                    }
                }
            },
            prayerContainer: {
                "& > *": {
                    shadow: "5px 0px 6px #0000001A",
                    backgroundColor: "white",
                    padding: "1rem",
                    borderRadius: "6px",
                    alignItems: "flex-start !important"
                }
            },
            prayerMainContainer: {
                paddingTop: "4rem !important",
                "& > button": {
                    marginLeft: "50%",
                    marginBottom: "3rem",
                    fontWeight: "400",
                    transform: "translateX(-50%)"
                },
                "& > div:nth-child(2)": {
                    alignItems: "flex-start !important",
                    width: "100%",
                    "& > p": {
                        marginLeft: ".75rem"
                    },
                    "& > div": {
                        width: "100%"
                    }
                }
            }
        })
    )
})

const selected = {
    bgColor: "#F2DCF4",
    color: "primary",
    shadow: "5px 0px 6px #0000001A",
    marginBottom: "0"
}

interface IReviewBooking {
    handleReject(comment: string): void
    close():void
}

export const ReviewBooking: React.FC<IReviewBooking> = ({ handleReject,close }) => {
    interface IReviewForm {
        reason: string
    }
    const initialValue = {
        reason: ""
    }
    const handleSubmit = (values: IReviewForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        handleReject(values.reason)
        close()
    }
    const validationSchema = Yup.object({
        reason: Yup.string().min(3, "Reason for rejecting is too short").required()
    })
    return (
        <ModalContent alignItems="center" bgColor="bgColor2" py={5} >
            <ModalHeader textAlign="center" mt={5} mb={6} color="primary">
                Reason for Rejecting
            </ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <Formik
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                initialValues={initialValue}
            >
                {(formikProps: FormikProps<IReviewForm>) => (
                    <>
                        <ModalBody maxW="md" width="75%" >
                            <Field name="reason" >
                                {({ field }: FieldProps) => (
                                    <Textarea rows={7} width="100%" placeholder="Enter details for this Event" {...field} />
                                )}
                            </Field>
                        </ModalBody>
                        <ModalFooter justifyContent="center">
                            <Button px="12"
                            disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                            onClick={(formikProps.handleSubmit as any)}>
                                Proceed
                        </Button>
                        </ModalFooter>
                    </>
                )}
            </Formik>
        </ModalContent>
    )
}




const Booking = () => {
    const defaultTestimony: ITestimony = {
        churchId: 0,
        dateEntered: new Date(),
        personId: "",
        testimonyTile: "",
        testimonyType: "General",
        testimonyDetail: ""
    }
    const currentUser = useSelector((state: AppState) => state.system.currentUser)
    const classes = useStyles()
    const dispatch = useDispatch()
    const params = useParams()
    const [open, setOpen] = React.useState(false)
    const toast = useToast()
    const [churchTestimony, setChurchTestimony] = React.useState<ITestimony[]>(new Array(10).fill(defaultTestimony))
    const [currentTestimony, setCurrentTestimony] = React.useState<ITestimony>(defaultTestimony)
    const [tabIndex, setTabIndex] = React.useState(0)
    const handleTabChange = (event: number) => {
        setTabIndex(event)
    }
    const handleToggle = (arg: ITestimony) => () => {
        setOpen(!open)
        setCurrentTestimony(arg)
    }
    const cancelToken = axios.CancelToken.source()

    
    const getChurchTestimony = () => {
        getTestimony({ churchId: Number(params.churchId), testimonyType: "Thanksgiven" },cancelToken).then(payload => {
            setChurchTestimony(payload.data)
        }).catch(err => {
            if(!axios.isCancel(err)){
                toast({
                    title: "Unable to get Church Testimony",
                    subtitle: `Error:${err}`,
                    messageType: MessageType.ERROR
                })
            }
        })
    }

    React.useEffect(() => {
        dispatch(setPageTitle("Booking/Request"))
        getChurchTestimony()
        return () => {
            cancelToken.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateTestimonyStatus = (arg: TestimonyStatusType, toast: ToastFunc) => (testimonyId: number) => {
        ChangeTestimonyStatus({ testimonyId, testimonyStatus: arg }).then(() => {
            getChurchTestimony()
            toast({
                title: "Testimony updated Successfully",
                subtitle: "",
                messageType: MessageType.SUCCESS
            })
        }).catch(err => {
            toast({
                title: "Something went wrong",
                subtitle: `Error:${err}`,
                messageType: MessageType.ERROR
            })
        })
    }

    const approveTestimony = (testimonyId: number) => () => {
        updateTestimonyStatus("Approved", toast)(testimonyId)
    }

    const rejectTestimony = (personId: string, testimonyId: number) => (comment: string) => {
        CommentOnTestimony({ comment, personId, testimonyId }).then(() => {
            updateTestimonyStatus("Deleted", toast)(testimonyId)
        }).catch(err => {
            toast({
                title:"something went wrong",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        })
    }




    return (
        <>
            <Flex className={classes.root} p={{ base: "4", md: "0" }}
                pl={{ md: "12" }} pt={{ md: "12" }} direction={{ base: "column", md: "row" }}>
                <Tabs index={tabIndex} onChange={handleTabChange} >
                    <TabList width="100%">
                        <Tab whiteSpace="nowrap" flex={1}
                            px={["2", "10"]} marginBottom=".2px" py="4" _selected={{ ...selected }}
                            borderRadius="10px 10px 0px 0px"
                            color="#151C4D" bgColor="#E0DEE6">
                            Thanks Giving
                        </Tab>
                    </TabList>
                    <TabPanels mb={{ base: "5rem", md: "10rem" }}
                        className={classes.tabContainer}>
                        <TabPanel mt="3">
                            <SimpleGrid minChildWidth="17.5rem" alignItems={{ base: "center", md: "flex-start" }} gridGap="1.5rem" className={classes.prayerContainer}>
                                {churchTestimony.length > 0 && churchTestimony.map((item, idx) => (
                                    <DetailCard title="Bismark Achodo" key={item.testimonyID || idx} timing="2d"
                                        image="https://bit.ly/ryan-florence"
                                        subtitle={item.testimonyTile} isLoaded={Boolean(item.testimonyID)}
                                        smallText={(new Date(item.dateEntered)).toLocaleDateString()}
                                        body={item.testimonyDetail}
                                    >
                                        <HStack width="100%">
                                            <Button mr="4" variant="link" onClick={approveTestimony(item.testimonyID as number)} textDecoration="underline" >
                                                Approve
                                        </Button>
                                            <Button variant="link" textDecoration="underline"
                                                onClick={handleToggle(item)} color="tertiary"
                                            >
                                                Reject
                                        </Button>
                                        </HStack>
                                    </DetailCard>
                                ))}
                            </SimpleGrid>
                            {churchTestimony.length <= 0 && 
                        <NoContent align={false} >
                        <Text>
                            No Church Testimony is Available
                        </Text>
                    </NoContent>}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
            <Dialog open={open} size="xl" close={handleToggle}>
                <ReviewBooking close={() => setOpen(false)}
                 handleReject={rejectTestimony(currentUser.id, currentTestimony.testimonyID as number)} />
            </Dialog>
        </>
    )
}

export default Booking