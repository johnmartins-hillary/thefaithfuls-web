import React from "react"
import {
  FormControl, Icon, FormLabel,
  FormErrorMessage, Input, useStyleConfig,
  InputGroup, InputRightElement
} from "@chakra-ui/react";
import { Field, FieldProps } from "formik"
import { makeStyles, createStyles } from "@material-ui/styles"
import { AiFillEyeInvisible } from "react-icons/ai"
import { BiShow } from "react-icons/bi"
import owasp from "owasp-password-strength-test"



interface IProps {
  placeholder?: string;
  name: string;
  label?: string;
  [key: string]: any;
}

const PasswordInput: React.FC<IProps> = ({ placeholder,label, name, ...props }) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const styles = useStyleConfig("Input", {})
  
  React.useEffect(() =>{ 
    owasp.config({
      allowPassphrases: false,
      maxLength: 50,
      minLength: 10,
      minOptionalTestsToPass: 4
    })
  },[])
  
  const validate = (value: string) => {
    let errorMessage;
    const passwordTest = owasp.test(value)
    if (passwordTest.errors) {
      errorMessage = passwordTest.errors[0]
    } 
    return errorMessage;
  };
  
  return (
    <Field name={name} validate={validate} >
      {({ field, form }: FieldProps) => {
        return (
          <FormControl my={["2"]}  {...props}
            isInvalid={Boolean(form.touched[name]) && Boolean(form.errors[name])}>
            { label && <FormLabel fontWeight="500" color="primary">{label}</FormLabel>}
            {
              <InputGroup size="md">
                <Input sx={styles} placeholder={placeholder}
                  pr="4.5rem" {...field} id={name}
                  type={show ? "text" : "password"}
                />
                <InputRightElement width="4.5rem">
                  <Icon cursor="pointer" color="black" bgColor="green"
                    onClick={handleClick}
                    as={show ? BiShow : AiFillEyeInvisible}
                  />
                </InputRightElement>
              </InputGroup>
            }
            { form.touched[name]  && 
                  form.errors[name] &&
                  <FormErrorMessage fontFamily="Bahnschrift" >{form.errors[name]}</FormErrorMessage>
                }
          </FormControl>
        )
      }}
    </Field>
  );
}


export default React.memo(PasswordInput)