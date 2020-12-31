import React from "react"
import {
    Heading,Stack,Icon,
    StackDivider, Flex, Text,Image, HStack,VStack,Wrap,WrapItem,
    FormLabel, ModalBody, ModalCloseButton, ModalContent,
    ModalHeader,Textarea
} from "@chakra-ui/react"
import {Button} from "components/Button"
import { ActivityCard } from "components/Card"
import { FinanceActivity } from "components/Card/ActivityCard/ActivityCard"
import {FinanceSVG} from "assets/images"
import {BsArrowDownLeft,BsArrowUpRight} from "react-icons/bs"
import * as donationService from "core/services/donation.service"
import {getGroupByChurch} from "core/services/group.service"
import {Donation as DonationEnum} from "core/enums/Donation"
import {IDonation} from "core/models/Donation"
import useParams from "utils/params"
import useToast from "utils/Toast"
import {Dialog} from "components/Dialog"
import {useDispatch} from "react-redux"
import {setPageTitle} from "store/System/actions"
import { TextInput,Select,Checkbox } from "components/Input"
import { Formik,FieldProps,Field, FormikProps } from "formik"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import DatePicker from "react-date-picker"
import {createChurchBankDetail,getChurchBankAccount} from "core/services/church.service"
import {IGroup} from "core/models/Group"
import {getBanks} from "core/services/utility.service"
import {IBank,IChurchBankDetail} from "core/models/BankAccount"
import {MessageType} from "core/enums/MessageType"
import * as Yup from "yup"
import { useHistory } from "react-router-dom"
import { useInputTextValue } from "utils/InputValue"
import {SearchInput} from "components/Input"
import {primary} from "theme/palette"
import axios from "axios"


const donationStyles = makeStyles((theme:Theme) => createStyles({
    root:{},
    radioGroupContainer:{
        alignItems:"flex-start !important",
        "& input":{
            marginRight:".5rem"
        }
    },
    dateContainer: {
        alignSelf:"flex-start",
        borderColor: "2px solid black",
        color: "grey",
        marginRight: theme.spacing(2),
        "& > *": {
            padding: ".7rem 1.7rem !important",
            paddingLeft: ".4rem !important",
            borderRadius: "3px",
            "& select": {
                appearance: "none"
            }
        }
    }
}))
const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        "& p":{
            color:"#151C4D"
        },
        "& > div":{
            "& > div":{
                "& h2":{
                    margin:theme.spacing(3,0),
                    fontWeight:500
                }
            }
        },
        "& ul":{
            maxHeight:"30rem",
            overflowY:"auto",
            justifyContent:"center",
            [theme.breakpoints.up("sm")]:{
                justifyContent:"flex-start"
            }
        }
    },
    buttonHolder:{
        "& button:first-child,& button:last-child":{
            textDecoration:"underline",
            margin:theme.spacing(2.75,0),
            fontFamily:"Montserrat",
            opacity:.9,
            fontWeight:400
        },
        "& button:nth-child(2)":{
            padding:theme.spacing(3),
            marginTop:theme.spacing(3)
        }
    },
    buttonContainer:{
        "& button":{
            padding:theme.spacing(3)
        }
    },
    walletContainer:{
        "& h3":{
            fontFamily:"Bahnschrift",
            fontSize:"3rem",
            fontWeight:"700" 
        }
    },
    amountText:{
        color:`${primary} !important`,
        fontWeight:600,
        fontFamily:"Bahnschrift",
        fontSize:"1.9rem"
    }
}))

interface ITransaction {
    withdraw:boolean;
    date:Date;
    title:string;
    amount:number
}

interface IWithdrawAccount {
    amount:number | null;
    account:number;
}

interface IForm {
    donationName:string;
    donationDescription:string;
    expirationDate:Date;
    churchId:number;
    societyId:number;
    donationType:string | DonationEnum;
}

