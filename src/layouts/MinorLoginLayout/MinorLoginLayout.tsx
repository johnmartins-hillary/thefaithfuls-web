import React from "react"
import {Flex,IconButton,Box,Icon} from "@chakra-ui/react"
import {Logo} from "components/Logo"
import {LoginLayout} from "layouts"
import {CgCloseO} from "react-icons/cg"
import {useHistory} from "react-router-dom"
import {createStyles,makeStyles,Theme} from "@material-ui/core/styles"


interface IProps {
    children:any;
    showLogo:boolean
}

const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        "& p,button":{
            fontFamily:"MulishRegular"
        },
        "& h2":{
            fontFamily:"MulishLight"
        }
    }
}))

const MinorLoginLayout:React.FC<IProps> = ({children,showLogo}) => {
    const history = useHistory()
    const classes = useStyles()
    const handleLocation = () => {
        history.goBack()
    }
    return(
        <LoginLayout className={classes.root} >
            <Flex position="relative" flex={[1,3]} pr={{sm:"5", md:"24"}}
             pt={{sm:"5", md:"16"}} ml={[0,"2","32"]} flexDirection={["column","row-reverse"]}
            >   
            <IconButton aria-label="close-btn" bgColor="transparent" onClick={handleLocation} icon={
                <Icon as={CgCloseO} color="#383838"
                 opacity={.5} boxSize="2rem"  />
            } />
                {
                    showLogo && 
                <Box position="absolute" display={["none","block"]} left="0" top={["2rem","10rem"]}>
                    <Logo white={false} />
                </Box>
                }
                {children}
            </Flex>
        </LoginLayout>
    )
}


export default MinorLoginLayout