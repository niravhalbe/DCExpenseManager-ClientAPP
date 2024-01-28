import React, { useEffect, useState } from 'react';
import { Row, ListGroup, Col, Form, Container } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { BsCaretRightFill, BsFillPencilFill, BsFillXCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { formatDateAsMMDDYYYY, getValueFromLocalstorage } from '../../utils/helperFunctions';
import { useStore } from '../../hooks/useStore';
import { EmployeeType } from '../../utils/constants';

export const TimesheetGrid = observer(() => {
    const [timesheets, setTimesheets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(0);
    const [showFilter, setShowFilter] = useState(false);

    const navigate = useNavigate();
    const { rootStore } = useStore();

    useEffect(() => {
        fetchTimesheetsByLoggedInUser();
        rootStore.employeeStore.fetchEmployees();
    }, []);

    const fetchTimesheetsByLoggedInUser = () => {
        const loggedInUser = JSON.parse(getValueFromLocalstorage());
        const isPM = EmployeeType.PM.value === loggedInUser.type;
        setShowFilter(isPM ? true : false);
        rootStore.timesheetStore.fetchTimesheets(isPM ? 0 : loggedInUser.userId);
    }

    useEffect(() => {
        const timesheets = rootStore.timesheetStore.getTimesheets;
        prepareTimesheetData(timesheets);
        setTimesheets(timesheets);
    }, [rootStore.timesheetStore.getTimesheets])

    useEffect(() => {
        const employees = rootStore.employeeStore.getEmployees;
        var options = [{ value: 0, label: "Select..." }];
        employees.forEach(x => {
            options.push({ value: x.userId, label: x.firstName + " " + x.lastName });
        });
        setEmployees(options);
    }, [rootStore.employeeStore.getEmployees])

    const deleteTimesheet = async (id) => {
        await rootStore.timesheetStore.deleteTimesheet(id);
        fetchTimesheetsByLoggedInUser();
    }

    const prepareTimesheetData = (timesheetData) => {
        var prevTimesheetId = 0;
        for (let i = 0; i < timesheetData.length; i++) {

            const element = timesheetData[i];
            if (element.timesheetId === prevTimesheetId) {
                element.isDuplicate = true;
            }
            prevTimesheetId = element.timesheetId;
        }
    }
    const createEmployeeOption = (item) => {
        return <option key={item.value} selected={item.value === selectedEmployee} value={item.value}>{item.label}</option>
    }

    const filterTimesheet = (employeeId) => {
        rootStore.timesheetStore.fetchTimesheets(employeeId);
    }

    const gridHeaderRow = () => {
        return (
            <ListGroup.Item key={0}
                action
                variant='light'
            >
                <Row>
                    <Col sm={1}>
                        <span><b>Employee</b></span>
                    </Col>
                    <Col sm={1}>
                        <span><b>Task Date</b></span>
                    </Col>
                    <Col sm={3}>
                        <span><b>Project & Customer</b></span>
                    </Col>

                    <Col sm={1}>
                        <span><b>Work Hours</b></span>
                    </Col>
                    <Col sm={5}>
                        <span><b>Task Description</b></span>
                    </Col>
                    <Col sm={1} className='align-on-right'>
                        <span><b>Delete</b></span>
                    </Col>
                </Row>
            </ListGroup.Item>
        )
    }

    return (
        <>
            {showFilter && <Row>
                <Col sm={6} className='margin-on-left margin-on-top'>
                    <Form.Group as={Row} className="mb-3" controlId="username">
                        <Form.Label column sm="2" >
                            <b>Employee</b> <span className='required'>*</span>
                        </Form.Label>
                        <Col sm="6">
                            <Form.Select aria-label="employees" onChange={(event) => filterTimesheet(event.target.value)}>
                                {employees.map(createEmployeeOption)}
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Col>
            </Row>}
            <ListGroup varient="flush">
                {gridHeaderRow()}
                {timesheets.map((elem, index) => {

                    return (
                        <ListGroup.Item key={index}
                            action
                            variant={!elem.isDuplicate ? "secondary" : "light"}
                        >
                            <Row>
                                <Col sm={1}>
                                    <span>{!elem.isDuplicate ? elem.employeeName : " - "}</span>
                                </Col>
                                <Col sm={1}>
                                    <span>{formatDateAsMMDDYYYY(elem.taskDate)}</span>
                                </Col>
                                <Col sm={3}>
                                    <span>{elem.projectName} <BsCaretRightFill color='#0d6efd' /> {elem.customerName}</span>
                                </Col>

                                <Col sm={1}>
                                    <span>{elem.workHours}</span>
                                </Col>
                                <Col sm={5}>
                                    <span>{elem.taskDescription}</span>
                                </Col>
                                <Col sm={1} className='align-on-right'>
                                    {!elem.isDuplicate && <BsFillXCircleFill color='#0d6efd'
                                        className='select-action tootip-text'
                                        title="Delete"
                                        onClick={() => deleteTimesheet(elem.timesheetId)}
                                    />}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </>
    );
});