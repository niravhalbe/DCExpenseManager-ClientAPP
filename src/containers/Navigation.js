import React from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Loader } from '../ui-componants/Loader/Loader';
import { observer } from 'mobx-react-lite';
import { Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import { Project } from './Project';
import { Error } from './Error';
import { Customer } from './Customer';
import { Employee } from './Employee';


export const Navigation = observer(() => {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Expense Manager</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/project">Projects</Nav.Link>
                        <Nav.Link href="/customer">Customers</Nav.Link>
                        <Nav.Link href="/employee">Employees</Nav.Link>

                    </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Home />} index />
                <Route path="/home" element={<Home />} index />
                <Route path="/project/:id?" element={<Project />} />
                <Route path="/customer/:id?" element={<Customer />} />
                <Route path="/employee/:id?" element={<Employee />} />
                <Route path="*" element={<Error />} />
            </Routes>
            <Loader />
        </>
    );
});