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


const useStyles = makeStyles(theme => (
  createStyles({
    input: {
      textTransform: "none",
      backgroundColor: "transparent",
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
  readOnly?: boolean;
  ref?: React.RefObject<HTMLInputElement>
}

const NormalInput: React.FC<IProps> = ({ 
  placeholder, showErrors = true, icon, label,
   name, type = "text", ref, readOnly, ...props }) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const styles = useStyleConfig("Input", {})
  const classes = useStyles()
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