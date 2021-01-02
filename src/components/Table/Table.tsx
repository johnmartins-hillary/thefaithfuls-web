import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from "@material-ui/core/TablePagination"
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import {TableRow } from "."

const useStyles = makeStyles({
    root:{
        backgroundColor:"transparent",
        maxHeight:440
    },
    table: {
        minWidth: 200,
        borderRadius:"0 0 4px 4px",
        boxShadow:" 0px 5px 10px #20A2A01A",
        border:"0.5px solid #01C09233",
        borderTopWidth:"0",
        "& thead":{
            backgroundColor:"#F9F5F9"
        },
        "& td:last-child":{
            display:"none"
        },
        "& > *:nth-child(2)":{
            backgroundColor:"white"
        }
    },
});

interface IProps {
    heading: any[];
    rowLength:number
}


const CustomizedTables: React.FC<IProps> = ({ children, heading,rowLength }) => {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper>
        <TableContainer className={classes.root}>
            <Table stickyHeader className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow isLoaded={true} fields={heading}
                    />
                </TableHead>
                <TableBody>
                    {children}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rowLength}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
        </Paper>
    );
}

export default CustomizedTables