import React from "react"
import {FormControl} from "@chakra-ui/react";
import {Field,FieldProps} from "formik"
import { Checkbox } from "@chakra-ui/react";

interface IProps {
  name:string;
  children:any;
}

const InputComponent:React.FC<IProps> = ({children,name}) => {  
    return (
      <Field name={name}>
        {({ field, form }:FieldProps) => {
          return(
            <FormControl my={["2"]} isInvalid={Boolean(form.touched[name]) && Boolean(form.errors[name])}>
              <Checkbox {...field}>
                {children}
              </Checkbox>
            </FormControl>
          )
        }}
      </Field>
    );
  }


  export default InputComponent