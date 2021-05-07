// *https://www.registers.service.gov.uk/registers/country/use-the-api*
// import fetch from 'cross-fetch';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete,{AutocompleteProps} from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {FieldProps,Field} from "formik"
import { createStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core';


interface IProps extends Partial<AutocompleteProps<any,any,any,any>> {
  style?:object;
  options:any[];
  getLabel?:(arg:any) => string;
  getSelected:(arg1:any,arg2:any) => any;
  className?:any;
  name:string;
  label?:string;
  func?:any;
  val?:any;
  // [key:string]:any;
}

const useStyles = makeStyles((theme) => createStyles({
  root:{
    "& label":{
      color: "#00000099",
      fontWeight: "bold",
      fontFamily: 'MulishRegular'
    }
  }
}))

const MaterialSelect:React.FC<IProps> = ({
  name,func,className,label,val,children,options,getLabel,getSelected,style
  ,...props
}) => {
  const [open, setOpen] = React.useState(false);
  // const [options, setOptions] = React.useState<CountryType[]>([]);
  const loading = open && options.length === 0;
  const classes = useStyles()
  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    if(func){
      func(val)
    }

    // (async () => {
    //   const response = await fetch('https://country.register.gov.uk/records.json?page-size=5000');
    //   await sleep(1e3); // For demo purposes.
    //   const countries = await response.json();

    //   if (active) {
    //     setOptions(Object.keys(countries).map((key) => countries[key].item[0]) as CountryType[]);
    //   }
    // })();

    return () => {
      active = false;
    };
  }, [loading]);

  // React.useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);




  return (
    <Field name={name} >
      {({field,form}:FieldProps) => (
      <Autocomplete
        id={`${label}-${name}`}
        open={open} 
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        style={style || undefined}
        onChange={(evt:any,newValue:any | null) => {
          form.setFieldValue(name,newValue,true)
        }} 
        value={field.value}
        getOptionSelected={getSelected}
        getOptionLabel={getLabel}
        options={options} loading={loading} autoHighlight
        {...props}
        renderInput={(params:any) => (
          <TextField
            {...params}
            label={label} className={classes.root}
            error={Boolean(form.touched[name] && form.errors[name])}
            helperText={form.touched[name]  && form.errors[name]} 
            variant="outlined" fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      )}
    </Field>
  );
}


export default MaterialSelect