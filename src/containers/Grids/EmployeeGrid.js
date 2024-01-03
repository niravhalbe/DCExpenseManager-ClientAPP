import React from 'react';
import { Row, ListGroup, Col } from 'react-bootstrap';
import { BsFillPencilFill, BsFillXCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

export const EmployeeGrid = ({ employees, deleteEmployee }) => {
    const navigate = useNavigate();

    const selectEmployeeHandler = (employeeId) => {
        navigate(`/employee/${employeeId}`, { replace: true });
    }

    const gridHeaderRow = () => {
        return (
            <ListGroup.Item key={0}
                action
                variant='light'
            >
                <Row>
                    <Col sm={8}>
                        <h4>Name</h4>
                    </Col>
                    <Col sm={2}>
                        <h4>Contact</h4>
                    </Col>
                    <Col sm={1}>
                        <h4>Status</h4>
                    </Col>
                    <Col sm={1} className='align-on-right'>
                        <h4>Delete</h4>
                    </Col>
                </Row>
            </ListGroup.Item>
        )
    }

    return (
        <ListGroup varient="flush">
            {gridHeaderRow()}
            {employees.map(elem => {
                return (
                    <ListGroup.Item key={elem.employeeId}
                        action
                        variant='light'
                    >
                        <Row>
                            <Col sm={8}>
                                <BsFillPencilFill
                                    color='#0d6efd'
                                    title="Edit"
                                    className='select-action'
                                    onClick={() => selectEmployeeHandler(elem.employeeId)}
                                />
                                <span className="margin-on-left ">{elem.firstName} {elem.lastName}</span>
                            </Col>
                            <Col sm={2}>
                                <span>{elem.contact}</span>
                            </Col>
                            <Col sm={1}>
                                <span >{elem.isActive ? "Active" : "Inactive"}</span>
                            </Col>
                            <Col sm={1} className='align-on-right'>
                                <BsFillXCircleFill color='#0d6efd'
                                    className='select-action tootip-text'
                                    title="Delete"
                                    onClick={() => deleteEmployee(elem.employeeId)}
                                />
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )
            })}
        </ListGroup >
    );
};