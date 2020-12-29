import { Stack, Icon, VStack } from "@chakra-ui/react"
import { GoBackButton } from "components/GoBackButton"
import React from "react"
import { CgCloseO } from "react-icons/cg"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: "100%",
        maxWidth: "70rem",
        align: "flex-start"
    },
    formContainer: {
        backgroundColor: "#F3F3F3",
        minHeight: "70vh",
        overflowX: "hidden",
        paddingBottom: "2rem",
        alignItems: "flex-start !important"
    }
}))




interface IProps {

}

const CreateLayout:React.FC<IProps> = ({children}) => {
    const classes = useStyles()

    return (
        <Stack className={classes.root}>
            <GoBackButton disabled={false} alignSelf="flex-end" border="none" >
                <Icon color="tertiary" opacity={.75} fontSize="2rem" as={CgCloseO} />
            </GoBackButton>
            <VStack spacing={14} className={classes.formContainer} pr={{ md: 16 }}
                width={["98%", "100%", "75%"]} pl={{ base: 3, md: 12 }} pt={{ base: 12 }}>
                    {children}
            </VStack>
        </Stack>
    )
}

export default CreateLayout