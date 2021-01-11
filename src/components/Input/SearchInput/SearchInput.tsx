import { InputGroup, Icon, Input,Flex,FlexProps, InputLeftElement } from "@chakra-ui/react"
import React from "react"
import { RiSearchLine } from "react-icons/ri"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"

interface IProps extends FlexProps {
    value:string;
    setValue:any;
    [key:string]:any
}

const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{
        border:`1px solid rgb(21, 28, 77,.5)`,
        borderRadius:"4px",
        "& input":{
            fontFamily:"MontserratRegular !important",
            backgroundColor:"transparent"
        }
    }
}))

const SearchInput:React.FC<IProps> = ({value,setValue,...props}) => {
    const classes = useStyles()

    return (
        <Flex  {...props}>
            <InputGroup className={classes.root}>
                <InputLeftElement
                    pointerEvents="none"
                    children={<Icon boxSize="1.5rem" opacity={.5} as={RiSearchLine} />}
                />
                <Input type="text" placeholder="Search"
                value={value} onChange={setValue}
                />
            </InputGroup>
        </Flex>
    )
}

export default SearchInput