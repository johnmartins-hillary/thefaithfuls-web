import React from "react"
import { Link } from "react-router-dom"
import {
    Flex, IconButton, VStack, StackDivider,
    Text, Skeleton,Stack, Heading, Icon,
    ModalBody, ModalCloseButton, ModalContent, Wrap,
    ModalHeader,HStack, WrapItem
} from "@chakra-ui/react"
import { Slide } from "@material-ui/core"
import { Button } from "components/Button"
import { MdFileUpload } from "react-icons/md"
import { BsCameraVideoFill } from "react-icons/bs"
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles"
import { setPageTitle } from "store/System/actions"
import { useDispatch } from "react-redux"
import useToast from "utils/Toast"
import useParams from "utils/params"
import { ISermon } from "core/models/Sermon"
import * as sermonService from "core/services/sermon.service"
import * as sermonDraftHelper from "./sermonUtil"
import { DashboardActivity } from "components/Card/ActivityCard/ActivityCard"
import { MessageType } from "core/enums/MessageType"
import { MediaCard } from "components/Card"
import { Dialog } from "components/Dialog"
import { bgColor2 } from "theme/palette"
import { useDropzone } from "react-dropzone"
import { Formik, FormikProps} from "formik"
import { TextInput, DatePicker,SearchInput } from "components/Input"
import { FaRegPlayCircle, FaRegPauseCircle } from "react-icons/fa"
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi"
import {Media as MediaWrapper,Player} from "react-media-player"
import { GiCancel } from "react-icons/gi"
import {withMediaProps} from "react-media-player"
import ReactHowler from "react-howler"
import * as Yup from "yup"

const useStyles = makeStyles((theme) => createStyles({
    root: {
        "& ul":{
            height:"30rem",
            overflowY:"auto",
            justifyContent:"center",
            [theme.breakpoints.up("sm")]:{
                justifyContent:"flex-start"
            }
        }
    }
}))

const mediaDialogStyles = makeStyles((theme) => createStyles({
    root: {},
    input: {
        display: 'none'
    }
}))

interface Upload {
    name: string,
    file: null | File
}

interface IFile {
    video: Upload;
    audio: Upload
}

interface IForm {
    title: string;
    author: string;
    featureDateTo: Date;
    featureDateFrom: Date;
    authorDesignation: string;
}

interface IMediaDialogProps {
    close(): void;
    updateSermon(arg: ISermon): void;
}

