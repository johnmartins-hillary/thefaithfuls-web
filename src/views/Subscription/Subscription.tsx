import React from "react";
import {
  Box,StackDivider,Text,Flex,Heading,
  Stack,Icon,Image, FormControl, FormLabel, Switch
} from "@chakra-ui/react";
import {Button} from "components/Button"
import {useDispatch} from "react-redux"
import {setPageTitle} from "store/System/actions"
import { AiFillCheckCircle } from "react-icons/ai";
import {createStyles,makeStyles,Theme} from "@material-ui/core/styles"
import {Growth,CreditCard} from "assets/images"
import {tertiary} from "theme/palette"

const useStyles = makeStyles((theme:Theme) => createStyles({
  root:{
    maxWidth:"175rem",
    "& h3":{
      fontFamily:"MulishBold",
      opacity:.85,
      fontSize:"1.5rem"
    },
    [theme.breakpoints.up("sm")]:{
      padding:theme.spacing(5)
    },
    [theme.breakpoints.up("md")]:{
      padding:theme.spacing(10),
    },
  },
  toggleContainer:{
    display:"flex",
    alignItems:"center",
    justifyContent:"space-evenly",
    flexDirection:"row",
    "& label":{
      marginBottom:"0 !important",
      opacity:.5,
      letterSpacing:"0px",
      fontWeight:700
    }
  },
  subscriptionContainer:{
    "& > div:first-child":{
        boxShadow:"0px 5px 20px #0000001A",
        alignItems:"flex-end",
        minHeight:"17.7rem",
        height:"auto",
        width:"95%",
        borderRadius:"10px",
        backgroundColor:"white",
        "& > div:first-child":{
          flexDirection:"column",
          justifyContent:"flex-start",
          "& h3,h4,h5":{
            color:tertiary,
          },
          "& h2":{
            fontSize:"2.6875rem",
            fontFamily:"MulishBold"
          },
          "& h4":{
            fontSize:"0.875rem",
            fontFamily:"MontserratBold",
            fontWeight:"600",
            fontStyle:"italic",
            opacity:0.5
          },
          "& h5":{
            fontSize:"3.25rem",
            fontFamily:"MontserratBold",
            fontStyle:"italic",
            opacity:0.5
          },
          "& h6":{
            fontSize:"0.875rem",
            fontFamily:"MontserratRegular",
            color:"#151C4D",
            opacity:0.5,
            fontWeight:"600"
          }
        },
        "& > div:nth-child(2)":{
          height:"100%",
          flexShrink:1,
          flexDirection:"column-reverse", 
          alignItems:"flex-end" ,
          flex:2,
          "& img":{
            minWidth:"15rem"
          },
          [theme.breakpoints.up("md")]:{
            flexDirection:"row"
          }
      }
    },
    "& > div:nth-child(2)":{
      boxShadow:"0px 5px 20px #0000001A",
      marginTop:theme.spacing(7.5),
      paddingTop:theme.spacing(3.5),
      paddingLeft:theme.spacing(3),
      backgroundColor:"white",
      borderRadius:"10px",
      minHeight:"17.7rem",
      height:"auto",
      width:"95%",
      "& > div":{
        fontFamily:"MontserratBold",
        "& > div:nth-child(even)":{
          margin:theme.spacing(1)
        },
        "& > div":{
          marginLeft:"0"
        }
      }
    }
  },
  upgradeContainer:{
    borderRadius:"10px", 
    height:"100%",
    justifyContent:"center",
    backgroundColor:"white",
    flexDirection:"column",
    alignItems:"center",
    boxShadow:"0px 5px 20px #0000001A",
    "& h4":{
      fontFamily:"MulishBold"
    },
    "& label,h2":{
      fontFamily:"MontserratBold",
      fontStyle:"italic"
    }
  }
}))



