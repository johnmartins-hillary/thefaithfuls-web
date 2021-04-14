import React from  "react"
import DatePickerComponent from "react-date-picker"
import {Flex} from "@chakra-ui/react"
import {makeStyles,createStyles,Theme} from "@material-ui/core/styles"
import {FaRegCalendarAlt} from "react-icons/fa"

const useStyles = makeStyles((theme:Theme) => createStyles({
    root:{

    },
    dateContainer: {
        borderColor: "2px solid black",
        width:"100%",
        color: "#00000099",
        fontFamily:"MulishRegular",
        fontWeight:"bold",
        background:"transparent",
        "& > *": {
            height:"2rem",
            // padding: ".7rem 1.7rem !important",
            // paddingLeft: ".4rem !important",
            borderRadius: "3px",
            "& select": {
                appearance: "none"
            }
        }
    }
}))


interface IProps {
    name:string;
    value:Date;
    onChange(arg:Date|Date[]):void;
    minDate?:Date;
    showCalendarIcon?:boolean
    [key:string]:any;
}

const DatePicker:React.FC<IProps> = ({name,value,minDate,showCalendarIcon = false,onChange,...props}) => {
    const classes = useStyles()
    const currentDate = new Date()

    return(
        <Flex {...props}>
            <DatePickerComponent name={name} format="MMM dd,y" calendarIcon={showCalendarIcon ? <FaRegCalendarAlt/> : null}
             clearIcon={null}
            onChange={onChange} value={value} 
            className={classes.dateContainer} minDate={minDate || currentDate}
        />                                    
        </Flex>
    )
}

export default DatePicker