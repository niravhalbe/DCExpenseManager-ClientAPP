import React from 'react';
import { Row, ListGroup, Col } from 'react-bootstrap';
import { BsFillPencilFill, BsFillXCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { formatDateAsMMDDYYYY } from '../../utils/helperFunctions';

export const MappingGrid = ({ mappings, deleteMapping }) => {
    const navigate = useNavigate();

    const selectMappingHandler = (mappingId) => {
        navigate(`/mapping/${mappingId}`, { replace: true });
    }

    const gridHeaderRow = () => {
        return (
            <ListGroup.Item key={0}
                action
                variant='light'>
                <Row>
                    <Col sm={3}>
                        <h4>Customer</h4>
                    </Col>
                    <Col sm={3}>
                        <h4>Project</h4>
                    </Col>
                    <Col sm={3}>
                        <h4>Employee</h4>
                    </Col>
                    <Col sm={2}>
                        <h4>Duration</h4>
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
            {mappings.map(elem => {
                return (
                    <ListGroup.Item key={elem.mappingId}
                        action
                        variant='light'
                    >
                        <Row>
                            <Col sm={3}>
                                <BsFillPencilFill
                                    color='#0d6efd'
                                    title="Edit"
                                    className='select-action'
                                    onClick={() => selectMappingHandler(elem.mappingId)}
                                />
                                <span className="margin-on-left ">{elem.customerName}</span>
                            </Col>
                            <Col sm={3}>
                                <span>{elem.projectName}</span>
                            </Col>
                            <Col sm={3}>
                                <span>{elem.employeeName}</span>
                            </Col>
                            <Col sm={2}>
                                <span>{formatDateAsMMDDYYYY(elem.startDate)} - {formatDateAsMMDDYYYY(elem.endDate)}</span>
                            </Col>
                            <Col sm={1} className='align-on-right'>
                                <BsFillXCircleFill color='#0d6efd'
                                    className='select-action tootip-text'
                                    title="Delete"
                                    onClick={() => deleteMapping(elem.mappingId)}
                                />
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )
            })}
        </ListGroup >
    );
};