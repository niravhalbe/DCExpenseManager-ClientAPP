import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Form, Col } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/useStore';
import { SystemAlert } from '../ui-componants/SystemAlert/SystemAlert';
import { delay, getToastMessage, handleNullOrUndefined } from '../utils/helperFunctions';
import { useNavigate, useParams } from 'react-router-dom';
import { SystemToast } from '../ui-componants/SystemToast/SystemToast';
import { EmployeeGrid } from './Grids/EmployeeGrid';
import { EmployeeType } from '../utils/constants';

export const Employee = observer(() => {
    const { rootStore } = useStore();
    const [employeeId, setEmployeeId] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [contact, setContact] = useState("");
    const [type, setType] = useState("");

    const [isActive, setIsActive] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [majorHeading, setMajorHeading] = useState("");
    const [toastBody, setToastBody] = useState("");
    const [employees, setEmployees] = useState([]);
    const [employeeType, setEmployeeType] = useState([]);

    const navigate = useNavigate();
    const { id: selectedEmployeeId } = useParams();


    useEffect(() => {
        rootStore.employeeStore.resetEmployeeById();
        rootStore.employeeStore.fetchEmployees();
    }, []);

    useEffect(() => {
        const employees = rootStore.employeeStore.getEmployees;
        setEmployees(employees);
    }, [rootStore.employeeStore.getEmployees])

    useEffect(() => {
        fetchEmployeeDetailsFromQueryString();
    }, [selectedEmployeeId]);

    useEffect(() => {
        const selectedEmployee = rootStore.employeeStore.getEmployeeById;
        if (selectedEmployee !== null) {
            setEmployeeId(selectedEmployee.employeeId);
            setFirstName(selectedEmployee.firstName);
            setMiddleName(selectedEmployee.middleName);
            setLastName(selectedEmployee.lastName);
            setDob(selectedEmployee.dob);
            setContact(selectedEmployee.contact);
            setType(selectedEmployee.type);
            setIsActive(selectedEmployee.isActive);
        }
    }, [selectedEmployeeId, rootStore.employeeStore.getEmployeeById])

    const fetchEmployeeDetailsFromQueryString = () => {
        if (handleNullOrUndefined(selectedEmployeeId) !== "") {
            rootStore.employeeStore.fetchEmployeeById(selectedEmployeeId);
        }
    }

    const showError = (message) => {
        setHasError(true);
        setMessage(message);
    }

    const displayToast = async (type) => {
        setMajorHeading("Employee");
        setToastBody(getToastMessage(type));
        setShowToast(true);
        await delay(2000);
        setShowToast(false);
    }

    const clearStates = () => {
        setEmployeeId(0);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setDob("");
        setContact("");
        setType("");
        setIsActive(true);
        setHasError(false);
    }

    const cancelHandler = () => {
        rootStore.employeeStore.resetEmployeeById();
        clearStates();
        navigate("/employee", { replace: true });
    }

    const deleteHandler = async (employeeId) => {
        await rootStore.employeeStore.deleteEmployee(employeeId);
        await rootStore.employeeStore.fetchEmployees();
        displayToast("delete");
    }

    const saveHandler = async () => {
        setHasError(false);
        if (handleNullOrUndefined(firstName.trim()) === "") {
            showError("Name cannot be empty !");
            return false;
        }
        const postObject = {
            EmployeeId: employeeId,
            FirstName: firstName,
            MiddleName: middleName,
            LastName: lastName,
            DOB: dob,
            Contact: contact,
            Type: type,
            IsActive: isActive
        }
        await rootStore.employeeStore.saveEmployee(postObject);
        displayToast(employeeId > 0 ? "update" : "insert");
        cancelHandler();
        rootStore.employeeStore.fetchEmployees();
    }

    return (
        <Container>
            <Row>
                <h1>Employee</h1>
                <SystemToast
                    visible={showToast}
                    majorHeading={majorHeading}
                    body={toastBody}
                />
            </Row>
            <Row>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-4" controlId="firstName">
                                <Form.Label>Firt name <span className='required'>*</span></Form.Label>
                                <Form.Control type="text"
                                    placeholder="First name..."
                                    value={firstName}
                                    onChange={(event) => setFirstName(event.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4" controlId="middleName">
                                <Form.Label>Middle name</Form.Label>
                                <Form.Control type="text"
                                    placeholder="Middle name..."
                                    value={middleName}
                                    onChange={(event) => setMiddleName(event.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4" controlId="lastName">
                                <Form.Label>Last name <span className='required'>*</span></Form.Label>
                                <Form.Control type="text"
                                    placeholder="Last name..."
                                    value={lastName}
                                    onChange={(event) => setLastName(event.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-4" controlId="contact">
                                <Form.Label>Contact <span className='required'>*</span></Form.Label>
                                <Form.Control type="text"
                                    placeholder="Contact..."
                                    value={contact}
                                    onChange={(event) => setContact(event.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4" controlId="dob">
                                <Form.Label>Date of Birth <span className='required'>*</span></Form.Label>
                                <Form.Control type="date"
                                    value={dob}
                                    onChange={(event) => setDob(event.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-4" controlId="type">

                                <Form.Check
                                    inline
                                    label="Type A"
                                    name={EmployeeType.TypeA}
                                    type="radio"
                                    id={EmployeeType.TypeA} />
                                <Form.Check
                                    inline
                                    label="Type B"
                                    name={EmployeeType.TypeB}
                                    type="radio"
                                    id={EmployeeType.TypeB} />
                                <Form.Check
                                    inline
                                    label="Type C"
                                    name={EmployeeType.TypeC}
                                    type="radio"
                                    id={EmployeeType.TypeC} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4" controlId="active">
                                <Form.Check
                                    type="switch"
                                    id="active-switch"
                                    label="Active"
                                    checked={isActive}
                                    onChange={(event) => setIsActive(event.target.checked)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-4" controlId="firstName">
                        {hasError && <SystemAlert variant="danger" message={message} />}
                        <Button variant="outline-primary" onClick={saveHandler}>Save</Button>{' '}
                        <Button variant="outline-primary" onClick={cancelHandler}>Cancel</Button>
                    </Form.Group>
                </Form>
            </Row>
            <Row>
                <EmployeeGrid employees={employees} deleteEmployee={deleteHandler} />
            </Row>
        </Container>
    );
});