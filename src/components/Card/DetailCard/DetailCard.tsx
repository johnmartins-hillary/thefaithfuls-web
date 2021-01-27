import { VStack,Skeleton, HStack,Avatar,Text, Heading } from "@chakra-ui/react"
import React from "react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"

interface IDetailProps {
    image?:string;
    title:string;
    smallText?:string;
    subtitle?:string;
    timing?:string
    body?:string;
    isLoaded?:boolean
}
const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        maxWidth:"25rem",
        backgroundColor:"white",
        "& > div":{
            maxWidth:"25rem",
            alignItems:"flex-start",
            padding:theme.spacing(3,2)
        },
        "& p":{
            maxHeight:"35rem",
            overflowY:"auto",
            [theme.breakpoints.down("sm")]:{
                fontSize:"1.5rem"
            }
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
                    <VStack mr="auto" align="flex-start" width="100%" >
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
                            {timing}
                        </Text>
                    }
                </HStack>
                <VStack align="flex-start">
                    {subtitle &&
                    <Heading as="h6" size="xs" >
                        {subtitle}
                    </Heading>
                }
                    <Text>
                        {body}
                    </Text>
                </VStack>
                {children}
            </VStack>
        </Skeleton>
    )
}


export default DetailCard