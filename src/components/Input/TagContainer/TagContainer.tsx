import React from "react"
import {
    FormControl, Flex, FormLabel,
    Menu, Button, MenuButton,
    MenuList, MenuItem,FormErrorMessage,
} from "@chakra-ui/react"
import { makeStyles, createStyles } from "@material-ui/core"
import { IoIosArrowDown } from "react-icons/io"
import { Tag } from "components/Tag"
import { Field, FieldProps } from "formik"


type Props<T, K extends keyof T> = {
    name: string;
    active: T[];
    value: K;
    add(arg: T): void;
    remove(arg: T): void;
    tags: T[];
    [key: string]: any
}

const tagStyles = makeStyles((theme) => createStyles({
    root: {
        border: `1px solid rgba(0,0,0,.5)`,
        position: "relative",
        height: "56px",
        padding: "0.9rem",
        alignItems: "center",
        borderRadius: "4px",
        "& > *:first-child": {
            position: "absolute",
            top: "-20%",
            left: "5%",
            width: "max-content"
        },
        "& > button":{
            boxShadow:"none !important",
            backgroundColor:"transparent",
            "&::active":{
                backgroundColor:"transparent",
                boxShadow:"none !important"
            }
        }
    },
    menuList: {
        // left: "initial !important",
        // width:"20rem",
        maxHeight: "15rem",
        overflowY: "auto",
        // [theme.breakpoints.up("sm")]: {
        //     width: "30vw"
        // }
    }    
}))



function TagContainer<T, K>({ name, value, add, active, remove, tags, ...props }: Props<T, K extends keyof T ? any : any>) {
    const classes = tagStyles()
    return (
        <Field name={name}>
            {({ field, form, meta }: FieldProps) => (
                <Menu>
                    <FormControl as={Flex}
                        className={classes.root} {...props} >
                        <FormLabel bgColor="bgColor2" color="inputColor"
                            htmlFor={name} >{name}</FormLabel>
                        {active.map((item, idx) => (
                            <Tag key={idx} remove={remove(item)} name={item[value]} />
                        ))}
                        <MenuButton as={Button} ml="auto" rightIcon={<IoIosArrowDown />} />
                    </FormControl>
                    <FormControl mt="0 !important">
                            {
                            form.errors[name] &&
                            <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                            }
                    </FormControl>
                    <MenuList className={classes.menuList} left={0} >
                        {tags.length > 0 ? tags.map((item, idx) => (
                            <MenuItem key={`${item[value]}-${name}`} onClick={(add(item) as any)} >
                                {item[value]}
                            </MenuItem>

                        )) :
                            <MenuItem disabled={true} key="unavailable" color="primary">
                                No Available Options
                            </MenuItem>
                        }
                    </MenuList>
                </Menu>
            )}
        </Field>
    )
}

export default TagContainer