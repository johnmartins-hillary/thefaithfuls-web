import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Table,TablePagination,TableContainer,TableBody} from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import { TableRow } from "."
import { Dialog } from "components/Dialog"
import { ModalContent, ModalHeader,Flex,
    Heading, ModalCloseButton, ModalBody
    } from '@chakra-ui/react';
import { Button } from 'components/Button';
import { Select } from 'components/Input';
import { Formik, FormikProps } from 'formik';
import useTableService from './TableContext';



const useStyles = makeStyles({
    root: {
        backgroundColor: "transparent",
        maxHeight: 840
    },
    table: {
        minWidth: 200,
        borderRadius: "0 0 4px 4px",
        boxShadow: " 0px 5px 10px #20A2A01A",
        border: "0.5px solid #01C09233",
        borderTopWidth: "0",
        "& thead": {
            backgroundColor: "#F9F5F9"
        },
        "& ": {
            fontFamily: "MontserratBold"
        },
        "& > *:nth-child(2)": {
            backgroundColor: "white"
        }
    },
});

interface IProps {
    heading: any[];
    rowLength: number
}

const initialValues = {
    filterBy: ""
}

type FormType = typeof initialValues
const FilterDialog: React.FC<{
    close:() => void,
    filterOptions:string[],
    setFilter:(arg:string) => void
}> = React.memo(({close,filterOptions,setFilter}) => {

    const handleSubmit = (values: FormType, { ...actions }: any) => {
        setFilter(values.filterBy)
        close()
    }

    return (
        <ModalContent bgColor="#F3F3F3" >
            <ModalHeader color="primary" fontWeight="400" >
                <Heading fontWeight="400" mt="5" textAlign="center" fontSize="1.875rem">
                    Filter Report
                </Heading>
            </ModalHeader>
            <ModalCloseButton border="2px solid rgba(0,0,0,.5)"
                outline="none" borderRadius="50%" opacity={.5} />
            <ModalBody display="flex" justifyContent="center" >
                <Flex my="10" direction="column" align="center"
                    flex={1} maxWidth="lg" >
                    <Formik initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >

                        {(formikProps: FormikProps<FormType>) => {
                            return (
                                <>
                                    <Select name="filterBy" placeholder="Select Filter" >
                                            {
                                                filterOptions.map((item,idx) => (
                                                    <option key={idx}>
                                                        {item}
                                                    </option>
                                                ))
                                            }
                                        </Select>
                                    <Button mt={{ sm: "5", md: "20" }} width="40%"
                                        disabled={!formikProps.isValid || formikProps.isSubmitting}
                                        onClick={formikProps.handleSubmit as any} role="submit"
                                        bgColor="primary" color="white" >
                                        Proceed
                                    </Button>
                                </>
                            )
                        }}
                    </Formik>
                </Flex>
            </ModalBody>
        </ModalContent>
    )
})



interface ToolbarFunctionsProps {
    filterOptions: string[];
    numSelected?:number;
}

interface IProps extends ToolbarFunctionsProps {
    heading: any[];
    rowLength: number;
}



const CustomizedTables: React.FC<IProps> = ({ children, heading, rowLength,filterOptions }) => {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const {
        dialog:{
            handleToggle,open
        },
        filter:{
            setFilter,
            selectedFilter
        }
    } = useTableService()

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <Dialog open={open} close={handleToggle}>
                <FilterDialog close={handleToggle} setFilter={setFilter}
                 filterOptions={filterOptions} />
            </Dialog>
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
        </>
    );
}

export default CustomizedTables