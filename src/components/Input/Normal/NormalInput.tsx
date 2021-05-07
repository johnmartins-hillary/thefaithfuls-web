import React from "react"
import {
  FormControl, FormLabel,
  FormErrorMessage, Input, useStyleConfig,
} from "@chakra-ui/react";
import { Field, FieldProps } from "formik"


interface IProps {
  placeholder?: string;
  name: string;
  icon?: any;
  type?: "text" | "email" | string | "password";
  label?: string;
  [key: string]: any;
  showErrors?: boolean;
  readOnly?: boolean;
  ref?: React.RefObject<HTMLInputElement>
}

const NormalInput: React.FC<IProps> = ({ 
  placeholder, showErrors = true, icon, label,
   name, type = "text", ref, readOnly, ...props }) => {
  const styles = useStyleConfig("Input", {})
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        return (
          <FormControl my={["2"]}  {...props}
            isInvalid={Boolean(form.touched[name]) && Boolean(form.errors[name])}>
            { label && <FormLabel fontWeight="500" color="primary">{label}</FormLabel>}
            {
                  <Input sx={styles} type={type || "text"} {...field} id={name}
                    placeholder={placeholder} />
            }
            { form.touched[name] &&
              form.errors[name] &&
              <FormErrorMessage fontFamily="Bahnschrift" >{form.errors[name]}</FormErrorMessage>
            }
          </FormControl>
        )
      }}
    </Field>
  );
}


export default React.memo(NormalInput)