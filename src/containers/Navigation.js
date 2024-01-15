import React from 'react'
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Loader } from '../ui-componants/Loader/Loader';
import { observer } from 'mobx-react-lite';
import { Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import { Project } from './Project';
import { Error } from './Error';
import { Customer } from './Customer';
import { Employee } from './Employee';
import { Mapping } from './Mapping';
import { Timesheet } from './Timesheet';
import { getValueFromLocalstorage } from '../utils/helperFunctions';
import { EmployeeType } from '../utils/constants';
import { BsXOctagonFill } from 'react-icons/bs';


export const Navigation = observer(({ userLoggedOut }) => {
    const loggedInUser = JSON.parse(getValueFromLocalstorage());
    const isPM = EmployeeType.PM.value === loggedInUser.type;

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">Expense Manager</Navbar.Brand>
                    <Nav className="me-auto">
                        {isPM && <Nav.Link href="/home">Home</Nav.Link>}
                        {isPM && <Nav.Link href="/project">Projects</Nav.Link>}
                        {isPM && <Nav.Link href="/customer">Customers</Nav.Link>}
                        {isPM && <Nav.Link href="/employee">Employees</Nav.Link>}
                        {isPM && <Nav.Link href="/mapping">Mapping</Nav.Link>}
                        <Nav.Link href="/timesheet">Timesheet</Nav.Link>
                    </Nav>

                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: {loggedInUser.firstName}
                        </Navbar.Text>
                        <Button variant="outline-light" size='sm' className='margin-on-left' onClick={() => userLoggedOut()}>
                            <b>Logout</b> <BsXOctagonFill />
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Routes>
                <Route path="/" element={<Home />} index />
                {isPM && <Route path="/home" element={<Home />} index />}
                {isPM && <Route path="/project/:id?" element={<Project />} />}
                {isPM && <Route path="/customer/:id?" element={<Customer />} />}
                {isPM && <Route path="/employee/:id?" element={<Employee />} />}
                {isPM && <Route path="/mapping/:id?" element={<Mapping />} />}
                <Route path="/timesheet/:id?" element={<Timesheet />} />
                <Route path="*" element={<Error />} />
            </Routes>
            <Loader />
        </>
    );
});