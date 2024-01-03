import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Form, Col } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/useStore';
import { SystemAlert } from '../ui-componants/SystemAlert/SystemAlert';
import { delay, getToastMessage, handleNullOrUndefined, isValidDate } from '../utils/helperFunctions';
import { useNavigate, useParams } from 'react-router-dom';
import { SystemToast } from '../ui-componants/SystemToast/SystemToast';
import { EmployeeGrid } from './Grids/EmployeeGrid';
import DatePicker from "react-datepicker";

export const Employee = observer(() => {
    const { rootStore } = useStore();
    const [employeeId, setEmployeeId] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contact, setContact] = useState("");
    const [type, setType] = useState("");

    const [isActive, setIsActive] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [majorHeading, setMajorHeading] = useState("");
    const [toastBody, setToastBody] = useState("");
    const [employees, setEmployees] = useState([]);
    const types = [
        { value: 0, label: "Select ..." },
        { value: 1, label: "Type1" },
        { value: 2, label: "Type2" },
        { value: 3, label: "Type3" }
    ];
    const [birthDate, setBirthDate] = useState(new Date());
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
            setBirthDate(new Date(selectedEmployee.dob));
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
        setBirthDate(new Date());
        setContact("");
        setType(0);
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

    const isValidData = () => {
        if (handleNullOrUndefined(firstName.trim()) === "") {
            showError("First name cannot be empty !");
            return false;
        }
        if (handleNullOrUndefined(lastName.trim()) === "") {
            showError("Last name cannot be empty !");
            return false;
        }
        if (handleNullOrUndefined(contact.trim()) === "") {
            showError("Contact cannot be empty !");
            return false;
        }
        if (handleNullOrUndefined(type.trim()) === "") {
            showError("Select type !");
            return false;
        }
        if (isValidDate(handleNullOrUndefined(birthDate))) {
            showError("Invalid birth date !");
            return false;
        }
        return true;
    }

    const saveHandler = async () => {
        setHasError(false);
        if (isValidData()) {
            const postObject = {
                EmployeeId: employeeId,
                FirstName: firstName,
                MiddleName: middleName,
                LastName: lastName,
                DOB: birthDate,
                Contact: contact,
                Type: type,
                IsActive: isActive
            }
            await rootStore.employeeStore.saveEmployee(postObject);
            displayToast(employeeId > 0 ? "update" : "insert");
            cancelHandler();
            rootStore.employeeStore.fetchEmployees();
        }
    }

    const createOption = (item) => {
        return <option key={item.value} selected={item.value === type} value={item.value}>{item.label}</option>
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
                            <Form.Group className="mb-4" controlId="type">
                                <Form.Label>Type <span className='required'>*</span></Form.Label>

                                <Form.Select aria-label="Default select example" onChange={(event) => setType(event.target.value)}>
                                    {types.map(createOption)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4" controlId="dob">
                                <Form.Label>Date of Birth <span className='required'>*</span></Form.Label>
                                <br />
                                <DatePicker
                                    dateFormat="MM/dd/yyyy"
                                    className='form-control'
                                    showIcon
                                    selected={birthDate}
                                    onChange={(date) => setBirthDate(date)}
                                />
                            </Form.Group>


                        </Col>
                    </Row>
                    <Row>

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