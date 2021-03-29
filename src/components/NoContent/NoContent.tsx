import React from "react"
import {EmptyState} from "assets/images"
import {Box,Image} from "@chakra-ui/react"
import {makeStyles,createStyles} from "@material-ui/core/styles"
import {primary} from "theme/palette"


const useStyles = makeStyles((theme) => createStyles({
    root:{
        display:"flex",
        flexDirection:"column",
        // margin:"auto !important",
        alignItems:"center",
        justifyContent:"center",
        "& button":{
            fontFamily:"MulishRegular",
            width:"16.5rem",
            padding:theme.spacing(3,0)
        },
        "& p":{
            fontFamily:"MulishRegular !important",
            fontSize:"1.75rem",
            whiteSpace:"nowrap",
            color:primary,
            margin:theme.spacing(5,0),
            fontWeight:500,
        }
    },
    align:{
        [theme.breakpoints.up("sm")]:{
            // marginLeft:"50%",
            // transform:"translateX(50%)"
        }
    }
}))

interface IProps {
    align?:boolean
}

const NoContent:React.FC<IProps> = ({children,align = true}) => {
    const classes = useStyles()
    return(
        <Box className={`${classes.root} ${align ? classes.align : ""} `}>
            <Image src={EmptyState} />
            {children}
        </Box>
    )
}


export default NoContent