import React from "react"
import {Flex} from "@chakra-ui/react"
import {Field,FieldProps,} from "formik"
import {makeStyles,createStyles,withStyles} from "@material-ui/core/styles"
import {primary} from "theme/palette"
import {TextField} from "@material-ui/core"


interface IProps {
    label:string;
    color?:string;
    name:string;
    readonly?:boolean;
    value?:string;
    [key:string]:any;
}

const useStyles = makeStyles((theme) => createStyles({
    margin: {
        margin: theme.spacing(1),
        width:"100%"
    }
}))

const ValidationTextField = withStyles({
    root: {
        height:"3.5rem",
      '& input:valid + fieldset': {
        borderColor: primary,
        borderWidth: 2,
      },
      "& label":{
          color:primary,
          fontSize:"1rem"
      },
      '& input:invalid + fieldset': {
        borderColor: 'red',
        borderWidth: 2,
      },
      '& input:valid:focus + fieldset': {
        borderLeftWidth: 6,
        padding: '4px !important', // override inline-style
      },
    },
  })(TextField);

const OutlinedInput:React.FC<IProps> = ({label,readonly = false,value,name,color="primary",...props}) => {
    const classes = useStyles()
    return(
        <Field name={name}>
            {({field,form}:FieldProps) => (
                <Flex  mb={ form.touched[name] && form.errors[name] ? 4 : 1}
                        width={["100%", "100%", "45%"]}  {...props} >
                    <ValidationTextField
                    className={classes.margin}
                    label={label} error={Boolean(form.touched[name]) && Boolean(form.errors[name])}
                    variant="outlined"
                    defaultValue="Success"
                    {...field}
                    id={name}
                />
                </Flex>
            //     <FormControl className={classes.root} mb={ form.touched[name] && form.errors[name] ? 4 : 1}
            //         width={["100%", "100%", "45%"]} {...props} isReadOnly={readonly} 
            //         isInvalid={Boolean(form.touched[name]) && Boolean(form.errors[name])}
            //         pb="3" borderRadius=".2rem" id={name}>
            //        <FormLabel px="1">
            //            {label}
            //        </FormLabel>
            //        <Input {...field} value={value || field.value} bgColor="transparent" mt={4} outline="none"
            //             border="none" id={name} _focus={{
            //             border:"primary"
            //         }} />
            //        {
            //         form.touched[name]  && 
            //         form.errors[name] &&
            //             <FormErrorMessage my={4}>{form.errors[name]}</FormErrorMessage>
            //         //   : 
            //         //   <Alert status="success">
            //         //     <AlertIcon />
            //         //     Valid Input
            //         // </Alert> : null
            //         }
            //    </FormControl >
            )}
        </Field>
    )
}

export default OutlinedInput