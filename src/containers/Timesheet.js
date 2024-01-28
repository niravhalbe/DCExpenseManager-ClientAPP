import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Form, Col, ListGroup, Modal } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/useStore';
import { SystemAlert } from '../ui-componants/SystemAlert/SystemAlert';
import { delay, formatDateAsMMDDYYYY, formatDateAsYYYYMMDD, getToastMessage, getValueFromLocalstorage, handleNullOrUndefined, isValidDate } from '../utils/helperFunctions';
import { useNavigate, useParams } from 'react-router-dom';
import { SystemToast } from '../ui-componants/SystemToast/SystemToast';
import DatePicker from "react-datepicker";
import moment from 'moment';
import { BsFillXCircleFill } from 'react-icons/bs';
import { EmployeeType } from '../utils/constants';

export const Timesheet = observer(() => {
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
    const [timesheetArray, setTimesheetArray] = useState([]);
    const [datesArray, setDatesArray] = useState([]);
    const [diffInDays, setDiffInDays] = useState(0);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [displayModal, setDisplayModal] = useState(false);
    const [modalMessage, setModalMessage] = useState(false);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [confirmationModalMessage, setConfirmationModalMessage] = useState(false);
    const [loadClicked, setLoadClicked] = useState(false);

    const navigate = useNavigate();
    const { id: selectedMappingId } = useParams();
    const currentUser = JSON.parse(getValueFromLocalstorage());

    useEffect(() => {
        setLoggedInUser(currentUser);
        const isPM = EmployeeType.PM.value === currentUser.type;
        if (isPM) {
            rootStore.customerStore.fetchCustomers();
            rootStore.projectStore.fetchProjects();
        }
        else {
            rootStore.customerStore.fetchAssignedCustomers(currentUser.userId);
            rootStore.projectStore.fetchAssignedProjects(currentUser.userId);
        }
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


    const showError = (message) => {
        setHasError(true);
        setMessage(message);
    }

    const showModal = (message) => {
        setDisplayModal(true);
        setModalMessage(message);
    }

    const showConfirmationModal = (message) => {
        setDisplayConfirmationModal(true);
        setConfirmationModalMessage(message);
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
        navigate("/", { replace: true });
    }

    const addNewRow = () => {
        const newRow = [getBlankRow(timesheetArray.length)];
        setTimesheetArray([...timesheetArray, ...newRow]);
    }

    const deleteHandler = async (rowId) => {
        const updatedArray = timesheetArray.filter(x => x.rowId !== rowId);
        setTimesheetArray(updatedArray);
        displayToast("delete");
    }

    const saveHandler = async () => {
        setHasError(false);

        if (isValidDate(handleNullOrUndefined(startDate))) {
            showError("Invalid start date !");
            return false;
        }
        if (isValidDate(handleNullOrUndefined(endDate))) {
            showError("Invalid end date !");
            return false;
        }
        if (validTimesheet()) {
            showConfirmationModal("Once timesheet data is saved, you wont be able to modify! Proceed ? ")
        }
    }

    const handleSaveClick = async () => {
        await saveTimesheet(timesheetArray);
    }

    const saveTimesheet = async (input) => {
        await rootStore.timesheetStore.saveTimesheet(input);
        displayToast("insert");
        cancelHandler();
    }

    const validTimesheet = () => {
        let result = true;
        if (timesheetArray === null || timesheetArray.length === 0) {
            showModal("Timesheet cannot be empty !");
            result = false;
        }
        if (selectedProject === 0) {
            showModal("Please select Project !");
            result = false;
        }
        for (var element of timesheetArray) {
            if (element.customerId === 0) {
                showModal("Please select Customer!");
                result = false;
                break;
            }
            if (handleNullOrUndefined(element.op.trim()) === "") {
                showModal("OP cannot be blank! Please recheck the timesheet data.");
                result = false;
                break;
            }
            if (element.taskDate === "") {
                showModal("Please select Date!");
                result = false;
                break;
            }
            if (element.workHours === 0) {
                showModal("Work hours cannot be blank! Please recheck the timesheet data.");
                result = false;
                break;
            }
            if (handleNullOrUndefined(element.taskDescription.trim()) === "") {
                showModal("Task details cannot be blank! Please recheck the timesheet data.");
                result = false;
                break;
            }
        };
        return result;
    }

    const createCustomerOption = (item) => {
        return <option key={item.value} selected={item.value === selectedCustomer} value={item.value}>{item.label}</option>
    }

    const createProjectOption = (item) => {
        return <option key={item.value} selected={item.value === selectedProject} value={item.value}>{item.label}</option>
    }

    const createDateOption = (item) => {
        return <option key={item.value} value={item.value}>{item.label}</option>
    }

    const updateTimesheet = (fieldValue, fieldName, rowId) => {

        const currentRow = timesheetArray.find(x => x.rowId === rowId);
        currentRow.projectId = parseInt(selectedProject);
        currentRow.employeeId = parseInt(loggedInUser.userId);
        currentRow.startDate = startDate;
        currentRow.endDate = endDate;

        switch (fieldName) {
            case "customer":
                currentRow.customerId = parseInt(fieldValue);
                break;
            case "op":
                currentRow.op = fieldValue;
                break;
            case "task":
                currentRow.taskDescription = fieldValue;
                break;
            case "date":
                currentRow.taskDate = fieldValue;
                break;
            case "work-hours":
                if (!fieldValue.match(/^\d{1,}(\.\d{0,2})?$/)) {
                    showModal("Only number are allowed upto 2 decimals");
                    return false;
                }
                currentRow.workHours = parseFloat(fieldValue);
                break;
            case "travel-hours":
                if (!fieldValue.match(/^\d{1,}(\.\d{0,2})?$/)) {
                    showModal("Only number are allowed upto 2 decimals");
                    return false;
                }
                currentRow.travelHours = parseFloat(fieldValue);
                break;
            default:
                break;
        }
    }

    const gridHeaderRow = () => {
        return (
            <ListGroup.Item key={0}
                action
                variant='light'>
                <Row>
                    <Col sm={2}>
                        <h4>Customer</h4>
                    </Col>
                    <Col sm={2}>
                        <h4>OP</h4>
                    </Col>

                    <Col sm={2}>
                        <h4>Date</h4>
                    </Col>
                    <Col sm={2}>
                        <h4>Work hours</h4>
                    </Col>
                    <Col sm={2}>
                        <h4>Travel hours</h4>
                    </Col>
                    <Col sm={2}>
                    </Col>
                </Row>
            </ListGroup.Item>
        )
    }

    const createTimeSheetGrid = (item) => {
        return (
            <ListGroup.Item key={item.projectName}
                action
                variant='light'
            >
                <Row>
                    <Col sm={2}>
                        <Form.Group className="mb-4" controlId="customers">
                            <Form.Select aria-label="customers" onChange={(event) => updateTimesheet(event.target.value, "customer", item.rowId)}>
                                {customers.map(createCustomerOption)}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={2}>
                        <Form.Group className="mb-4" controlId="op">
                            <Form.Control type="text"
                                placeholder="..."
                                onChange={(event) => updateTimesheet(event.target.value, "op", item.rowId)}
                            />
                        </Form.Group>
                    </Col>

                    <Col sm={2}>
                        <Form.Select aria-label="timesheet-date" onChange={(event) => updateTimesheet(event.target.value, "date", item.rowId)}>
                            {datesArray.map(createDateOption)}
                        </Form.Select>
                    </Col>
                    <Col sm={2}>
                        <Form.Group className="mb-4" controlId="work-hours">
                            <Form.Control type="text"
                                placeholder="..."
                                onChange={(event) => updateTimesheet(event.target.value, "work-hours", item.rowId)}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={2}>
                        <Form.Group className="mb-4" controlId="travel-hours">
                            <Form.Control type="text"
                                placeholder="..."
                                onChange={(event) => updateTimesheet(event.target.value, "travel-hours", item.rowId)}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={2}>
                        <BsFillXCircleFill color='#0d6efd'
                            className='select-action tootip-text'
                            title="Delete"
                            onClick={() => deleteHandler(item.rowId)}
                        />
                    </Col>

                </Row>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-4" controlId="taskDescription">
                            <Form.Control type="text"
                                placeholder="Task Details..."
                                onChange={(event) => updateTimesheet(event.target.value, "task", item.rowId)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </ListGroup.Item >
        );
    }

    useEffect(() => {
        const rows = [];

        //populate rows
        datesArray.forEach((element, index) => {
            if (element.value !== 0) {
                rows.push(getBlankRow(index));
            }
        });
        setTimesheetArray(rows);
    }, [datesArray])


    const loadTimesheetDates = () => {
        setLoadClicked(true);
        const firstDate = moment(startDate);
        const lastDate = moment(endDate);
        const timeSheetDates = [{ value: 0, label: "Select..." }];
        const diffInDays = lastDate.diff(firstDate, "days");
        setDiffInDays(diffInDays);

        if (diffInDays < 0) {
            showModal("Invalid start / end date !");
            setLoadClicked(false);
            return;
        }

        let nextDate = moment(startDate).add(1, 'days');
        timeSheetDates.push({ "value": formatDateAsYYYYMMDD(startDate), "label": formatDateAsMMDDYYYY(startDate) })
        if (!firstDate.isSame(lastDate, 'day')) {
            while (true) {
                if (nextDate.isSame(lastDate, 'day')) {
                    break;
                }
                timeSheetDates.push({ "value": formatDateAsYYYYMMDD(nextDate), "label": formatDateAsMMDDYYYY(nextDate) });
                nextDate = nextDate.add(1, 'days');
            }
            timeSheetDates.push({ "value": formatDateAsYYYYMMDD(endDate), "label": formatDateAsMMDDYYYY(endDate) })
        }
        setDatesArray(timeSheetDates);
    }

    const getBlankRow = (index) => {
        return {
            "rowId": index,
            "customerId": 0,
            "projectId": 0,
            "op": "",
            "taskDescription": "",
            "startDate": "",
            "endDate": "",
            "taskDate": "",
            "workHours": 0,
            "travelHours": 0
        }
    }



    return (
        <Container>
            <Row>
                <h1>Timesheet</h1>
                <SystemToast
                    visible={showToast}
                    majorHeading={majorHeading}
                    body={toastBody}
                />
            </Row>
            <Row>
                <Form>
                    <Row>
                        {<Col>
                            <Form.Group className="mb-4" controlId="projects">
                                <Form.Label>Project <span className='required'>*</span></Form.Label>
                                <Form.Select aria-label="projects" onChange={(event) => setSelectedProject(parseInt(event.target.value))}>
                                    {projects.map(createProjectOption)}
                                </Form.Select>
                            </Form.Group>
                        </Col>}

                        <Col sm={2}>
                            <Form.Group className="mb-2" controlId="startDate">
                                <Form.Label>Start Date <span className='required'>*</span></Form.Label>
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
                        <Col sm={2}>
                            <Form.Group className="mb-2" controlId="endDate">
                                <Form.Label>End Date <span className='required'>*</span></Form.Label>
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
                        <Button variant="outline-primary" disabled={loadClicked} onClick={loadTimesheetDates}>Load</Button>{' '}

                    </Row>
                </Form>

            </Row >
            <br />

            <Row>
                {/* <MappingGrid mappings={mappings} deleteMapping={deleteHandler} /> */}
                <ListGroup varient="flush">
                    {gridHeaderRow()}
                    {timesheetArray.map(createTimeSheetGrid)}
                    <Button
                        variant="outline-primary"
                        onClick={() => addNewRow()}
                        disabled={!loadClicked}
                    >
                        Add
                    </Button>
                </ListGroup>
            </Row>

            <br />
            <Row>
                <Form.Group className="mb-4" controlId="project-name">
                    {hasError && <SystemAlert variant="danger" message={message} />}
                    <Button variant="outline-primary" onClick={saveHandler}>Save</Button>{' '}
                    <Button variant="outline-primary" onClick={cancelHandler}>Cancel</Button>
                </Form.Group>
            </Row>
            <Modal
                show={displayModal}
                onHide={() => setDisplayModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Warning !
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
            </Modal>
            <Modal
                show={displayConfirmationModal}
                onHide={() => setDisplayConfirmationModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal">
                        Warning !
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>{confirmationModalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSaveClick}>
                        Yes
                    </Button>
                    <Button variant="primary" onClick={() => setDisplayConfirmationModal(false)}>No</Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
});