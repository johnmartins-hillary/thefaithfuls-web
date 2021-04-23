import { VStack,Skeleton, HStack,Avatar,Text, Heading } from "@chakra-ui/react"
import React from "react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import {formatDistanceToNow} from "date-fns"

interface IDetailProps {
    image?:string;
    title:string;
    smallText?:string;
    subtitle?:string;
    timing?:Date
    body?:string;
    isLoaded?:boolean
}
const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        maxWidth:"25rem",
        backgroundColor:"white",
        "& > div":{
            maxWidth:"25rem",
            padding:theme.spacing(2),
            alignItems:"flex-start"
        },
        "& p":{
            maxHeight:"35rem",
            overflowY:"auto",
            // [theme.breakpoints.down("sm")]:{
            //     fontSize:"1.5rem"
            // }
        },
        "& button":{
            fontSize:"0.625rem"
        }
    }
}))

const DetailCard:React.FC<IDetailProps> = ({image,isLoaded=true,title,children,timing,smallText,subtitle,body}) => {
    const classes = useStyles()
    return(
        <Skeleton className={classes.root} isLoaded={isLoaded}>
        <VStack spacing={4} >
                <HStack align="center" flex={1} width="100%">
                    {
                        image &&
                        <Avatar
                            size="md" name="Temitope Emmanuel"
                            src={image} />
                    }
                    <VStack mr="auto" align="flex-start">
                        <Heading as="h5" size="sm" >
                            {title}
                        </Heading>
                        {smallText &&
                            <Text opacity={.7}>
                                {smallText}
                            </Text>
                        }
                    </VStack>
                    {timing &&
                        <Text opacity={.9}>
                            {formatDistanceToNow(timing as Date)}
                        </Text>
                    }
                </HStack>
                <VStack align="flex-start">
                    {subtitle &&
                    <Heading as="h6" size="xs" >
                        {subtitle}
                    </Heading>
                }
                    <Text textStyle="styleh6">
                        {body}
                    </Text>
                </VStack>
                {children}
            </VStack>
        </Skeleton>
    )
}


export default DetailCard