const Subscription = () => {
  const classes = useStyles()
  const [year,setYear] = React.useState(false) 
  const dispatch = useDispatch()
  
  const handleToggle = () => {
    setYear(!year)
  }
  React.useEffect(() => {
    dispatch(setPageTitle("Subscription"))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <Flex direction="column" className={classes.root}>
        <Flex direction={{base:"column",lg:"row"}}>
          <Flex flex={7}  className={classes.subscriptionContainer} direction="column" mr={3} alignItems="center">
            <Flex py="7" px="3">
              <Stack flex={[4,3,1]} spacing={7} m={4}>
                <Heading as="h3">
                    Your yearly subscription
                </Heading>
                    <Text as="h4">
                        Renew date: 3 october, 2020
                    </Text>
                <Flex direction="column">
                  <Text as="h6">
                    Your Current Plan
                  </Text>
                  <Heading as="h2" mt="-.6rem" color="primary">
                    Free Plan
                  </Heading>
                </Flex>
                <Text as="h5" color="tertiary">
                  ₦0
                </Text>
              </Stack>
              <Flex justify={{md:"space-around"}}
                direction={{base:"column-reverse",lg:"row"}}>
                <Button mb={{md:"7"}} mt="3">Renew Plan</Button>
                <Image boxSize={{base:"90%",md:"75%"}}
                     maxWidth="18rem"
                    src={CreditCard}
                    />
              </Flex>
            </Flex>
            <Box>
                <Heading as="h3" fontSize="1.5rem" >
                    Last Payment
                </Heading>
                <Stack
                  spacing={5} maxHeight="30vh" overflow="auto"
                  divider={<StackDivider borderColor="gray.200" />}
                >
                  {[1,2,3,4,5,6].map((item,idx) => (
                    <Stack color="tertiary" fontSize="0.875rem" key={idx}
                      mx="3" direction="row" align="center" >
                     <Box opacity={.5} >Basic Plan</Box>
                     <Box opacity={.5} mx="5" >1st September 2020</Box>
                     <Box color="primary" fontWeight="600"
                     fontSize="1.5rem" >₦20,000</Box>
                   </Stack>
                  ))}
                </Stack>
            </Box>
          </Flex>
            <Flex mt={{base:"4",md:"0"}}
             flex={3} align="center" width={{base:"100%",sm:"auto"}}
              color="white" justify="center"
            >
              <Stack className={classes.upgradeContainer}
                width={["90vw","100%"]}
                py="2" spacing="6"
              >
                <Image
                  boxSize={["9rem", "11.37rem"]}
                  src={Growth}
                  my="2"
                />
                <Heading as="h4"
                  color="primary"
                  maxWidth="xs"
                  textAlign="center"
                  fontSize={["2rem", "2.3rem"]}
                >
                  Upgrade to Pro Plan
                </Heading>
                <FormControl width={["75%","63%"]} className={classes.toggleContainer}>
                  <FormLabel htmlFor="toggle-duration" color="tertiary">
                    monthly
                  </FormLabel>
                  <Switch id="toggle-duration" isChecked={year} onChange={handleToggle} />
                  <FormLabel htmlFor="toggle-duration" color="tertiary">
                    Annually
                  </FormLabel>
                </FormControl>
                <Text color="#151C4D" as="i" my="3" fontWeight={600} fontSize={["1.5rem", "2.5rem"]}>
                  {year ? "NGN408,000" : "NGN40,000"}
                  <Box as="span" opacity="0.5" fontSize={["1.3rem", "2rem"]}>
                    {year ? "/yr" : "/mo"}
                  </Box>
                </Text>
                <Stack spacing={3}>
                  {[1,2,3,4,5,6,7,8,9,10].map((item,idx) => (
                    <Box key={idx} >
                    <Icon
                      boxSize="1.01rem"
                      borderRadius="50%"
                      mr="3"
                      color="primary"
                      as={AiFillCheckCircle}
                    />
                    <Box fontFamily="MontserratBold !important" opacity={.5}
                      as="span"
                      fontSize={["0.8rem", "0.875rem"]}
                      color="#151C4D"
                    >
                      Unlimited Adverts
                    </Box>
                  </Box>
                  ))}
                </Stack>
                <Button
                  bgColor="primary"
                  maxWidth="18rem"
                  width="60vw"
                  color="white"
                >
                  Upgrade Now
                </Button>
              </Stack>
            </Flex>
        </Flex>
      </Flex>
  );
};

export default Subscription;
