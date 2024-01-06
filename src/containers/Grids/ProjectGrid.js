import React from 'react';
import { Row, ListGroup, Col } from 'react-bootstrap';
import { BsFillPencilFill, BsFillXCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { formatDateAsMMDDYYYY } from '../../utils/helperFunctions';

export const ProjectGrid = ({ projects, deleteProject }) => {
    const navigate = useNavigate();

    const selectProjectHandler = (projectId) => {
        navigate(`/project/${projectId}`, { replace: true });
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
                        <h4>Start Date</h4>
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
            {projects.map(elem => {
                return (
                    <ListGroup.Item key={elem.projectId}
                        action
                        variant='light'
                    >
                        <Row>
                            <Col sm={8}>
                                <BsFillPencilFill
                                    color='#0d6efd'
                                    title="Edit"
                                    className='select-action'
                                    onClick={() => selectProjectHandler(elem.projectId)}
                                />
                                <span className="margin-on-left ">{elem.name}</span>
                            </Col>
                            <Col sm={2}>
                                <span>{formatDateAsMMDDYYYY(elem.startDate)}</span>
                            </Col>
                            <Col sm={1}>
                                <span>{elem.isActive ? "Active" : "Inactive"}</span>
                            </Col>
                            <Col sm={1} className='align-on-right'>
                                <BsFillXCircleFill color='#0d6efd'
                                    className='select-action tootip-text'
                                    title="Delete"
                                    onClick={() => deleteProject(elem.projectId)}
                                />
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )
            })}
        </ListGroup >
    );
};