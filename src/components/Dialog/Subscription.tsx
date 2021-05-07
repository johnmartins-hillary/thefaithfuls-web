import React from "react"
import {Link} from "react-router-dom"
import { Box,Stack,ModalHeader,
    Heading, Text,Flex,Image, Icon, ModalBody,
     ModalCloseButton, ModalContent} from "@chakra-ui/react"
import {Button} from "components/Button"
import { AiFillCheckCircle } from "react-icons/ai"
import {Growth,Growth3} from "assets/images"
import {createStyles,makeStyles} from "@material-ui/styles"



const useStyles = makeStyles(createStyles({
    root:{},
    minorSubscriptionContainer:{
        justifyContent:"center",
        backgroundColor:"white",
        // flexDirection:"column",
        alignItems:"center",
        width:"50%",
        shadow:"0px 5px 20px #0000001A",
        height:"60vh" 
    },
    mainSubscriptionContainer:{
        justifyContent:"center",
        backgroundColor:"white",
        width:"50%",
        // flexDirection:"column",
        alignItems:"center",
        height:"70vh",
        shadow:"0px 5px 20px #0000001A" 
    },
}))


const SubscriptionAdvert = ({color}:any) => (
    <Box>
        <Icon boxSize="1.01rem" borderRadius="50%" mr="3"
            color={color || "primary"} as={AiFillCheckCircle} />
        <Box as="span" fontSize={["0.8rem", "0.875rem"]} color="#151C4D"  >
            Unlimited Advert
        </Box>
    </Box>
                        
)
const SubscriptionCardMain = ({classes}:any) => {
    return(
        <Stack width={{md:"30vw"}} ml={2} spacing={4}
         py="2" className={classes.mainSubscriptionContainer}>
            <Image boxSize={["6rem", "9.37rem"]}
                src={Growth} my="2" />
            <Heading color="primary" maxWidth="xs" textAlign="center"
             fontSize={["1.5rem", "2.3rem"]} >
                Upgrade to Pro Plan
        </Heading>
            <Text color="#151C4D" as="i" my="3" fontSize={["1rem", "2rem"]} >
                NGN40,000
            <Box as='span' opacity="0.5"
                    fontSize={[".8rem", "2.18rem"]}
                >
                   /mo
            </Box>
            </Text>
            <Stack spacing={3}>
                {[null,null,null,null].map((item,idx) => (
                    <SubscriptionAdvert key={idx} />
                ))}
            </Stack>
                <Link to="/verify" >
                    <Button bgColor="primary" maxWidth="18rem"
                     width={{base:"100%",md:"52vw"}} color="white" >
                        Upgrade Now
                    </Button>
                </Link>
        </Stack>
    )
}

const SubscriptionCardMinor = ({classes}:any) => {
    return(
        <Stack className={classes.minorSubscriptionContainer} spacing="6" width={{md:"30vw"}} py="2" mr={2}>
            <Image boxSize={["5rem"]}
                src={Growth3} my="2" />
            <Heading color="#8B8B8B" fontSize={["1.2rem", "2.69rem"]} >
                Free Plan
            </Heading>
            <Text textAlign="center" fontSize={[".8rem","initial"]} >
                free pro plan for 3 months
            </Text>
            <Stack spacing={3}>
                {[null,null,null,null].map((item,idx) => (
                    <SubscriptionAdvert color="#8B8B8B" key={idx} />
                ))}
            </Stack>
                    <Button width={["95%","initial"]}
                     fontSize={[".9rem","1.17rem"]} bgColor="#8B8B8B" >
                        <Link to="/verify" >
                            Continue with free plan
                    </Link>
                    </Button>
        </Stack>
    )
}


const Subscription = () => {
    const classes = useStyles()
    return (
        <ModalContent bgColor="bgColor2" pt={5} pb={16} >
            <ModalHeader></ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalBody color="#F3F3F3" display="flex"
                flexDirection="column" alignItems="center" >
                <Heading color="primary" fontSize={["2.5rem", "2.82rem"]}
                    textAlign="center" >
                    Subscribe Now
                </Heading>
                {/* <Text color="#151C4D" fontSize="1.25rem"
                    textAlign="center" my="4" >
                    With free Church verification
            </Text> */}
            <Flex flex={1} align="flex-end" justify="space-evenly" width="100%" >
                <SubscriptionCardMinor classes={classes}/>
                <SubscriptionCardMain classes={classes}/>
            </Flex>
            </ModalBody>
        </ModalContent>
    )
}
export default Subscription