const MediaDialog: React.FC<IMediaDialogProps> = ({ close, updateSermon }) => {
    const defaultFile = {
        video: {
            name: "",
            file: null
        },
        audio: {
            name: "",
            file: null
        }
    }
    const classes = mediaDialogStyles()
    const currentDate = new Date()
    const params = useParams()
    const toast = useToast()
    const [file, setFile] = React.useState<IFile>(defaultFile)
    
    const onDrop = (acceptedFile: any, fileRejection: any, e: any) => {
        if (acceptedFile[0].type === "video/mp4") {
            setFile({
                video: {
                    name: acceptedFile[0].name,
                    file: acceptedFile[0]
                },
                audio: {
                    name: "",
                    file: null
                }
            })
        } else {
            setFile({
                audio: {
                    name: acceptedFile[0].name,
                    file: acceptedFile[0]
                },
                video: {
                    name: "",
                    file: null
                }
            })
        }
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "video/mp4,audio/mpeg"
        // noClick:handleChange
    })

    const validationSchema = Yup.object({
        title: Yup.string().min(3, "Title of sermon is too short").required(),
        author: Yup.string().min(3, "Author name is not valid").required()
    })
    const initialValues = {
        title: "",
        author: "",
        featureDateTo: new Date((new Date()).setDate(currentDate.getDate() + 5)),
        featureDateFrom: currentDate,
        authorDesignation: ""
    }

    const noChosenFile = file.audio.name.length > 0 || file.video.name.length > 0

    const handleSubmit = async (values: IForm, { ...actions }: any) => {
        actions.setSubmitting(true)
        const { title, author, authorDesignation, featureDateFrom, featureDateTo } = values
        const newSermon = {
            title,
            author,
            authorDesignation,
            featureDateFrom: featureDateFrom.toJSON(),
            featureDateTo: featureDateTo.toJSON(),
            churchId: params.churchId,
        }

        const sermonData = new FormData()
        Object.entries(newSermon).map((item, idx) => (
            sermonData.append(item[0], String(item[1]))
        ))
        file.video.file && sermonData.append("vidaudio", file.video.file, file.video.file.name)
        file.audio.file && sermonData.append("vidaudio", file.audio.file, file.audio.file.name)

        await sermonService.createSermon(sermonData).then(payload => {
            actions.setSubmitting(false)
            toast({
                title: "New Sermon",
                subtitle: "New Sermon has been successfully created",
                messageType: "success"
            })
            actions.resetForm()
            setFile(defaultFile)
            actions.setSubmitting(false)
            updateSermon(payload.data)
            close()
        }).catch(err => {
            actions.setSubmitting(false)
            toast({
                title: "Unable to create new sermon",
                subtitle: `Error:${err}`,
                messageType: "error"
            })
        })
    }

    return (
        <ModalContent bgColor={bgColor2}>
            <ModalHeader>
            </ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" mt={2} borderRadius="50%" opacity={.5} />
            <ModalBody display="flex" flexDirection="column"
                justifyContent="center" alignItems="center">
                <Heading textStyle="h4" textAlign="center" my="4">
                    Upload videos and audio files
                </Heading>
                <Flex p={5} direction="column" cursor="pointer" align="center"
                    {...getRootProps()} >
                    <input
                        {...getInputProps()}
                        className={classes.input} id="icon-button-file" />
                    <IconButton boxSize="5rem" aria-label="submit image"
                        borderRadius="50%" bgColor="#151C4D1A"
                        icon={<MdFileUpload fontSize="3rem" />} />
                    {
                        !noChosenFile ?
                            <Text fontSize="0.75rem" as="i"
                                opacity={.5} mt={4}>MP3, MP4
                            </Text>
                            :
                            file.video.name ?
                                <Text>
                                    {file.video.name}
                                </Text> :
                                <Text>
                                    {file.audio.name}
                                </Text>
                    }
                    <Text textAlign="center" fontSize="1.125rem"
                        fontWeight="600" color="tertiary" >
                        Drag and drop video or audio files to upload
                            </Text>
                </Flex>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<IForm>) => {
                        const onChange = (name: string) => (e: Date | any) => {
                            if (name === "featureDateFrom") {
                                const currentStartDate = new Date(e)
                                formikProps.setValues({
                                    ...formikProps.values,
                                    [name]: e,
                                    featureDateTo: new Date((currentStartDate).setDate(currentStartDate.getDate() + 1))
                                })
                            } else {
                                formikProps.setValues({ ...formikProps.values, [name]: e })
                            }
                        }

                        return (
                            <VStack>
                                <TextInput name="title" placeholder="Input Sermon Title" />
                                <TextInput name='author' placeholder="Input Author" />
                                <Text>Select Sermon Duration</Text>
                                <HStack>
                                    <DatePicker value={formikProps.values.featureDateFrom} onChange={onChange("featureDateFrom")} name="featureDateFrom" />
                                    <DatePicker value={formikProps.values.featureDateTo} onChange={onChange("featureDateTo")} name="featureDateTo" />
                                </HStack>
                                <Button my={{ base: 2, md: 10 }} disabled={(!noChosenFile) || formikProps.isSubmitting || !formikProps.dirty || !formikProps.isValid}
                                    onClick={(formikProps.handleSubmit as any)}>
                                    {!noChosenFile ? "Please Upload audio/video" : formikProps.isSubmitting ? `Creating a sermon ${formikProps.values.title}` : "Submit"}
                                </Button>
                            </VStack>
                        )
                    }}
                </Formik>
            </ModalBody>
        </ModalContent>
    )
}

const musicStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        position: "fixed",
        justifyContent:"center",
        bottom: "30px",
        width: "25vw",
        marginLeft: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
        "& > div": {
            borderRadius: "7px",
            padding: theme.spacing(2, 3),
            boxShadow: "0px 5px 10px #0000000D",
            backgroundColor: "ghostwhite",
            justifyContent: "space-evenly",
            "& > button": {
                background: "transparent",
                outline: "none",
                "& > svg": {
                    fontSize: "2.3rem"
                }
            },
            "& > button:nth-child(3)": {
                "& > svg": {
                    fontSize: "4rem !important"
                }
            },
            "& > button:last-child": {
                "& > svg": {
                    fontSize: "1.5rem !important"
                }
            }
        }
    }
}))
const videoStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        "& video":{
            width:"100%",
            maxWidth:"100rem"
        }
    }
}))


interface IMediaSermon extends ISermon {
    next?: boolean;
    previous?: boolean;
    idx?: number
}
interface IMusicPlayer {
    audio: IMediaSermon;
    closePlayer(): void;
    playNext(arg: number): () => void;
    playPrevious(arg: number): () => void;
}

