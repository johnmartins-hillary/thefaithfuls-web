import React from 'react';
import { withStyles, Theme, createStyles} from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import {tertiary,bgColor} from "theme/palette"

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: bgColor,
      color: tertiary,
      fontFamily:"Mulish ,Roboto, Helvetica,Arial, sans-serif",
      fontWeight:600,
      // opacity:.5,
      fontSize:15,
      [theme.breakpoints.up("sm")]:{
        fontSize: 20
      }
    },
    body: {
      fontFamily:"Mulish ,Roboto, Helvetica,Arial, sans-serif",
      fontWeight:600,
      fontSize: 15,
      opacity:.85,
      [theme.breakpoints.up("sm")]:{
        fontSize: 20
      }
    }
  }),
)(TableCell);

interface IProps{
}

const StyledCell:React.FC<IProps> = ({children}) => (
  <StyledTableCell>
    {children}
  </StyledTableCell>
)

export default StyledCell