import React from "react"
import {Flex,IconButton,Box,Icon,HStack} from "@chakra-ui/react"
import {Logo} from "components/Logo"
import {MainLoginLayout} from "layouts"
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
    },
    specialButton:{
        [theme.breakpoints.down("sm")]:{
            margin:"auto !important"
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
        <MainLoginLayout className={classes.root} >
             <Flex position="relative" flex={[1,3]} pr={{sm:"5", md:"24"}}
             pt={{sm:"4", md:"14"}} ml={[0,"2","32"]}
             flexDirection={["column"]}>
            <HStack w="100%" justifyContent="space-between" >
                {
                    showLogo && 
                <Box display={["none","block"]}>
                    <Logo white={false} />
                </Box>
                }
                <IconButton aria-label="close-btn" bgColor="transparent" 
                className={classes.specialButton}
                onClick={handleLocation} icon={
                    <Icon as={CgCloseO} color="#383838"
                    opacity={.5} boxSize="1.5rem"  />
                } />
            </HStack>
                {children}
            </Flex>
        </MainLoginLayout>
    )
}


export default MinorLoginLayout