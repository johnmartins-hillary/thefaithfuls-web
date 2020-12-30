import React from "react"
import { Link } from "react-router-dom"
import {
    Box, Text, Link as ChakraLink, Icon,
    Heading, Flex, HStack, VStack, Stack, Image,
    SimpleGrid, InputGroup,Input,
    InputRightElement
} from "@chakra-ui/react"
import { Button } from "components/Button"
import { Header } from "components/Header"
import { LandingImage } from 'assets/images'
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Divider } from "@material-ui/core"
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa"
import { AppStore, PlayStore,Logo,
    ChurchMemberApp,ChurchMemberDesktop,
    OnTheGo,FeatureImage,ChurchDetail,
    PrayerHand,Bible,Sermon,Giving,Activity,Reflection,Groups,Announcement
 } from "assets/images"
import {HiOutlineMail} from "react-icons/hi"
import { primary } from "theme/palette"


const useStyles = makeStyles((theme: Theme) => (
    createStyles({
        root: {
            "& p": {
                textAlign: "center",
                letterSpacing: "0.15px"
            },
            "& h2":{
                textAlign:"center",
                [theme.breakpoints.up("sm")]:{
                    textAlign:"initial"
                }
            }
        },
        churchImageContainer: {
            backgroundImage: `url(${LandingImage})`,
            backgroundRepeat: "no-repeat",
            position: "relative",
            backgroundPosition: "center",
            width: "100%",
            height: "100vh",
            backgroundSize: "cover"
        },
        overlay: {
            position: "absolute",
            height: "100%",
            zIndex: 1,
            width: "100%",
            backgroundColor: "rgba(0,0,0,.3)"
        },
        adminButtonContainer: {
            borderRadius: "10px",
            boxShadow: "1px solid #707070",
            backgroundColor: "white",
            padding: theme.spacing(2.5, 4),
            "& > p": {
                letterSpacing: "0",
                fontWeight: "600",
                fontSize: ".9rem",
                whiteSpace: "nowrap",
                [theme.breakpoints.up("sm")]: {
                    fontSize: "1.3rem",
                }
            },
            "& button": {
                fontWeight: 400,
                fontSize: ".9rem",
                [theme.breakpoints.up("sm")]: {
                    fontSize: "1.3rem",
                }
            }
        },
        administratorContainer: {
            padding: theme.spacing(6.5, 3),
            backgroundColor: "white",
            "& button": {
                marginTop: theme.spacing(4)
            },
            "& h2": {
                margin: theme.spacing(4, 2),
                textAlign: "center"
            },
            "& p": {
                maxWidth: "50rem",
                width: "75%",
            }
        },
        appContainer: {
            width: "100%",
            margin: theme.spacing(3, 0),
            "& h1":{
                textAlign:"center"
            },
            "& > div": {
                padding: theme.spacing(2, 3),
                position:"relative",
                paddingBottom:"0",
                paddingRight:"0",
                minHeight: "45vh",
                justifyContent: "flex-start",
                alignItems: "center",
                flex: 1,
                marginTop: "0 !important",
                [theme.breakpoints.up("sm")]:{
                    height:"50rem",
                },
                "& p": {
                    maxWidth: "30rem",
                    width: "65%",
                    margin: `${theme.spacing(5, 0)} !important`
                },
                "& > img:last-child":{
                    maxHeight:"27.5rem"
                }
            }
        },
        button: {
            fontWeight: 400,
            padding: `${theme.spacing(3, 7)} !important`,
            fontSize: ".9rem",
            [theme.breakpoints.up("sm")]: {
                fontSize: "1.3rem",
            }
        },
        churchGoContainer: {
            margin: theme.spacing(3),
            width:"100%",
            marginTop:`${theme.spacing(7)}px !important`,
            marginBottom:`${theme.spacing(7)}px !important`,
            "& > div": {
                flex: 1,
                "& h2": {
                    letterSpacing: 0
                },
                "& p": {
                    textAlign: "left",
                    margin: `${theme.spacing(4, 0)} !important`
                },
                "& button": {
                    margin: `${theme.spacing(2, 0)} !important`
                },
            },
            "& > div:first-child":{
                [theme.breakpoints.up("md")]:{
                    width:"56%",
                    flex:"none"
                }
            }
        },
        featureContainer: {
            width: "80%",
            margin: theme.spacing(3),
            marginTop:`${theme.spacing(7)}px !important`,
            marginBottom:`${theme.spacing(7)}px !important`,
            "& > div": {
                flex: 1
            },
            "& > div:nth-child(2)":{
                [theme.breakpoints.up("md")]:{
                    width:"56%",
                    flex:"none"
                }
            }
        },
        detailContainer: {
            margin: theme.spacing(5),
            width: "80%",
            "& hr": {
                backgroundColor: primary,
                margin: "1rem !important",
                width: "100%",
                [theme.breakpoints.up("sm")]: {
                    margin: "2rem !important",
                }
            },
            "& p": {
                fontSize: "1.5rem",
                fontWeight: 600,
                [theme.breakpoints.up("sm")]:{
                    fontSize: "2.3rem",
                }
            },
            position:"relative",
            "& div":{
                margin:`${theme.spacing(3,1.5)} !important`,
                "& img":{
                    position:"absolute",
                    top:"-27.5px",
                    left:0,
                    maxHeight:"20.125rem",
                    [theme.breakpoints.down("sm")]:{
                        display:"none"
                    }
                }
            }
        },
        footerContainer: {
            width: "100%",
            padding: theme.spacing(3, 0),
            justifyContent: "center",
            alignItems: "center",
            "& > div": {
                borderTop: "1px solid whitesmoke",
                justifyContent:"space-between",
                maxWidth:"70rem",
                paddingTop: "3rem",
                "& a": {
                    color: "white"
                },
                "& input":{
                    backgroundColor:"transparent",
                    border:"1px solid white",
                    "& svg":{
                        color:`${primary} !important`
                    }
                },
                "& button":{
                    width:"100%"
                },
                "& > div": {
                    alignItems: "center",
                    marginTop:"0 !important",
                    [theme.breakpoints.up("sm")]:{
                        marginRight: theme.spacing(4),
                        alignItems: "flex-start",
                    },
                    "& p": {
                        textAlign: "center",
                        maxWidth: "20rem",
                        [theme.breakpoints.up("sm")]:{
                            textAlign: "left",
                        }
                    },
                    "& p:first-child": {
                        textAlign: "left",
                        color: primary,
                        maxWidth: "20rem"
                    }
                }
            }
        },
        socialContainer:{
            "& svg": {
                color: "white",
                marginRight: theme.spacing(1)
            }
        },
        storeContainer:{
            align:"flex-start",
            "& > img":{
                marginTop:"0 !important"
            }
        },
        absoluteImage:{
            [theme.breakpoints.up("sm")]:{
                position:"absolute",
                bottom:"0",
                right:"0"
            }
        }
    })
))



