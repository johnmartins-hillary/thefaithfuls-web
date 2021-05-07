import React from "react"
import {NumberInputProps, useStyleConfig,
        NumberDecrementStepper, NumberIncrementStepper, NumberInput,
        NumberInputField, NumberInputStepper
} from "@chakra-ui/react";
import { Field, FieldProps } from "formik"
import { makeStyles, createStyles } from "@material-ui/styles"


const useStyles = makeStyles(theme => (
    createStyles({
        input: {
            border:"1px solid #000000",
            background:"transparent !important",
            "&::placeholder": {
                color: "black",
                fontSize: "1rem"
            },
            "&:focus":{
                borderColor: "#b603c9 !important",
                boxShadow: "0 0 0 1px #b603c9 !important"
            }
        }
    })
))



interface IProps extends NumberInputProps {
    name: string;
    label?:string;
    [key:string]:any;
}

const NormalInput: React.FC<IProps> = ({name,label,...props }) => {
    
    const styles = useStyleConfig("Input", {})
    const classes = useStyles()
    return (
        <Field name={name}>
            {({ field, form }: FieldProps) => {

                const setValue = (valueAsString:string,valueAsNumber:number) => {
                    form.setValues({
                        ...form.values,
                        [name]:valueAsNumber
                    })
                }
                
                return (
                    <NumberInput sx={styles} className={classes.input}
                        isInvalid={Boolean(form.touched[name]) && Boolean(form.errors[name])}
                        id={name} {...props} {...field} onChange={setValue} value={field.value}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                )
            }}
        </Field>
    );
}


export default React.memo(NormalInput)