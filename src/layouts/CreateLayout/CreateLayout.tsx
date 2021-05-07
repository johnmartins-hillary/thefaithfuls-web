import { Stack, Icon, VStack } from "@chakra-ui/react"
import { GoBackButton } from "components/GoBackButton"
import React from "react"
import { CgCloseO } from "react-icons/cg"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: "100%",
        maxWidth: "70rem",
        alignItems: "center",
        "& p,button":{
            fontFamily:"MulishRegular"
        },
        "& .react-time-picker, .react-date-picker__wrapper":{
            height:"2.5rem",
            minWidth:"7rem",
            fontFamily:"MulishRegular",
            fontWeight:"bold"
        }
    },
    formContainer: {
        backgroundColor: "#F3F3F3",
        minHeight: "70vh",
        // overflowX: "hidden",
        paddingBottom: "2rem",
        "& > first-child":{
            width:"80%",
            maxWidth:"80rem"
        },
        "& > div:nth-child(2),& > div:nth-child(3)":{
            justifyContent:"center",
            textAlign:"center"
        }
    }
}))

interface IProps {
    showCancel?:boolean
}

const CreateLayout:React.FC<IProps> = ({showCancel = true,children}) => {
    const classes = useStyles()

    return (
        <Stack className={classes.root}>
            {showCancel && 
            <GoBackButton disabled={false} alignSelf={{md:"flex-end"}} border="none" >
            <Icon color="tertiary" opacity={.75} fontSize="2rem" as={CgCloseO} />
        </GoBackButton>}
            <VStack spacing={14} className={classes.formContainer} pr={{ md: 16 }}
                width={["90vw", "100%", "75%"]} p={{ base: 3, md: 12 }}>
                    {children}
            </VStack>
        </Stack>
    )
}

export default CreateLayout