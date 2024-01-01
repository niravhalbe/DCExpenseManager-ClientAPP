import React from 'react';
import { Row, ListGroup, Col } from 'react-bootstrap';
import { BsFillPencilFill, BsFillXCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

export const ProjectGrid = ({ projects, deleteProject }) => {
    const navigate = useNavigate();

    const selectProjectHandler = (projectId) => {
        navigate(`/project/${projectId}`, { replace: true });
    }

    return (
        <ListGroup varient="flush">
            {projects.map(elem => {
                return (
                    <ListGroup.Item key={elem.projectId}
                        action
                        variant='light'
                    >
                        <Row>
                            <Col sm={10}>
                                <BsFillPencilFill
                                    color='#0d6efd'
                                    title="Edit"
                                    className='select-action'
                                    onClick={() => selectProjectHandler(elem.projectId)}
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