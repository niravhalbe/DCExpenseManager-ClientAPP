import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Form, Col } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/useStore';
import { SystemAlert } from '../ui-componants/SystemAlert/SystemAlert';
import { delay, getToastMessage, handleNullOrUndefined, isValidDate } from '../utils/helperFunctions';
import { useNavigate, useParams } from 'react-router-dom';
import { SystemToast } from '../ui-componants/SystemToast/SystemToast';
import DatePicker from "react-datepicker";
import { MappingGrid } from './Grids/MappingGrid';

export const Mapping = observer(() => {
    const { rootStore } = useStore();
    const [mappingId, setMappingId] = useState(0);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(0);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [hasError, setHasError] = useState(false);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [majorHeading, setMajorHeading] = useState("");
    const [toastBody, setToastBody] = useState("");
    const [mappings, setMappings] = useState([]);

    const navigate = useNavigate();
    const { id: selectedMappingId } = useParams();

    useEffect(() => {
        rootStore.mappingStore.resetMappingById();
        rootStore.mappingStore.fetchMappings();
        rootStore.customerStore.fetchCustomers();
        rootStore.projectStore.fetchProjects();
        rootStore.employeeStore.fetchEmployees();
    }, []);

    useEffect(() => {
        const customers = rootStore.customerStore.getCustomers;
        var options = [{ value: 0, label: "Select..." }];
        customers.forEach(x => {
            options.push({ value: x.customerId, label: x.name });
        });
        setCustomers(options);
    }, [rootStore.customerStore.getCustomers])

    useEffect(() => {
        const projects = rootStore.projectStore.getProjects;
        var options = [{ value: 0, label: "Select..." }];
        projects.forEach(x => {
            options.push({ value: x.projectId, label: x.name });
        });
        setProjects(options);
    }, [rootStore.projectStore.getProjects])

    useEffect(() => {
        const employees = rootStore.employeeStore.getEmployees;
        var options = [{ value: 0, label: "Select..." }];
        employees.forEach(x => {
            options.push({ value: x.employeeId, label: x.firstName + " " + x.lastName });
        });
        setEmployees(options);
    }, [rootStore.employeeStore.getEmployees])

    useEffect(() => {
        const mappings = rootStore.mappingStore.getMappings;
        setMappings(mappings);
    }, [rootStore.mappingStore.getMappings])

    useEffect(() => {
        fetchMappingDetailsFromQueryString();
    }, [selectedMappingId]);

    useEffect(() => {
        const selectedMapping = rootStore.mappingStore.getMappingById;
        if (selectedMapping !== null) {
            setMappingId(selectedMapping.mappingId);

            //customer dd
            const savedCustomer = customers.find(x => x.customerId === selectedMapping.customerId)
            if (savedCustomer !== null) { setSelectedCustomer(selectedMapping.customerId) }

            //project dd
            const savedProject = projects.find(x => x.projectId === selectedMapping.projectId)
            if (savedProject !== null) { setSelectedProject(selectedMapping.projectId) }

            //employee dd
            const savedEmployee = employees.find(x => x.employeeId === selectedMapping.employeeId)
            if (savedEmployee !== null) { setSelectedEmployee(selectedMapping.employeeId) }

            setStartDate(new Date(selectedMapping.startDate));
            setEndDate(new Date(selectedMapping.endDate))
        }
    }, [selectedMappingId,
        rootStore.mappingStore.getMappingById,
        customers,
        projects,
        employees])

    const fetchMappingDetailsFromQueryString = () => {
        if (handleNullOrUndefined(selectedMappingId) !== "") {
            rootStore.mappingStore.fetchMappingById(selectedMappingId);
        }
    }

    const showError = (message) => {
        setHasError(true);
        setMessage(message);
    }

    const displayToast = async (type) => {
        setMajorHeading("Project");
        setToastBody(getToastMessage(type));
        setShowToast(true);
        await delay(2000);
        setShowToast(false);
    }

    const clearStates = () => {
        setMappingId(0);
        setSelectedCustomer(0);
        setSelectedProject(0);
        setSelectedEmployee(0);
        setStartDate(new Date());
        setEndDate(new Date());
        setHasError(false);
    }

    const cancelHandler = () => {
        rootStore.mappingStore.resetMappingById();
        clearStates();
        navigate("/mapping", { replace: true });
    }

    const deleteHandler = async (mappingId) => {
        await rootStore.mappingStore.deleteMapping(mappingId);
        await rootStore.mappingStore.fetchMappings();
        displayToast("delete");

    }

    const saveHandler = async () => {
        setHasError(false);
        if (handleNullOrUndefined(selectedCustomer) === 0) {
            showError("Select Customer ..");
            return false;
        }
        if (handleNullOrUndefined(selectedProject) === 0) {
            showError("Select Project ..");
            return false;
        }
        if (handleNullOrUndefined(selectedEmployee) === 0) {
            showError("Select Employee ..");
            return false;
        }
        if (isValidDate(handleNullOrUndefined(startDate))) {
            showError("Invalid start date !");
            return false;
        }
        if (isValidDate(handleNullOrUndefined(endDate))) {
            showError("Invalid end date !");
            return false;
        }

        const postObject = {
            MappingId: mappingId,
            ProjectId: selectedProject,
            EmployeeId: selectedEmployee,
            CustomerId: selectedCustomer,
            StartDate: startDate,
            EndDate: endDate
        }
        await rootStore.mappingStore.saveMapping(postObject);
        displayToast(mappingId > 0 ? "update" : "insert");
        cancelHandler();
        rootStore.mappingStore.fetchMappings();
    }

    const createCustomerOption = (item) => {
        return <option key={item.value} selected={item.value === selectedCustomer} value={item.value}>{item.label}</option>
    }

    const createProjectOption = (item) => {
        return <option key={item.value} selected={item.value === selectedProject} value={item.value}>{item.label}</option>
    }

    const createEmployeeOption = (item) => {
        return <option key={item.value} selected={item.value === selectedEmployee} value={item.value}>{item.label}</option>
    }


    return (
        <Container>
            <Row>
                <h1>Mapping</h1>
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
                            <Form.Group className="mb-4" controlId="projects">
                                <Form.Label>Project <span className='required'>*</span></Form.Label>
                                <Form.Select aria-label="projects" onChange={(event) => setSelectedProject(event.target.value)}>
                                    {projects.map(createProjectOption)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4" controlId="customers">
                                <Form.Label>Customer <span className='required'>*</span></Form.Label>
                                <Form.Select aria-label="customers" onChange={(event) => setSelectedCustomer(event.target.value)}>
                                    {customers.map(createCustomerOption)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4" controlId="employees">
                                <Form.Label>Employee <span className='required'>*</span></Form.Label>
                                <Form.Select aria-label="employees" onChange={(event) => setSelectedEmployee(event.target.value)}>
                                    {employees.map(createEmployeeOption)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} md={4}>
                            <Form.Group controlId="dob">
                                <Form.Label>Start date <span className='required'>*</span></Form.Label>
                                <br />
                                <DatePicker
                                    dateFormat="MM/dd/yyyy"
                                    className='form-control'
                                    showIcon
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={4} md={4}>
                            <Form.Group controlId="dob">
                                <Form.Label>End date <span className='required'>*</span></Form.Label>
                                <br />
                                <DatePicker
                                    dateFormat="MM/dd/yyyy"
                                    className='form-control'
                                    showIcon
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <br />
                    <Form.Group className="mb-4" controlId="project-name">
                        {hasError && <SystemAlert variant="danger" message={message} />}
                        <Button variant="outline-primary" onClick={saveHandler}>Save</Button>{' '}
                        <Button variant="outline-primary" onClick={cancelHandler}>Cancel</Button>
                    </Form.Group>
                </Form>

            </Row>
            <Row>
                <MappingGrid mappings={mappings} deleteMapping={deleteHandler} />
            </Row>
        </Container>
    );
});