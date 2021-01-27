import React from "react"
import {Link} from "react-router-dom"
import { 
    Flex,Heading,Text, Stack,
     StackDivider, VStack,Skeleton, Wrap, WrapItem } from "@chakra-ui/react"
import {Button} from "components/Button"
import { MediaCard } from "components/Card"
import * as advertService from "core/services/ads.service"
import {setPageTitle} from "store/System/actions"
import {useDispatch} from "react-redux"
import {IAdvert} from "core/models/Advert"
import {MessageType} from "core/enums/MessageType"
import useToast from 'utils/Toast'
import useParams from "utils/params"
import {useInputTextValue} from "utils/InputValue"
import {SearchInput} from "components/Input"
import {createStyles,makeStyles,Theme} from "@material-ui/core/styles"
import axios from "axios"

const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        "& a,button": {
            fontFamily: "MulishRegular"
        },
        "& p":{
            fontFamily:"MulishRegular"
        },
        [theme.breakpoints.up("md")]:{
            marginLeft:theme.spacing(10)
        },
        "& ul":{
            maxHeight:"30rem",
            overflowY:"auto",
            justifyContent:"center",
            [theme.breakpoints.up("sm")]:{
                justifyContent:"flex-start"
            }
        },
        "& > div:nth-child(2)":{
            margin:theme.spacing(3,0)
        },
        "& h2":{
            fontFamily:"MulishRegular"
        },
        "& button":{
            padding:theme.spacing(2.9,5)
        }
    }
}))

const Ads = () => {
    const classes = useStyles()
    const defaultAdvert:IAdvert = {
        title: "",
        dateFrom:"",
        dateTo:"",
        advertUrl: "",  
        churchId:0,
        audience:""  
    }
    const dispatch = useDispatch()
    const params = useParams()
    const [adverts,setAdverts] = React.useState<IAdvert[]>(new Array(7).fill(defaultAdvert))
    const [displayAdvert,setDisplayAdvert] = React.useState<IAdvert[]>([])
    const [inputValue,setInputValue] = useInputTextValue("")
    // const [selectAdvert,setSelectedAdvert] = React.useState<IAdvert>()
    const toast = useToast()
    React.useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        dispatch(setPageTitle("Post Ads"))
        const apiCall = async (churchId:number) => {
            await advertService.getAdverts(churchId,cancelToken).then(payload => {
                setAdverts(payload.data)
            }).catch(err => {
                if(!axios.isCancel(err)){
                    toast({
                        title: "Unable to get Church Advert",
                        subtitle: `Error : ${err}`,
                        messageType: MessageType.ERROR
                    })
                }
            })
        }
        apiCall(Number(params.churchId))
        return () => {
            cancelToken.cancel()
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    
    React.useEffect(() => {
        setDisplayAdvert([...adverts])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[adverts])
    React.useEffect(() => {
        const testString = new RegExp(inputValue,"i")
        const filteredAdvert = adverts.filter(item => testString.test(item.title))
        setDisplayAdvert([...filteredAdvert])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[inputValue])


    // const updateCurrentAdverts = (currentAds:IAdvert,updatedAds?:IAdvert) => {
    //     if(adverts){
    //         const newAdverts = [...(adverts as IAdvert[])]
    //         const foundIdx = adverts.findIndex((item,idx) => item.title === currentAds.title)
    //         if(updatedAds){
    //             newAdverts.splice(foundIdx,1,updatedAds)
    //         }else{
    //             newAdverts.splice(foundIdx,1)
    //         }
    //         setAdverts([...newAdverts])
    //     }
    // }

    // const getAdvert = async (advertId:number) => {
    //     try{
    //         const response = await advertService.getAdvert(advertId)
    //         setSelectedAdvert(response.data)
    //     }catch(err){
    //         toast({
    //             title:"Unable to getAdvert",
    //             subtitle:`Error:${err}`,
    //             messageType:MessageType.ERROR
    //         })
    //     }
    
    // }
    // const editAdvert = async (edittedAdvert:IAdvert) => {
    //     try{
    //         const response = await advertService.editAdvert(edittedAdvert)
    //         updateCurrentAdverts(edittedAdvert,response.data)
    //     }catch(err){
    //         toast({
    //             title:"Unable to update Advert",
    //             subtitle:`Error:${err}`,
    //             messageType:MessageType.ERROR
    //         })
    //     }
    // }
    // const deletedAdvert = async (deleteAdvertId:number) => {
    //     await advertService.deleteAdvert(deleteAdvertId).then(payload => {
    //         updateCurrentAdverts(payload.data)
    //         toast({
    //             title:"Deleted Ads",
    //             subtitle:`Successfully deleted Ads ${payload.data.title}`,
    //             messageType:MessageType.SUCCESS
    //         })
    //     }).catch(err => {
    //         toast({
    //             title:"Unable to deleted Ads",
    //             subtitle:`Error:${err}`,
    //             messageType:MessageType.ERROR
    //         })
    //     })
    // }

    return (
        <VStack spacing={14} p={{ base: "4", md: "0" }} bgColor="bgColor" className={classes.root}
                pl={{ md: "12" }} divider={<StackDivider borderColor="gray.200" />}
                width={["100%", "100%", "93%"]} pt={{ md: "12" }}>
                <Flex mb={[2, 5]} width="100%" align="center">
                    <Link to={`/church/${params.churchId}/ads/create`} >
                        <Button px={4}>
                            Post a new Ad
                        </Button>
                    </Link>
                    <SearchInput ml={{ base: "1rem", md: "3rem" }} value={inputValue}
                     setValue={setInputValue}  width="auto" maxW="23rem" flex={3}
                    />
                </Flex>
                <VStack width="100%">
                    <Stack direction={"column"} mb={[2, 5]} align={["center", "flex-start"]}
                        spacing={5} width="100%">
                        <Heading fontSize="1.88rem" letterSpacing={0}
                            color="primary" fontWeight={400} >
                            Published Adverts
                        </Heading>
                        <Wrap>
                            {displayAdvert.length > 0 ? 
                            adverts.map((item,idx) => (
                                <WrapItem key={item.advertID || idx} >
                                    <Skeleton isLoaded={Boolean(item.advertID)} >
                                        <MediaCard key={item.advertID} title={item.title}
                                        image={item.advertUrl || ""}/>
                                    </Skeleton>
                                </WrapItem>
                            )) : 
                            <Text>No Available Announcement</Text>    
                        }
                        </Wrap>
                    </Stack>
                    <Stack direction={"column"} mb={[2, 5]} align={["center", "flex-start"]}
                        width="100%" spacing={5} >
                        {
                            adverts.length > 0 &&
                            <Heading fontSize="1.88rem" letterSpacing={0}
                                color="primary" fontWeight={400} >
                                Drafts Adverts
                            </Heading>
                        }
                        <Wrap>
                            {adverts.map((item,idx) => (
                                <WrapItem key={item.advertID || idx} >
                                    <Skeleton isLoaded={Boolean(item.advertID)} >
                                        <MediaCard key={item.advertID} title={item.title}
                                            image={item.advertUrl || ""}/>
                                    </Skeleton>
                                </WrapItem>
                            ))}
                        </Wrap>
                    </Stack>

                </VStack>
            </VStack>
    )
}


export default Ads