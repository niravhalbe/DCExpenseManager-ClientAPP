import React from 'react';
import { Row, ListGroup, Col } from 'react-bootstrap';
import { BsFillPencilFill, BsFillXCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

export const CustomerGrid = ({ customers, deleteCustomer }) => {
    const navigate = useNavigate();

    const selectProjectHandler = (customerId) => {
        navigate(`/customer/${customerId}`, { replace: true });
    }

    return (
        <ListGroup varient="flush">
            {customers.map(elem => {
                return (
                    <ListGroup.Item key={elem.customerId}
                        action
                        variant='light'
                    >
                        <Row>
                            <Col sm={10}>
                                <BsFillPencilFill
                                    color='#0d6efd'
                                    title="Edit"
                                    className='select-action'
                                    onClick={() => selectProjectHandler(elem.customerId)}
                                />
                                <span className="margin-2">{elem.name}</span>
                            </Col>

                            <Col sm={1}>
                                <span>{elem.isActive ? "Active" : "Inactive"}</span>
                            </Col>
                            <Col sm={1}>

                                <BsFillXCircleFill color='#0d6efd'
                                    className='select-action tootip-text'
                                    title="Delete"
                                    onClick={() => deleteCustomer(elem.customerId)}
                                />
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )
            })}
        </ListGroup >
    );
};