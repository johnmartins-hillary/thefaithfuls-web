import React from "react"
import { Stack, Text, Flex, Skeleton, Heading, HStack, VStack, IconButton } from "@chakra-ui/react"
import { RiDeleteBinLine } from "react-icons/ri"
import { BiEdit } from "react-icons/bi"
import { Dot } from "assets/images"
import { makeStyles, createStyles } from "@material-ui/core/styles"


const dashboardStyles = makeStyles(() => createStyles({
    root: {
        boxShadow: "0px 5px 10px #0000000D",
        backgroundColor: "white",
        borderTop: "3px solid #B603C9",
        flexDirection: "column",
        borderRadius: "0 0 10px 10px",
        alignItems: "flex-start",
        maxHeight: "20rem",
        overflowY: "auto",
        position:"relative" ,
        "& > *:first-child": {
            color: "#151C4D",
            alignSelf: "center",
            fontSize: "1rem",
            display:"flex",
            alignItems:"center",
            flexDirection: "column",
            width: "100%",
            height: "100%",
        }
    }
}))

const activityStyles = makeStyles(() => createStyles({
    root: {
        align: "center",
        backgroundColor: "white",
        flexDirection: "column",
        shadow: " 0px 5px 10px #0000000D",
        borderTop: "3px solid purple",
        borderRadius: "0 0 0.625rem"
    }
}))

interface IActivityProps {
    title: string;
    date: string;
    dotColor: string;
}
interface IProps {
    children: any;
    [key: string]: any
}
interface IActivityCardComposition {
    Activity: React.FC<IActivityProps>
}
interface IDashboardActivity {
    children: React.ReactNode;
    heading?: string;
    isLoaded?: boolean;
    [key: string]: any
}
interface IFinanceActivity {
    heading: string;
    subHeading?: string;
    moreHeading?: string;
    text?: string;
    isLoaded:boolean
}

export const DashboardActivity: React.FC<IDashboardActivity> & IActivityCardComposition
    = ({ children, isLoaded = true, heading, ...props }) => {
        const classes = dashboardStyles()
        return (
            <Skeleton isLoaded={isLoaded} >
                <Flex className={classes.root}
                    minWidth={["auto", heading ? "13.5rem" : ""]}
                    // pt="2" width={["45vw", "auto"]} {...props}>
                    pt="2" {...props}>
                        <>
                            {heading &&
                                <Text position="sticky" top={0}
                                 bg="white" textAlign="center" fontWeight="600" >
                                    {heading}
                                </Text>
                            }
                            <Stack as="div" mt={4} align={{ base: "center", md: "flex-start" }}>
                                {children}
                            </Stack>
                        </>
                </Flex>
            </Skeleton>
        )
    }

export const FinanceActivity: React.FC<IFinanceActivity> = ({ heading,isLoaded, subHeading, moreHeading, text }) => {
    return (
        <Skeleton isLoaded={isLoaded}>
            <Flex width="100%" direction="column">
                <HStack spacing={2} width="100%"
                    justify="flex-end" flex={1}>
                    <IconButton aria-label="edit button"
                        icon={<BiEdit />} />
                    <IconButton aria-label="edit button"
                        icon={<RiDeleteBinLine />} />
                </HStack>
                <Stack spacing={4} direction="column" mx={5} mb={10} >
                    <Heading fontWeight={400} fontSize="1.5rem">
                        {heading}
                    </Heading>
                    <Stack fontSize="1.125rem"
                        color="#151C4D" opacity={.5} >
                        {subHeading &&
                            <Text>
                                {subHeading}
                            </Text>
                        }
                        {moreHeading &&
                            <Text>
                                {moreHeading}
                            </Text>
                        }
                        {text &&
                            <Text fontSize="0.875rem" maxWidth="md" >
                                {text}
                            </Text>
                        }
                    </Stack>
                </Stack>
            </Flex>
        </Skeleton>
    )
}

const ActivityCard: React.FC<IProps> = ({ children, ...props }) => {
    const classes = activityStyles()
    return (
        // <Flex align="center" bgColor="white" direction="column" shadow=" 0px 5px 10px #0000000D"
        //  borderTop="3px solid purple" borderRadius="0 0 0.625rem 0.625rem" {...props} >
        <Flex className={classes.root} {...props} >
            {children}
        </Flex>
    )
}

const Activity: React.FC<IActivityProps> = ({ title, date, dotColor }) => {
    return (
        <Stack my="3" direction="row" color="#4C1C51" >
            <Dot color={dotColor} />
            <VStack>
                <Text letterSpacing="0.28px" fontSize="0.875rem"
                    fontWeight="600">
                    {title}
                </Text>
                <Text color="#4C1C51" opacity={.8} fontSize="13.28px"
                    letterSpacing="0.24px" >
                    {date}
                </Text>
            </VStack>
        </Stack>
    )
}

DashboardActivity.Activity = Activity

export default ActivityCard