const Transaction:React.FC<ITransaction> = ({withdraw,date,title,amount}) => {
    return(
        <HStack color="#151C4D" fontSize="0.875rem" spacing={3} >
            <Icon bgColor={withdraw ? "red.500" : "green.500"} borderRadius="50%"
             color="white" as={withdraw ? BsArrowUpRight : BsArrowDownLeft} />
            <Text whiteSpace="nowrap" fontFamily="Montserrat" opacity={.8}>
                {date.toLocaleTimeString()}
            </Text>
            <Text fontFamily="Montserrat" opacity={.8}>
                {title}
            </Text>
            <Text fontWeight="700" opacity={.9}>
                ₦{amount}  
            </Text>
        </HStack>
        )
}

interface IAddAccountProps {
    close():void;
    addToBankAccount(arg:IChurchBankDetail):void;
}

const AddAccount:React.FC<IAddAccountProps> = ({close,addToBankAccount}) => {
    const [bankDetails,setBankDetails] = React.useState<IBank[]>([])
    const [churchGroup,setChurchGroups] = React.useState<IGroup[]>([])
    const toast = useToast()
    const params = useParams()

    
    React.useEffect(() => {
        const getBankDetail = () => {
            getBanks().then(payload => {
                setBankDetails(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to Get Bank Details",
                    subtitle:`Error:${err}`,
                    messageType:MessageType.ERROR
                })
            })
        }
        const getChurchGroups = () => {
            getGroupByChurch(params.churchId).then(payload => {
                setChurchGroups(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to Get Church Groups",
                    subtitle:`Error:${err}`,
                    messageType:MessageType.ERROR
                })
            })
        }
        getChurchGroups()
        getBankDetail()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    const initialValues = {
        bankCode:"",
        name:"",
        churchId:params.churchId,
        accountNumber:"",
        societyId:0,
        defaultAccount:false
    }
    const validationSchema = Yup.object({
        name: Yup.string().required(),
        societyId: Yup.number().oneOf(churchGroup.map((item) => item.societyID),
        "Please Select from one of Available Church Groups").required(),
        bankCode: Yup.number().oneOf(bankDetails.map((item) => item.bankCode),
        "Please Select From one the available Banks").required(),
    })
    const handleSubmit = (values: IChurchBankDetail, { ...actions }: any) => {
        createChurchBankDetail(values).then(payload => {
            actions.setSubmitting(false)
            toast({
                title:"Successfully",
                subtitle:"Added Bank Account",
                messageType:MessageType.SUCCESS
            })
            addToBankAccount(payload.data)
            close()
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title:"Unable to Complete Request",
                subtitle:`Error:${err}`,
                messageType:MessageType.ERROR
            })
        })
    }


    return(
        <ModalContent bgColor="#F3F3F3" >
            <ModalHeader color="primary" fontWeight="400" >
                <Heading fontWeight="400" mt="5" textAlign="center" fontSize="1.875rem">
                    Add Account Number
                </Heading>
            </ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalBody display="flex" justifyContent="center" >
                <Flex my="10" direction="column" align="center"
                        flex={1}  maxWidth="lg" >
                    <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        >

                            {(formikProps: FormikProps<IChurchBankDetail>) => (
                                <>
                                    <TextInput width="100%"
                                    name="name" placeholder="Enter Title" />
                                    <TextInput
                                    name="accountNumber" placeholder="Enter Account Number" />
                                    <Select name="societyId" placeholder="Select Group For Account" >
                                        {churchGroup.map((item,idx) => (
                                            <option value={item.societyID} key={item.societyID || idx} >
                                                {item.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <Select name="bankCode" placeholder="Select Account Bank" >
                                        {bankDetails.map((item,idx) => (
                                            <option value={item.bankCode} key={item.bankID || idx} >
                                                {item.bankName}
                                            </option>
                                        ))}
                                    </Select>
                                    <Checkbox name="defaultAccount">
                                        <Text color="primary">
                                            Is This a default Account
                                        </Text>
                                    </Checkbox>
                                    <Button mt={{sm:"5",md:"20"}} minWidth="50%"
                                        onClick={(formikProps.handleSubmit as any)}
                                        disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                        isLoading={formikProps.isSubmitting} loadingText={`Adding new Account to Church`}
                                    >
                                        Add
                                    </Button>
                                </>
                            )}
                    </Formik>
                </Flex>
            </ModalBody>
        </ModalContent>
    )
}

interface IWithdrawAccountProps {
    close():void;
    churchAccount:IChurchBankDetail[]
}

const WithdrawFromAccount:React.FC<IWithdrawAccountProps> = ({close,churchAccount}) => {
    const initialValues = {
        amount: null,
        account:0
    }
    const validationSchema = Yup.object({
        title: Yup.string().required(),
        accountNo: Yup.number().required(),
        bank: Yup.string().required(),
    })
    const handleSubmit = (values: IWithdrawAccount, { ...actions }: any) => {
        console.log(actions)
        actions.setSubmitting(true)
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
            actions.resetForm()
        }, 1000);
    }
    return(
        <ModalContent bgColor="#F3F3F3" >
            <ModalHeader color="primary" fontWeight="400" >
                <Heading fontWeight="400" mt="5" textAlign="center" fontSize="1.875rem">
                    Withdraw from your wallet
                </Heading>
            </ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalBody display="flex" justifyContent="center" >
                <Flex my="10" direction="column" align="center"
                        flex={1}  maxWidth="lg" >
                    <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        >
                            {(formProps: FormikProps<IWithdrawAccount>) => (
                                <>
                                    <TextInput width="100%"
                                    name="amount" placeholder="Enter Amount" />
                                    <Select name="account" placeholder="Select Account" >
                                        {churchAccount.map((item,idx) => (
                                            <option value={item.accountNumber} key={item.churchBankId || idx } >
                                                {item.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <Button mt={{sm:"5",md:"20"}} width="40%" bgColor="primary" color="white" >
                                        Withdraw
                                    </Button>
                                </>
                            )}
                    </Formik>
                </Flex>
            </ModalBody>
        </ModalContent>
    )
}

interface IDonationProps {
    close():void;
    churchAccount:IChurchBankDetail[]
    addToDonation(arg:IDonation):void
}


const Donation:React.FC<IDonationProps> = ({close,addToDonation,churchAccount}) => {
    const classes = donationStyles()
    const currentDate = new Date()
    currentDate.setMonth(currentDate.getMonth()+1)
    const [churchGroup,setGroupChurch] = React.useState<IGroup[]>([])
    const params = useParams()
    const dispatch = useDispatch()
    const toast = useToast()
    
    React.useEffect(() => {
        dispatch(setPageTitle("Church Finance"))
        const apiGroupCall = () => {
            getGroupByChurch(params.churchId).then(payload => {
                setGroupChurch(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to get list of groups for churches",
                    subtitle:`Error: ${err}`,
                    messageType:"error"
                })
            })
        }
        apiGroupCall()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const initialValues = {
        donationType:"Donation",       
        donationName:"",
        donationDescription:"",
        churchId:0,
        expirationDate:currentDate,
        societyId:0,
    }
    const validationSchema = Yup.object({
        donationType:Yup.mixed().oneOf(Object.keys(DonationEnum),
        `You Must Select from one of the Following ${Object.keys(DonationEnum)}`)
        .required(),
        donationDescription:Yup.string().min(5,"Donation description is too short").required(),
        churchId:Yup.number().required(),
        societyId:Yup.number().required()
    })
    
    const handleSubmit = (values: IForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const newDonation:IDonation | any = {
            donationName:values.donationName,
            expirationDate:values.expirationDate,
            donationDescription:values.donationDescription,
            churchID:Number(params.churchId),
            societyId:values.societyId,
            donationType:(values.donationType as DonationEnum)
        }
        donationService.AddDonation(newDonation).then(payload => { 
            actions.setSubmitting(false)
            close()
            addToDonation(payload.data)
            actions.resetForm()
            toast({
                title:"New Donation Added",
                subtitle:`Donation ${newDonation.donationName} has been successfully added`,
                messageType:"success"
            })
        }).catch(err => {
            actions.setSubmitting(false)
                toast({
                    title:"Unable to Added New Donation",
                    subtitle:`Error:${err}`,
                    messageType:"error"
                })
        })
    }

    return(
        <ModalContent bgColor="#F3F3F3" >
            <ModalHeader color="primary" fontWeight="400" >
                <Heading fontWeight="400" mt="5" textAlign="center" fontSize="1.875rem">
                    Set Up Donations
                </Heading>
            </ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalBody display="flex" justifyContent="center" >
                <Flex my="1" direction="column" align="center"
                        flex={1}  maxWidth="lg" >
                    <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        >
                            {(formikProps: FormikProps<IForm>) => {
                                const onChange = (name: string) => (e: Date | any) => {
                                    formikProps.setValues({ ...formikProps.values, [name]: e })
                                }
                                return(
                                    <>
                                        <VStack width="100%" className={classes.radioGroupContainer} >
                                            <FormLabel fontSize="1rem" fontWeight="600">
                                                Select Type
                                            </FormLabel>
                                            <HStack>
                                                <FormLabel>
                                                    <Field type="radio" name="donationType" value="General" />
                                                        General
                                                </FormLabel>
                                                <FormLabel>
                                                    <Field type="radio" name="donationType" value="Seed" />
                                                    Seed
                                                </FormLabel>
                                                <FormLabel>
                                                    <Field type="radio" name="donationType" value="Offering" />
                                                    Offering
                                                </FormLabel>
                                                <FormLabel>
                                                    <Field type="radio" name="donationType" value="Tithe" />
                                                    Tithe
                                                </FormLabel>
                                                {/* <FormLabel>
                                                    <Field type="radio" name="donationType" value="LEVY" />
                                                    Levy
                                                </FormLabel> */}
                                            </HStack>
                                        </VStack>
                                        <TextInput width="100%"
                                        name="donationName" placeholder="Enter Title" />
                                        <TextInput
                                        name="amount" placeholder="Enter Target Amount" />
                                        <Select placeholder="select Account" name="account" >
                                            {churchAccount.map((item,idx) => (
                                                <option key={item.churchBankId} value={item.accountNumber} >
                                                    {item.name}
                                                </option>
                                            ))}                  
                                        </Select>
                                        <Select placeholder="select Group" name="societyId" >
                                            {churchGroup.map((item,idx) => (
                                                <option key={item.societyID} value={item.societyID} >
                                                    {item.name}
                                                </option>
                                            ))}                  
                                        </Select>
                                        <Text my="3" alignSelf="flex-start">
                                            Select Expiration Date For Donation
                                        </Text>
                                        <DatePicker minDetail="month" format="MMM dd,y" calendarIcon={null}
                                            onChange={onChange("expirationDate")} value={formikProps.values.expirationDate}
                                            className={classes.dateContainer} minDate={currentDate} clearIcon={null}
                                        />              
                                        <Field name="donationDescription">
                                            {({field,form}:FieldProps) => (
                                                <Textarea {...field} placeholder="State reason for the donation" mb="2" />    
                                            )}
                                        </Field>
                                        <Button width="40%" onClick={(formikProps.handleSubmit as any)}
                                            disabled={formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}>
                                            {formikProps.isSubmitting ? "Adding a new Donation " : "Add"}
                                        </Button>
                                    </>
                                )
                            }}
                    </Formik>
                </Flex>
            </ModalBody>
        </ModalContent>
    )
}

const Finance = () => {
    const history = useHistory()
    const classes = useStyles()
    const defaultDonation:IDonation = {
        churchID:0,
        donationDescription:"",
        donationName:"",
        donationType:DonationEnum.GROUP_LEVY,
        societyId:0,
        expirationDate:new Date()
    }
    const defaultChurchAccount:IChurchBankDetail = {
        accountNumber:"",
        bankCode:"",
        churchId:"",
        defaultAccount:false,
        name:"",
        societyId:0
    }
    const [open,setOpen] = React.useState(false)
    const [donations,setDonation] = React.useState<IDonation[]>(new Array(4).fill(defaultDonation))
    const [displayDonation,setDisplayDonation] = React.useState<IDonation[]>([])
    const [churchAccount,setChurchAccount] = React.useState<IChurchBankDetail[]>(new Array(10).fill(defaultChurchAccount))
    const [bankDetail,setBankDetail] = React.useState<IBank[]>([])
    const [displayChurchAccount,setDisplayChurchAccount] = React.useState<IChurchBankDetail[]>([])
    const [donationInput,setDonationInput] = useInputTextValue("")
    const [accountInput,setAccountInput] = useInputTextValue("")
    const params = useParams()
    const toast = useToast()
    const [showDialog,setShowDialog] = React.useState("")
    const handleToggle = () => {
        setOpen(!open)
    }
    const handleDonation = (dialog:string) => () => {
        setShowDialog(dialog)
        handleToggle()
    }
    const goToReport = () => {
        history.push(`/church/${params.churchId}/report`)
    }
    const addToDonation = (donation:IDonation) => {
        setDonation([donation,...donations])
    }
    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        const getChurchBankAccountApi = () => {
            getChurchBankAccount(Number(params.churchId),cancelToken).then(payload => {
                getBanks().then(bankPayload => {
                    const newBankAccountDetail = payload.data.map((account) => {
                        const foundBankDetail = bankPayload.data.find(item => String(item.bankCode) === account.bankCode)
                        return({
                            ...account,
                            bankName:foundBankDetail?.bankName
                        })
                    })
                    setBankDetail([...bankPayload.data])
                    setChurchAccount([...newBankAccountDetail])
                })
            }).catch(err => {
                toast({
                    title:"Unable To Get Church Account",
                    subtitle:`Error:${err}`,
                    messageType:MessageType.ERROR
                })
            })
        }
        const getChurchDonationApi = () => {
            donationService.GetDonationByChurch(Number(params.churchId),cancelToken).then(payload =>{ 
                setDonation(payload.data)
            }).catch(err => {
                toast({
                    title:"Unable to Load church donation",
                    subtitle:`Error:${err}`,
                    messageType:"error"
                })
            })
        }
        getChurchBankAccountApi()
        getChurchDonationApi()
        return () => {
            cancelToken.cancel()
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    React.useEffect(() => {
        setDisplayDonation([...donations])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[donations])
    React.useEffect(() => {
        setDisplayChurchAccount([...churchAccount])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[churchAccount])

    const addToBankAccount = (arg:IChurchBankDetail) => {
        const foundBankDetail = bankDetail.find(item => String(item.bankCode) === arg.bankCode)
        const newBankAccount = {
            ...arg,
            bankName:foundBankDetail?.bankName
        }
        setChurchAccount([...churchAccount,newBankAccount])
    }
    React.useEffect(() => {
        const testString = new RegExp(donationInput,"i")
        const newDisplayDonation = donations.filter(item => testString.test(item.donationName))
        setDisplayDonation([...newDisplayDonation])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[donationInput])
    
    React.useEffect(() => {
        const testString = new RegExp(accountInput,"i")
        const newChurchAccount = churchAccount.filter(item => testString.test(item.name))
        setDisplayChurchAccount([...newChurchAccount])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[accountInput])

    

    return (
        <>
        <Flex bgColor="#F9F5F9" p={{base:"4",md:"0"}} pl={{ md: "12" }} className={classes.root}
             direction={{base:"column",md:"row"}}>
                <Stack flex={7} spacing={16}
                 divider={<StackDivider borderColor="gray.200" />}>
                    <Stack width="100%">
                        <Heading fontWeight="400" color="primary" >
                            Accounts
                        </Heading>
                        <Flex my={3} className={classes.buttonContainer}>
                            <Button onClick={handleDonation("Bank")}>
                                Add Bank Account
                            </Button>
                            <SearchInput maxW="22.5rem" flex={1} value={accountInput} setValue={setAccountInput}
                                ml="5" 
                            />
                        </Flex>
                        <Wrap>
                        {displayChurchAccount.length > 0 ?
                        displayChurchAccount.map((item,idx) => (
                            <WrapItem key={item.churchBankId || idx} >
                                <ActivityCard>
                                <FinanceActivity isLoaded={Boolean(item.churchBankId)}
                                    heading={item.name}
                                    subHeading={`Account Number: ${item.accountNumber}`}
                                    text={`Bank:${item.bankName}`} />
                            </ActivityCard>
                            </WrapItem>
                        )): 
                        <Text>
                            No Church Account Available
                        </Text>
                        }
                        </Wrap>
                    </Stack>
                    <Stack width="100%">
                        <Heading fontWeight="400" color="primary" >
                            Donations
                        </Heading>
                        <Flex my={3} className={classes.buttonContainer}>
                            <Button onClick={handleDonation("Donation")}>
                                Set up Donations
                            </Button>
                            <SearchInput maxW="22.5rem" flex={1}  ml="5" value={donationInput} setValue={setDonationInput}
                            />
                        </Flex>
                        <Wrap>
                        {
                            displayDonation.length > 0 ?
                            displayDonation.map((item,idx) => (
                                <WrapItem key={item.donationID || idx} >
                                    <ActivityCard>
                                    <FinanceActivity isLoaded={Boolean(item.donationID)}
                                        text={item.donationDescription} 
                                        subHeading={item.donationType}
                                        moreHeading={(new Date(item.expirationDate)).toLocaleDateString()}
                                        heading={item.donationName} />
                                </ActivityCard>
                                </WrapItem>
                            )):
                            <Text>
                                No Available Donation
                            </Text>
                        }
                        </Wrap>
                    </Stack>
                </Stack>
                <Stack zIndex={1000} pt={10} maxWidth={{md:"24rem"}} width="100%"
                 pl={10} flex={3} ml={{md:4}} align="center" bgColor="white" mt={{base:"3",md:"0"}}
                    borderRadius="10px" shadow=" 0px 5px 20px #0000001A"
                    divider={<StackDivider borderColor="gray.200" />}>
                    <Stack width="100%" align="center" className={classes.walletContainer}>
                        <Image w="9.63rem" src={FinanceSVG} />
                        <Heading color="primary" as="h3" > 
                            Wallet
                        </Heading>
                        <Stack alignSelf="flex-start">
                            <Text fontWeight="600" fontSize="1.125rem" >
                                Amount
                            </Text>
                            <Text className={classes.amountText}>
                                ₦20,000
                            </Text>
                        </Stack>
                    </Stack>
                    <Stack flex={1} width="100%" maxHeight="23rem">
                        <Heading as="h6" fontSize="1.125rem"
                        color="tertiary"
                        >
                            Recent Transactions
                        </Heading>
                        <Stack maxHeight="18rem" overflowY="scroll" >
                            <Transaction title="Offering" amount={2000}
                             date={new Date()} withdraw={false} />
                            <Transaction title="Offering" amount={2000}
                             date={new Date()} withdraw={true} />
                            <Transaction title="Offering" amount={2000}
                             date={new Date()} withdraw={true} />
                            <Transaction title="Offering" amount={2000}
                             date={new Date()} withdraw={true} />
                            <Transaction title="Offering" amount={2000}
                             date={new Date()} withdraw={false} />
                            <Transaction title="Offering" amount={2000}
                             date={new Date()} withdraw={false} />
                            <Transaction title="Offering" amount={2000}
                             date={new Date()} withdraw={false} />
                            <Transaction title="Offering" amount={2000}
                             date={new Date()} withdraw={false} />
                            <Transaction title="Offering" amount={2000}
                             date={new Date()} withdraw={false} />
                        </Stack>
                    </Stack>
                        <Flex direction="column" my="5" className={classes.buttonHolder} >
                            <Button variant="link"
                            onClick={goToReport} color="tertiary">
                                View Transaction History
                            </Button>
                            <Button onClick={handleDonation("Withdraw")}>
                                Withdraw
                            </Button>
                            <Button variant="link"
                            color="tertiary">
                                Withdraw settings
                            </Button>
                        </Flex>
                </Stack>
            </Flex>
        <Dialog open={open} size="2xl" close={handleToggle}>
            {showDialog === "Bank" ? <AddAccount addToBankAccount={addToBankAccount} close={handleToggle} />:
            showDialog === "Donation" ? <Donation churchAccount={churchAccount} addToDonation={addToDonation}
             close={handleToggle} /> : <WithdrawFromAccount churchAccount={churchAccount}  close={handleToggle} /> 
            }
        </Dialog>
        </>
    )
}

export default Finance