const Home = () => {

    const classes = useStyles()
    const dashboardMenu = [
        {icon:PrayerHand,title:"Prayer Wall"},
        {icon:Bible,title:"Bible"},
        {icon:Sermon,title:"Sermon"},
        {icon:Giving,title:"Giving"},
        {icon:Activity,title:"Church Activity"},
        {icon:Reflection,title:"Daily Reflection"},
        {icon:Groups,title:"Groups"},
        {icon:Announcement,title:"Announcement"},
    ]
    
    return (
        <VStack className={classes.root}>
            <Box className={classes.churchImageContainer}>
                <Box className={classes.overlay} />
                <Header />
                <Flex position="relative" zIndex={2} alignItems="center" flexDirection="column"
                    justifyContent="space-around"
                    height={["40vh", "40vh", "50vh", "60vh"]}
                    mt={["5em", "10rem", "8em", "4em"]} >
                    <Heading color="white" textAlign="center"
                        maxWidth="xl"
                        fontSize={["3xl", "4xl", "5xl", "5.5rem"]}>
                        Bringing the <Box as="span" color="primary">Church</Box> online
                </Heading>
                    <HStack className={classes.adminButtonContainer}>
                        <Text color="primary">
                            Are you a church Admin?
                    </Text>
                        <Link to="/signup/admin" >
                            <Button>
                                Add Your Church
                        </Button>
                        </Link>
                    </HStack>
                        <ChakraLink textDecoration="underline" color="white">
                            Are you a church member? Find your church
                    </ChakraLink>
                </Flex>
            </Box>
            <VStack className={classes.administratorContainer}>
                <Heading color="tertiary" fontSize={["2rem", "3rem", "4rem"]} >
                    Church Administration Made Easy
                </Heading>
                <Text color="tertiary">
                    But I must explain to you how all this mistaken idea of denouncing pleasure
                    and praising pain was born and I will give you a complete account of the system,
                    and expound the actual teachings of the great explorer of the truth, the master-builder
                    of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is
                    pleasure, but because those who do not know how to pursue pleasure rationally encounter
                    consequences that are extremely painful.
                </Text>
                <Link to="/signup/admin" >
                    <Button className={classes.button}>
                        Get Started Now
                    </Button>
                </Link>
            </VStack>
            <Stack className={classes.appContainer} flexDirection={{ base: "column", md: "row" }}>
                <VStack bgColor="#FFEBCC" mr={{ md: "3" }} >
                    <Heading color="tertiary" fontSize={["2.3rem", "2.5rem"]}>
                        Church App For Members
                </Heading>
                    <Text color="tertiary">
                        But I must explain to you how all this mistaken idea of denouncing
                        pleasure and praising pain was born and I will give you a complete
                        account of the system, and expound the actual teachings of the great
                        explorer of the truth, the master-builder of human happiness.
                </Text>
                    <Stack zIndex={5} flexDirection={["column","row"]} className={classes.storeContainer}>
                        <Image w="12rem" src={PlayStore} />
                        <Image w="10rem" src={AppStore} />
                    </Stack>
                    <Image className={classes.absoluteImage} src={ChurchMemberApp} />
                </VStack>
                <VStack bgColor="#FACCFF" ml={{ md: "3" }}>
                    <Heading color="tertiary" fontSize={["2.3rem", "2.5rem"]}>
                        Manage Church Activities
                    </Heading>
                    <Text color="tertiary" zIndex={5}>
                        But I must explain to you how all this mistaken idea of denouncing
                        pleasure and praising pain was born and I will give you a complete
                        account of the system, and expound the actual teachings of the great
                        explorer of the truth, the master-builder of human happiness.
                    </Text>

                        <Button zIndex={5} className={classes.button}>
                            <Link to="/signup/admin" >
                                    Get Started Now
                            </Link>
                        </Button>
                    <Image className={classes.absoluteImage} src={ChurchMemberDesktop} />
                </VStack>
            </Stack>
            <Stack w="85%" flexDirection={{ base: "column", md: "row" }}
             className={classes.churchGoContainer}>
                <Flex mr={{ md: 3 }}>
                    <Image src={OnTheGo} />
                </Flex>
                <VStack align="flex-start">
                    <Heading color="tertiary" textAlign="left"
                        fontSize={["2rem", "3rem", "4rem"]} fontWeight={600}>
                        Church <br /> on the go
                </Heading>
                    <Text color="tertiary" textAlign="left" maxW="sm">
                        But I must explain to you how all this mistaken idea of denouncing
                        pleasure and praising pain was born and I will give you a complete account
                        of the system, and expound the actual
                </Text>
                    <Link to='/signup/member?find-church' >
                        <Button className={classes.button}>
                            Find Your Church
                    </Button>
                    </Link>
                    <Stack className={classes.storeContainer} flexDirection={['column', "row"]}>
                        <Image w="12rem" src={PlayStore} />
                        <Image w="10rem" src={AppStore} />
                    </Stack>
                </VStack>
            </Stack>
            <Stack className={classes.featureContainer} flexDirection={{ base: "column-reverse", md: "row" }} >
                <VStack align={["center", "flex-start"]}>
                    <Heading color="tertiary" fontSize={["2rem", "3rem", "4rem"]} >
                        Features
                </Heading>

                    <SimpleGrid my={10} columns={[1, 2]} spacingX="2.5rem" spacingY="5" >
                        {dashboardMenu.map((item,idx) => (
                            <HStack key={idx} >
                                <Image src={item.icon} />
                                <Text fontSize="1.325" color="tertiary"
                                letterSpacing="0" fontWeight={600}>
                                    {item.title}
                                </Text>
                            </HStack>
                        ))}
                    </SimpleGrid>
                    <Link to='/signup/member?find-church' >
                        <Button className={classes.button}>
                            Find Your Church
                        </Button>
                    </Link>
                </VStack>
                <Flex>
                    <Image src={FeatureImage} />
                </Flex>
            </Stack>
            <Stack className={classes.detailContainer}>
                <VStack>
                    <Divider variant="middle" />
                    <Image src={ChurchDetail} />
                    <HStack justifyContent="flex-end" w="100%" align="flex-start" pr={["5","16"]}>
                        <VStack mx="6">
                            <Text mb="3" color="primary">
                                2,000+
                        </Text>
                            <Text color="tertiary">
                                Churches
                        </Text>
                        </VStack>
                        <VStack>
                            <Text mb="3" color="primary">
                                40,000+
                        </Text>
                            <Text color="tertiary">
                                Church Members
                        </Text>
                        </VStack>
                    </HStack>
                    <Divider variant="middle" />
                </VStack>
            </Stack>
            <Stack bgColor="tertiary" className={classes.footerContainer}>
                <Stack width={["95%", "75%"]} flexDirection={['column', 'row']}>
                    <VStack>
                        <Image src={Logo} />
                        <Text color="primary">
                            But I must explain to you how all this mistaken idea of denouncing
                            pleasure and praising pain was born and I will give you a complete account of the.
                    </Text>
                        <Text color="whitesmoke">
                            1st Floor, Leasing House,C & I Leasing Drive, Off Bisola Durosinmi
                            Etti Drive, Off Admiralty Way, Lekki Phase 1, Lagos, Nigeria
                    </Text>
                        <VStack align="flex-start">
                            <Text color="whitesmoke">
                                +234-1-342-9192
                        </Text>
                            <Text color="whitesmoke">
                                info@thefaithfuls.com
                        </Text>
                        </VStack>
                        <HStack spacing={3} className={classes.socialContainer}>
                            <Icon as={FaFacebookF} />
                            <Icon as={FaTwitter} />
                            <Icon as={FaLinkedinIn} />
                        </HStack>
                    </VStack>
                    <VStack>
                        <Text>Menu</Text>
                        <Link to="/" >
                            Home
                    </Link>
                        <Link to="/">
                            Find Your Church
                    </Link>
                        <Link to="/" >
                            About Us
                    </Link>
                        <Link to="/">
                            Contact Us
                    </Link>
                    </VStack>
                    <VStack>
                        <Text>
                            Company
                    </Text>
                        <Link to="/">
                            Terms of service
                    </Link>
                        <Link to="/">
                            Privacy Policy
                    </Link>
                        <Link to="/">
                            Blog
                    </Link>
                    </VStack>
                    <VStack>
                        <Text>
                            Subscribe
                    </Text>
                        <Text color="white">
                            For our Newletter and updates
                    </Text>
                        <InputGroup>
                            <Input placeholder="Enter your Email" />
                            <InputRightElement children={<Icon color="primary" as={HiOutlineMail} />} />
                        </InputGroup>
                        <Button className={classes.button} >
                            Subscribe
                    </Button>
                    </VStack>
                </Stack>
            </Stack>
        </VStack>
    )
}

export default Home