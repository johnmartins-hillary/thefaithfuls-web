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
import useToast from "utils/Toast"

const useStyles = makeStyles(theme => (
  createStyles({
    input: {
      textTransform: "none",
      "&::placeholder": {
        color: "black",
        fontSize: "1rem"
      }
    }
  })
))



interface IProps {
  placeholder?: string;
  name: string;
  icon?: any;
  type?: "text" | "email" | string | "password";
  label?: string;
  [key: string]: any;
  showErrors?: boolean;
}

const PasswordInput: React.FC<IProps> = ({ placeholder, showErrors = true, icon, label, name, type = "text", ...props }) => {
  const [show, setShow] = React.useState(false);
  const toast = useToast()
  const handleClick = () => setShow(!show);
  const styles = useStyleConfig("Input", {})
  const classes = useStyles()
  owasp.config({
    allowPassphrases: false,
    maxLength: 50,
    minLength: 10,
    minOptionalTestsToPass: 4
  })
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
                <Input sx={styles} className={classes.input}
                  pr="4.5rem" {...field} id={name}
                  type={show ? "text" : "password"}
                  placeholder={placeholder}
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