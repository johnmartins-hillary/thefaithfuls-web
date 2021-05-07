import React from "react"
import { Link } from "react-router-dom"
import {
    Box, Text, Link as ChakraLink, Icon,
    Heading, Flex, HStack, VStack, Stack, Image,
    SimpleGrid, InputGroup, Input,
    InputRightElement
} from "@chakra-ui/react"
import { Button } from "components/Button"
import { Header } from "components/Header"
import { LandingImage } from 'assets/images'
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Divider } from "@material-ui/core"
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa"
import {
    AppStore, PlayStore, Logo,
    ChurchMemberApp, ChurchMemberDesktop,
    OnTheGo, FeatureImage, ChurchDetail,
    PrayerHand, Bible, Sermon, Giving, Activity,
    Reflection, Groups, Announcement
} from "assets/images"
import { HiOutlineMail } from "react-icons/hi"
import { primary } from "theme/palette"




const useStyles = makeStyles((theme: Theme) => (
    createStyles({
        root: {
            "& p,a": {
                fontFamily: "MulishRegular",
                textAlign: "center"
            },
            "& h2": {
                fontFamily: "MulishRegular",
                textAlign: "center"
            },
            "& img": {
                objectFit: "cover"
            }
        },
        churchImageContainer: {
            backgroundImage: `url(${LandingImage})`,
            justifyContent: "center",
            alignItems: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
            backgroundPosition: "center",
            width: "100%",
            height: "100vh",
            backgroundSize: "cover",
            "& > div:nth-child(3)": {
                position: "relative",
                zIndex: 2,
                justifyContent: "center",
                [theme.breakpoints.down("sm")]: {
                    width: "100%"
                }
            },
            "& p": {
                alignSelf: "center"
            },
            "& button": {
                fontFamily: "MulishLight"
            }
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
            marginTop: `${theme.spacing(3)}px !important`,
            [theme.breakpoints.up('sm')]: {
                marginTop: `${theme.spacing(9)}px !important`,
                marginBottom: `${theme.spacing(5)}px !important`,
            },
            "& > p": {
                letterSpacing: "0",
                fontWeight: "600",
                fontSize: "1rem",
                whiteSpace: "nowrap",
                [theme.breakpoints.up("sm")]: {
                    fontSize: "1.5rem",
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
            padding: theme.spacing(7.5, 3),
            backgroundColor: "white",
            "& button": {
                marginTop: theme.spacing(4)
            },
            "& h2": {
                margin: theme.spacing(4, 2),
                textAlign: "center"
            },
            "& p": {
                [theme.breakpoints.up("sm")]: {
                    maxWidth: "50rem",
                    letterSpacing: "0.15px",
                    width: "75%",
                }
            }
        },
        appContainer: {
            width: "100%",
            margin: theme.spacing(3, 0),
            "& h1": {
                textAlign: "center"
            },
            "& > div": {
                padding: theme.spacing(7, 0),
                position: "relative",
                paddingBottom: "0",
                paddingRight: "0",
                minHeight: "45vh",
                justifyContent: "flex-start",
                alignItems: "center",
                flex: 1,
                marginTop: "0 !important",
                [theme.breakpoints.up("sm")]: {
                    padding: theme.spacing(7, 3),
                    height: "50rem",
                },
                "& p": {
                    maxWidth: "42rem",
                    width: "80%",
                    margin: `${theme.spacing(5, 0)} !important`
                },
                "& > img:last-child": {
                    maxHeight: "27.5rem"
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
            width: "100%",
            padding: theme.spacing(3),
            marginTop: `${theme.spacing(7)}px !important`,
            marginBottom: `${theme.spacing(7)}px !important`,
            [theme.breakpoints.up("sm")]: {
                margin: theme.spacing(3)
            },
            "& > div": {
                flex: 1,
                "& h2": {
                    letterSpacing: 0,
                    fontFamily: "MulishExtraBold",
                    textAlign: "left"
                },
                "& p": {
                    textAlign: "left",
                    marginTop: `${theme.spacing(4)}`
                },
                "& button": {
                    margin: `${theme.spacing(3, 0)} !important`
                },
            },
            "& > div:first-child": {
                [theme.breakpoints.up("md")]: {
                    width: "56%",
                    flex: "none"
                }
            },
            "& > div:nth-child(2)": {
                "& > div": {
                    [theme.breakpoints.down("sm")]: {
                        alignItems: "flex-start !important"
                    }
                }
            }
        },
        featureContainer: {
            width: "90%",
            margin: theme.spacing(3),
            marginTop: `${theme.spacing(7)}px !important`,
            marginBottom: `${theme.spacing(7)}px !important`,
            "& h2": {
                fontFamily: "MulishExtraBold"
            },
            "& > div": {
                flex: 1
            },
            "& p": {
                fontFamily: "MulishBold",
                fontSize: "1.375rem"
            },
            "& > div:nth-child(2)": {
                [theme.breakpoints.up("md")]: {
                    width: "56%",
                    flex: "none"
                }
            },
            "& > div:first-child": {
                [theme.breakpoints.up("md")]: {
                    marginTop: theme.spacing(8)
                }
            }
        },
        detailContainer: {
            width: "80%",
            [theme.breakpoints.up("sm")]: {
                margin: theme.spacing(5),
            },
            "& hr": {
                backgroundColor: primary,
                margin: "1rem !important",
                width: "100%",
                [theme.breakpoints.up("sm")]: {
                    margin: "1.5rem !important",
                }
            },
            "& p": {
                fontSize: "1.5rem",
                fontFamily: "MulishExtraBold",
                fontWeight: 600,
                [theme.breakpoints.up("sm")]: {
                    fontSize: "2.3rem",
                }
            },
            position: "relative",
            "& div": {
                margin: `${theme.spacing(2.3)} !important`,
                "& img": {
                    position: "absolute",
                    top: "-53.5px",
                    left: "-28px",
                    maxHeight: "20.125rem",
                    [theme.breakpoints.down("sm")]: {
                        display: "none"
                    }
                }
            }
        },
        footerContainer: {
            width: "100%",
            padding: theme.spacing(7, 0),
            justifyContent: "center",
            alignItems: "center",
            [theme.breakpoints.up("sm")]: {
                padding: theme.spacing(16, 0),
                "& a": {
                    textAlign: "left"
                }
            },
            "& button": {
                fontFamily: "MulishRegular"
            },
            "& p,a": {
                fontSize: "1.1875rem"
            },
            "& > div": {
                borderTop: "1px solid whitesmoke",
                justifyContent: "space-between",
                maxWidth: "70rem",
                paddingTop: "3rem",
                [theme.breakpoints.up("sm")]: {
                    marginBottom: theme.spacing(20)
                },
                "& a": {
                    color: "white"
                },
                "& input": {
                    backgroundColor: "transparent",
                    border: "1px solid white",
                    "& svg": {
                        color: `${primary} !important`
                    }
                },
                "& button": {
                    width: "100%"
                },
                "& > div": {
                    alignItems: "center",
                    marginTop: "0 !important",
                    [theme.breakpoints.up("sm")]: {
                        marginRight: theme.spacing(4),
                        alignItems: "flex-start",
                    },
                    "& p": {
                        textAlign: "center",
                        maxWidth: "20rem",
                        [theme.breakpoints.up("sm")]: {
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
        socialContainer: {
            marginTop: `${theme.spacing(3)}px !important`,
            "& svg": {
                color: "white",
                marginRight: theme.spacing(1)
            }
        },
        storeContainer: {
            zIndex: 5,
            alignItems: "center",
            flexDirection: "column-reverse",
            [theme.breakpoints.up("sm")]: {
                flexDirection: "row !important",
            },
            "& > img": {
                marginTop: "0 !important"
            }
        },
        absoluteImage: {
            [theme.breakpoints.up("sm")]: {
                position: "absolute",
                bottom: "0",
                right: "0"
            }
        },
        middleText: {
            margin: `${theme.spacing(3, 0)} !important`,
        }
    })
))


const Home = () => {
    const classes = useStyles()
    const dashboardMenu = [
        { icon: PrayerHand, title: "Prayer Wall" },
        { icon: Bible, title: "Bible" },
        { icon: Sermon, title: "Sermon" },
        { icon: Giving, title: "Giving" },
        { icon: Activity, title: "Church Activity" },
        { icon: Reflection, title: "Daily Reflection" },
        { icon: Groups, title: "Groups" },
        { icon: Announcement, title: "Announcement" },
    ]
    
    return (
        <>
            <VStack className={classes.root}>
                <Flex className={classes.churchImageContainer}>
                    <Box className={classes.overlay} />
                    <Header />
                    <VStack height={["40vh", "40vh", "50vh", "60vh"]}>
                        <Heading color="white" textAlign="center"
                            maxWidth="xl"
                            fontSize={["3xl", "4xl", "5xl", "5rem"]}>
                            Bringing the <Box as="span" color="primary">Church</Box> online
                        </Heading>
                        <Stack direction={["column", "row"]}
                         className={classes.adminButtonContainer}>
                            <Text color="primary">
                                Are you a church Admin?
                            </Text>
                            <Link to="/signup/admin" >
                                <Button>
                                    Add Your Church
                                </Button>
                            </Link>
                        </Stack>
                        <ChakraLink as={Link} to={"/signup/admin"} cursor="pointer"
                            textDecoration="underline" fontSize={[".9rem", "1.3rem"]} color="white">
                            Are you a church member? Find your church
                        </ChakraLink>
                    </VStack>
                </Flex>
                <VStack className={classes.administratorContainer}>
                    <Heading color="tertiary" fontSize={["2rem", "3rem", "4rem"]} >
                        Church Administration Made Easy
                </Heading>
                <Text color="tertiary">
                Looking for better ways to reach and engage your church members? Do not worry we have got you covered, The faithfuls is a robust church management solution with all you need to constantly spread the Gospel of Christ across the Globe.

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
                    We have built a robust mobile application for church members to search and join their churches online, members can participate in church activities online, available for Android and IOS users.
                </Text>
                        <Stack className={classes.storeContainer}>
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
                    As a church administrator, you can create accounts for your churches, fellowships and special congregations, kindly note that your church will be verified before it becomes active and accessible for members to join, please dont create a church if you are not authorized to manage a church.
                    </Text>

                        <Button zIndex={5} className={classes.button}>
                            <Link to="/signup/admin" >
                                Get Started Now
                            </Link>
                        </Button>
                        <Image className={classes.absoluteImage} src={ChurchMemberDesktop} />
                    </VStack>
                </Stack>
                <Stack flexDirection={{ base: "column", md: "row" }}
                    className={classes.churchGoContainer}>
                    <Flex mr={{ md: 6 }}>
                        <Image src={OnTheGo} />
                    </Flex>
                    <VStack align="flex-start">
                        <Heading color="tertiary" textAlign="left"
                            fontSize={["2rem", "3rem", "4rem"]} fontWeight={600}>
                            Church <br /> on the go
                </Heading>
                    <Text color="tertiary" textAlign="left" maxW="sm">
                    No more excuses, join the faithfuls today
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
                <Stack className={classes.featureContainer}
                    flexDirection={{ base: "column-reverse", md: "row" }} >
                    <VStack align={["center", "flex-start"]} spacing={{ sm: 5, md: 10 }}>
                        <Heading color="tertiary" fontSize={["2rem", "3rem", "4rem"]} >
                            Features
                    </Heading>
                        <SimpleGrid my={10} columns={[1, 2]} spacingX="2.5rem" spacingY="5" >
                            {dashboardMenu.map((item, idx) => (
                                <HStack key={idx} >
                                    <Image src={item.icon} />
                                    <Text color="tertiary" whiteSpace="nowrap">
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
                        <HStack justifyContent="flex-end" w="100%" align="flex-start" pr={["5", "16"]}>
                            <VStack mx="6">
                                <Text color="primary">
                                    2,000+
                            </Text>
                                <Text color="tertiary">
                                    Churches
                            </Text>
                            </VStack>
                            <VStack>
                                <Text color="primary">
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
                <Stack width={["95%", "75%"]} flexDirection={{base:'column',md:'row'}}>
                    <VStack>
                        <Image src={Logo} />
                        {/* <Text color="primary">
                            But I must explain to you how all this mistaken idea of denouncing
                            pleasure and praising pain was born and I will give you a complete account of the.
                    </Text>
                            <Text color="whitesmoke" className={classes.middleText}>
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
                        <HStack spacing={3} className={classes.socialContainer}>
                            <Icon as={FaFacebookF} />
                            <Icon as={FaTwitter} />
                            <Icon as={FaLinkedinIn} />
                        </HStack> */}
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
                                <Input color="white" placeholder="Enter your Email" />
                                <InputRightElement children={<Icon color="primary" as={HiOutlineMail} />} />
                            </InputGroup>
                            <Button className={classes.button} >
                                Subscribe
                    </Button>
                        </VStack>
                    </Stack>
                </Stack>
            </VStack>
        </>
    )
}

export default Home