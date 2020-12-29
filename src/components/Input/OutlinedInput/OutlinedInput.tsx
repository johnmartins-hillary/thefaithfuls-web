import React from "react"
import {FormControl,FormLabel,Input,FormErrorMessage} from "@chakra-ui/react"
import {Field,FieldProps,} from "formik"
import {makeStyles,createStyles} from "@material-ui/styles"
import {primary,bgColor2} from "theme/palette"


interface IProps {
    label:string;
    color?:string;
    name:string;
    readonly?:boolean;
    value?:string;
    [key:string]:any;
}

const useStyles = makeStyles((theme) => createStyles({
    root:{
        height:"3.5em",
        border:`1px solid ${primary}`,
        display:"flex",
        flexDirection:"column",
        position:"relative",
        marginTop: "auto",
        "& > *:first-child":{
            backgroundColor:bgColor2,
            color:primary,
            width:"max-content",
            position:"absolute",
            top:"-10px",
            left:"20px"
        }
    }
}))

const OutlinedInput:React.FC<IProps> = ({label,readonly = false,value,name,color="primary",...props}) => {
    const classes = useStyles()
    return(
        <Field name={name}>
            {({field,form}:FieldProps) => (
                <FormControl className={classes.root} mb={ form.touched[name] && form.errors[name] ? 4 : 1}
                    width={["100%", "100%", "45%"]} {...props} isReadOnly={readonly} 
                    isInvalid={Boolean(form.touched[name]) && Boolean(form.errors[name])}
                    pb="3" borderRadius=".2rem" id={name}>
                   <FormLabel px="1">
                       {label}
                   </FormLabel>
                   <Input {...field} value={value || field.value} bgColor="transparent" mt={4} outline="none"
                        border="none" id={name} _focus={{
                        border:"primary"
                    }} />
                   {
                    form.touched[name]  && 
                    form.errors[name] &&
                        <FormErrorMessage my={4}>{form.errors[name]}</FormErrorMessage>
                    //   : 
                    //   <Alert status="success">
                    //     <AlertIcon />
                    //     Valid Input
                    // </Alert> : null
                    }
               </FormControl >
            )}
        </Field>
    )
}

export default OutlinedInput