const MusicPlayer: React.FC<IMusicPlayer> = ({ audio, closePlayer, playNext, playPrevious }) => {
    const classes = musicStyles()
    const [play, setPlay] = React.useState(false)
    // const [volume, setVolume] = React.useState(.5)

    // const increaseVolume = () => {
    //     const newVolume = volume + 0.1
    //     if (!(newVolume > 1)) {
    //         setVolume(newVolume)
    //     }
    // }
    // const decreaseVolume = () => {
    //     const newVolume = volume - 0.1
    //     if (!(newVolume < 0)) {
    //         setVolume(newVolume)
    //     }
    // }
    const handlePlay = () => {
        setPlay(!play)
    }
    React.useEffect(() => {
        setPlay(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[audio])

    return (
        <VStack className={classes.root}>
            <Text>
                {`Now Playing ${audio.title}`}
            </Text>
                <IconButton aria-label="cancel-player" opacity={.5}
                    position="absolute" top={0} right={0} onClick={closePlayer}
                    icon={<GiCancel />} />
            <HStack>
                <ReactHowler src={audio.featureVidAudio || ""} playing={play} />
                <IconButton aria-label="previous-song" onClick={playPrevious(audio.idx as number)}
                    disabled={!audio.previous} icon={<BiSkipPreviousCircle />} />
                <IconButton aria-label="play icon" onClick={handlePlay} icon={play ? <FaRegPauseCircle /> : <FaRegPlayCircle />} />
                <IconButton aria-label="next-song" disabled={!audio.next} onClick={playNext(audio.idx as number)}
                    icon={<BiSkipNextCircle />} />
            </HStack>
        </VStack>
    )
}
interface IVideoPlayer {
    video:ISermon
}

const CustomPause = withMediaProps(({media}:any) => {

    return(
        <Flex>

        </Flex>
    )
})


const VideoPlayer:React.FC<IVideoPlayer> = ({video}) => {
    const classes = videoStyles()

    return(
        <ModalContent bgColor={bgColor2}>
        <ModalBody className={classes.root}>
            <MediaWrapper >
                <VStack>
                    <CustomPause/>    
                    <Player autoPlay src={video.featureVidAudio} />
                    <HStack>
                    </HStack>
                </VStack>
            </MediaWrapper>
        </ModalBody>
    </ModalContent>
    )
}

const Media = () => {
    const defaultSermon: ISermon = {
        title: "",
        churchId: 0,
        author: "",
        authorDesignation: "",
        featureDateFrom: new Date(),
        featureDateTo: new Date(),
        sermonContent: "",
    }

    const draftSermon: ISermon[] = sermonDraftHelper.getSermonsFromLocalStorage()
    const classes = useStyles()
    const dispatch = useDispatch()
    const toast = useToast()
    const params = useParams()
    const [churchSermon, setChurchSermon] = React.useState<ISermon[]>([])
    const [textSermon, setTextSermon] = React.useState<ISermon[]>(new Array(5).fill(defaultSermon))
    const [displaySermons, setDisplaySermon] = React.useState<ISermon[]>(churchSermon)
    const [videoSermon, setVideoSermon] = React.useState<ISermon[]>([])
    const [audioSermon, setAudioSermon] = React.useState<ISermon[]>([])
    const [currentAudioSermon, setCurrentAudioSermon] = React.useState<IMediaSermon>(defaultSermon)
    const [currentVideoSermon,setCurrentVideoSermon] = React.useState<ISermon>(defaultSermon)
    const [inputValue, setInputValue] = React.useState("")
    const [videoInputValue, setVideoInputValue] = React.useState("")
    const [open, setOpen] = React.useState(false)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const handleToggle = () => {
        setOpen(!open)
    }

    React.useEffect(() => {
        dispatch(setPageTitle("Media/Content"))
        const getSermonForChurchApi = async () => {
            await sermonService.getChurchSermon(params.churchId).then(payload => {
                setChurchSermon(payload.data)
            }).catch(err => {
                toast({
                    title: "Unable to load sermon for church",
                    subtitle: `Error: ${err}`,
                    messageType: MessageType.ERROR
                })
            })
        }
        setTimeout(() => {
            setIsLoaded(true)
        }, 2500)
        getSermonForChurchApi()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        const textSermon = churchSermon.filter((item) => item.featureVidAudio === null)
        const audioSermon = churchSermon.filter(item => item.featureVidAudio && item.featureVidAudio.indexOf("mp3") > 0)
        const videoSermon = churchSermon.filter(item => item.featureVidAudio && item.featureVidAudio.indexOf("mp4") > 0)
        setTextSermon(textSermon)
        setAudioSermon(audioSermon)
        setVideoSermon(videoSermon)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [churchSermon])

    React.useEffect(() => {
        setDisplaySermon([...textSermon])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textSermon])


    const handleInput = (e: React.SyntheticEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)
    }
    const handleVideoInput = (e: React.SyntheticEvent<HTMLInputElement>) => {
        setVideoInputValue(e.currentTarget.value)
    }

    React.useEffect(() => {
        const testString = new RegExp(inputValue, "i")
        const newDisplaySermon = textSermon.filter(item => testString.test(item.title))
        setDisplaySermon([...newDisplaySermon])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue])

    React.useEffect(() => {
        const videoSermon = churchSermon.filter(item => item.featureVidAudio && item.featureVidAudio.indexOf("mp4") > 0)
        const testString = new RegExp(videoInputValue, "i")
        const newDisplaySermon = videoSermon.filter(item => testString.test(item.title))
        setVideoSermon([...newDisplaySermon])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoInputValue])


    React.useEffect(() => {
        if(currentVideoSermon.sermonID){
            handleToggle()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentVideoSermon])

    const updateSermon = (arg: ISermon) => {
        setChurchSermon([...churchSermon, arg])
    }

    const handleCurrentAudioSermon = (arg: IMediaSermon) => () => {
        setCurrentVideoSermon(defaultSermon)
        setCurrentAudioSermon(arg)
    }

    const handleCurrentVideoSermon = (arg:ISermon) => () => {
        setCurrentAudioSermon(defaultSermon)
        setCurrentVideoSermon(arg)
    }
    const resetCurrentAudio = () => {
        setCurrentAudioSermon(defaultSermon)
    }

    const setNext = (idx: number) => () => {
        const currentIdx = idx+1
        const newCurrentAudio = audioSermon[currentIdx]
        if (newCurrentAudio) {
            setCurrentAudioSermon({
                ...newCurrentAudio,
                next: !(currentIdx >= (audioSermon.length - 1)),
                previous: !(currentIdx <= 0),
                idx: currentIdx
            })
        }
    }

    const setPrevious = (idx: number) => () => {
        const currentIdx = idx - 1
        const newCurrentAudio = audioSermon[idx - 1]
        if (newCurrentAudio) {
            setCurrentAudioSermon({
                ...newCurrentAudio,
                next: !(currentIdx >= (audioSermon.length - 1)),
                previous: !(currentIdx <= 0),
                idx: currentIdx
            })
        }
    }


    return (
        <>
            <Slide in={Boolean(currentAudioSermon.sermonID)}>
                <Flex>
                    {
                        currentAudioSermon.featureVidAudio && <MusicPlayer closePlayer={resetCurrentAudio}
                            audio={currentAudioSermon} playNext={setNext} playPrevious={setPrevious} />
                    }
                </Flex>
            </Slide>
            <VStack spacing={14} p="4" bgColor="bgColor" className={classes.root}
                pl={{ md: "12" }} divider={<StackDivider borderColor="gray.200" />}
                width={["100%", "100%", "93%"]} pt={{ md: "12" }}>
                <Flex direction="column" mb={{ md: "2rem" }} width="100%">
                    <Flex mb={[2, 5]} align="center">
                        <Button px={4}>
                            <Link to={`/church/${params.churchId}/media/create`} >
                                Create Sermon
                            </Link>
                        </Button>
                        <Flex flex={1} />
                        <SearchInput setValue={handleInput}
                         display={{ base: "none", md: "inline-block" }} value={inputValue} />
                        <Flex flex={3} flexShrink={4} />
                        <Button variant="outline" borderWidth="3px">
                            <Flex align="center" >
                                <Icon as={BsCameraVideoFill} />
                                <Text>Live Stream</Text>
                            </Flex>
                        </Button>
                    </Flex>
                    <Flex flex={1} />
                    <SearchInput setValue={handleInput}
                     display={{ md: "none" }} value={inputValue} />
                    <Wrap spacing="15px">
                        {displaySermons.length > 0 ? displaySermons.map((item, idx) => (
                            <WrapItem key={item.sermonID || idx}>
                                <DashboardActivity isLoaded={Boolean(item.sermonID)} heading={item.title}
                                p="4" width="100%" maxWidth="20rem">
                                <Text as="i" color="#151C4D" fontWeight="600"
                                    fontSize="1.125rem" opacity={.5} >
                                    {item.author}
                                </Text>
                                <Text textAlign="left" color="#151C4D" opacity={.5}
                                    maxWidth="sm" dangerouslySetInnerHTML={{ __html: item.sermonContent }} />
                            </DashboardActivity>
                            </WrapItem>
                        )) :
                            <Text>No sermon is currently is available</Text>
                        }
                    </Wrap>
                </Flex>
                {
                    draftSermon?.length > 0 &&
                    <Flex width="100%" direction="column" >
                        <Text color="primary">
                            Draft Sermon
                        </Text>
                        <Wrap>
                            {draftSermon.map((item, idx) => (
                                <DashboardActivity p="4"
                                    key={item.sermonID || idx} width="90%" maxWidth="20rem" >
                                    <Heading fontSize="1.5rem" color="#151C4D" >
                                        {item.title}
                                    </Heading>
                                    <Text as="i" color="#151C4D" fontWeight="600"
                                        fontSize="1.125rem" opacity={.5} >
                                        {item.author}
                                    </Text>
                                    <Text textAlign="left" color="#151C4D" opacity={.5} maxWidth="sm" >
                                        {item.sermonContent}
                                    </Text>
                                    <Button variant="link" ml="auto">
                                        <Link to={`/church/${params.churchId}/media/create?title=${item.title}`} >
                                            Continue
                                </Link>
                                    </Button>
                                </DashboardActivity>
                            ))
                            }
                        </Wrap>
                    </Flex>
                }
                <Flex direction="column" width="100%">
                    <Flex mb={[2, 5]} direction={["column", "row"]}
                        align="center">
                        <Button px={4} onClick={handleToggle}>
                            Upload video/audio sermons
                        </Button>
                        <Flex flex={1} />
                        <SearchInput setValue={handleVideoInput}
                         display={{ base: "none", md: "inline-block" }} value={videoInputValue} />
                        <Flex flex={3} flexShrink={4} />
                        <Button variant="outline" mt={[2, "initial"]} borderWidth="3px" colorScheme="primary" color="primary" >
                            <Flex align="center" >
                                <Icon as={BsCameraVideoFill} />
                                <Text>Live Stream</Text>
                            </Flex>
                        </Button>
                    </Flex>
                    <Flex flex={1} />
                    <SearchInput setValue={handleVideoInput}
                     display={{ md: "none" }} value={videoInputValue} />
                    <Stack direction={"column"} mb={[2, 5]} align={["center", "flex-start"]} spacing={12} >
                        <Heading fontSize="2.2rem" mt={{ md: "2rem" }} letterSpacing={0}
                            color="primary" fontWeight={400} >
                            Video Sermons
                        </Heading>
                        <Wrap>
                            {videoSermon.length > 0 ?
                                videoSermon.map((item, idx) => (
                                    <Skeleton isLoaded={isLoaded} key={item.sermonID || idx}
                                     onClick={handleCurrentVideoSermon(item)} >
                                        <MediaCard title={item.title} showShare={true} key={idx} />
                                    </Skeleton>
                                )) :
                                <Text>
                                    No Available Video sermon
                            </Text>
                            }
                        </Wrap>
                    </Stack>
                    <Stack direction={"column"} align={["center", "flex-start"]} spacing={12} >
                        <Heading fontSize="2.2rem" mt={{ md: "2rem" }} letterSpacing={0}
                            color="primary" fontWeight={400} >
                            Audio Sermons
                        </Heading>
                        <Wrap>
                            {audioSermon.length > 0 ?
                                audioSermon.map((item, idx) => (
                                    <Skeleton isLoaded={isLoaded} key={item.sermonID || idx}
                                    onClick={handleCurrentAudioSermon({
                                        ...item,
                                        next: !(idx >= (audioSermon.length - 1)),
                                        previous: !(idx <= 0),
                                        idx
                                    })}>
                                        <MediaCard title={item.title} showShare={true} key={idx} />
                                    </Skeleton>
                                )) :
                                <Text>
                                    No Available audio sermon
                            </Text>
                            }
                        </Wrap>
                    </Stack>
                </Flex>
            </VStack>
            <Dialog open={open}
             close={handleToggle} size={currentVideoSermon.sermonID ? "4xl" : "md"} >
                {
                    currentVideoSermon.sermonID ? <VideoPlayer video={currentVideoSermon} /> : 
                    <MediaDialog close={handleToggle}
                        updateSermon={updateSermon}
                    />
                }
            </Dialog>
        </>
    )
}


export default Media