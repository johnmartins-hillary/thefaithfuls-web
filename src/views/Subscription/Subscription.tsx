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


const useStyles = makeStyles((theme:Theme) => createStyles({
  root:{
    maxWidth:"175rem",
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
  subscriptionDetail:{
    boxShadow:"0px 5px 20px #0000001A",
    alignItems:"flex-end",
    minHeight:"17.7rem",
    height:"auto",
    width:"95%",
    borderRadius:"10px",
    backgroundColor:"white",
    "& > div:first-child":{
      flexDirection:"column",
      justifyContent:"flex-start"
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
          <Flex flex={10} direction="column" mr={3} alignItems="center">
            <Flex py="7" px="3" className={classes.subscriptionDetail}>
              <Stack flex={[4,3,1]} spacing={7} m={4}>
                <Heading fontWeight="400" fontSize="1.5rem">
                    Your yearly subscription
                </Heading>
                    <Text fontSize="0.875rem" fontWeight="600" as="i" opacity={0.5} color="#151C4D">
                        Renew date: 3 october, 2020
                    </Text>
                <Flex direction="column">
                  <Text fontSize="0.875rem" color="#151C4D"
                   opacity={0.5} fontWeight="600">
                    Your Current Plan
                  </Text>
                  <Heading mt="-.6rem" fontSize="2.6875rem" fontWeight="600" color="primary">
                    Free Plan
                  </Heading>
                </Flex>
                <Text fontSize="3.25rem" as="i" color="#151C4D" opacity={0.5}>
                  ₦0
                </Text>
              </Stack>
              <Flex justify={{md:"space-around"}}
                direction={{base:"column-reverse",lg:"row"}}>
                <Button mt="3">Renew Plan</Button>
                <Image boxSize={{base:"90%",md:"75%"}}
                     maxWidth="18rem"
                    src={CreditCard}
                    />
              </Flex>
            </Flex>
            <Box bgColor="white" mt="20" pt="7" pl="4"
            shadow="0px 5px 20px #0000001A" borderRadius="10px"
            minHeight="17.7rem" height="auto" width="95%">
                <Heading as="h3" fontSize="1.5rem" >
                    Last Payment
                </Heading>
                <Stack
                  spacing={5} maxHeight="30vh" overflow="auto"
                  divider={<StackDivider borderColor="gray.200" />}
                >
                  <Stack color="#151C4D" fontSize="0.875rem"
                   mx="3" direction="row">
                    <Box opacity={.5} >Basic Plan</Box>
                    <Box opacity={.5} mx="5" >1st September 2020</Box>
                    <Box color="primary" fontWeight="600"
                    fontSize="1.5rem" >₦20,000</Box>
                  </Stack>
                  <Stack color="#151C4D" fontSize="0.875rem"
                   mx="3" direction="row">
                    <Box opacity={.5} >Basic Plan</Box>
                    <Box opacity={.5} mx="5" >1st September 2020</Box>
                    <Box color="primary" fontWeight="600"
                    fontSize="1.5rem" >₦20,000</Box>
                  </Stack>
                  <Stack color="#151C4D" fontSize="0.875rem"
                   mx="3" direction="row">
                    <Box opacity={.5} >Basic Plan</Box>
                    <Box opacity={.5} mx="5" >1st September 2020</Box>
                    <Box color="primary" fontWeight="600"
                    fontSize="1.5rem" >₦20,000</Box>
                  </Stack>
                  <Stack color="#151C4D" fontSize="0.875rem"
                   mx="3" direction="row">
                    <Box opacity={.5} >Basic Plan</Box>
                    <Box opacity={.5} mx="5" >1st September 2020</Box>
                    <Box color="primary" fontWeight="600"
                    fontSize="1.5rem" >₦20,000</Box>
                  </Stack>
                  <Stack color="#151C4D" fontSize="0.875rem"
                   mx="3" direction="row">
                    <Box opacity={.5} >Basic Plan</Box>
                    <Box opacity={.5} mx="5" >1st September 2020</Box>
                    <Box color="primary" fontWeight="600"
                    fontSize="1.5rem" >₦20,000</Box>
                  </Stack>
                  <Stack color="#151C4D" fontSize="0.875rem"
                   mx="3" direction="row">
                    <Box opacity={.5} >Basic Plan</Box>
                    <Box opacity={.5} mx="5" >1st September 2020</Box>
                    <Box color="primary" fontWeight="600"
                    fontSize="1.5rem" >₦20,000</Box>
                  </Stack>
                </Stack>
            </Box>
          </Flex>
            <Flex mt={{base:"4",md:"0"}}
             flex={3} align="center" width={{base:"100%",sm:"auto"}}
              color="white" justify="center"
            >
              <Stack borderRadius="10px" 
                spacing="6" height="100%"
                justifyContent="center"
                bgColor="white"
                direction="column"
                align="center"
                py="2"
                width={["90vw","100%"]}
                shadow="0px 5px 20px #0000001A"
              >
                <Image
                  boxSize={["9rem", "11.37rem"]}
                  src={Growth}
                  my="2"
                />
                <Heading
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
                    <Box
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
