import React from 'react';
import { withStyles, Theme, createStyles} from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import {TableCell} from "."


const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      cursor:"pointer",
      '&:first-child': {
        backgroundColor: "transparent",
      },
    }
  })
)(TableRow);



interface IProps{
  fields:any[];
  isLoaded:boolean;
  link?:any
}

const StyledRow:React.FC<IProps> = ({fields,link}) => (
  <StyledTableRow onClick={link ? link : null}>
    {fields.map((item,idx) => (
      <TableCell key={idx} >
        {item}
      </TableCell>
    ))}
  </StyledTableRow>
)

export default StyledRow