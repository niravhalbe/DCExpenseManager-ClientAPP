import React from 'react';
import { Row, ListGroup, Col } from 'react-bootstrap';
import { BsFillPencilFill, BsFillXCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

export const EmployeeGrid = ({ employees, deleteEmployee }) => {
    const navigate = useNavigate();

    const selectEmployeeHandler = (employeeId) => {
        navigate(`/employee/${employeeId}`, { replace: true });
    }

    return (
        <ListGroup varient="flush">
            {employees.map(elem => {
                return (
                    <ListGroup.Item key={elem.employeeId}
                        action
                        variant='light'
                    >
                        <Row>
                            <Col sm={9}>
                                <BsFillPencilFill
                                    color='#0d6efd'
                                    title="Edit"
                                    className='select-action'
                                    onClick={() => selectEmployeeHandler(elem.employeeId)}
                                />
                                <span className="margin-2">{elem.firstName} {elem.lastName}</span>
                            </Col>
                            <Col sm={1}>
                                <span className="margin-2">{elem.contact}</span>
                            </Col>
                            <Col sm={1}>
                                <span>{elem.isActive ? "Active" : "Inactive"}</span>
                            </Col>
                            <Col sm={1}>

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