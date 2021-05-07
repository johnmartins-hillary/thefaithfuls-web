import { VStack,Image,Icon,Text } from "@chakra-ui/react"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { LandingImage } from "assets/images"
import React from "react"
import { FiShare2 } from "react-icons/fi"

const mediaStyles = makeStyles(theme => createStyles({
    root:{
        position:"relative",
        maxWidth:"15rem",
        height:"90%",
        maxHeight:"13rem",
        cursor:"pointer",
        margin:theme.spacing(2),
        "& > img":{
            borderRadius:"10px"
        },
        "& p":{
            fontFamily:"MontserratRegular"
        },
        "& > svg":{
            position:"absolute",
            borderRadius:"50%",
            padding:".3rem",
            bottom:"17%",
            left:"2%"
        }
    }
}))

interface IMedia {
    title:string;
    image?:string;
    showShare?:boolean;
    [key:string]:any;
}
const MediaCard:React.FC<IMedia> = ({title,showShare=false,image,...props}) => {
    const classes = mediaStyles()
    return(
        <VStack className={classes.root} {...props}>
            <Image src={image} boxSize='100%'
             objectFit="cover" fallbackSrc={LandingImage} />
            {showShare &&
            <Icon boxSize="2.2rem" as={FiShare2}
                bgColor="primary" color="white" />
           }
            <Text color="#151C4D" fontSize="1rem"
             maxWidth="2xs"
            >
            {title || "Wait till i get my money"}
            </Text>
        </VStack>
    )
}

export default MediaCard