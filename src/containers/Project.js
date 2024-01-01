import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Form } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/useStore';
import { SystemAlert } from '../ui-componants/SystemAlert/SystemAlert';
import { delay, getToastMessage, handleNullOrUndefined } from '../utils/helperFunctions';
import { useNavigate, useParams } from 'react-router-dom';
import { SystemToast } from '../ui-componants/SystemToast/SystemToast';
import { ProjectGrid } from './Grids/ProjectGrid';

export const Project = observer(() => {
    const { rootStore } = useStore();
    const [projectId, setProjectId] = useState(0);
    const [name, setName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [majorHeading, setMajorHeading] = useState("");
    const [toastBody, setToastBody] = useState("");
    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();
    const { id: selectedProjectId } = useParams();

    useEffect(() => {
        rootStore.projectStore.resetProjectById();
        rootStore.projectStore.fetchProjects();
    }, []);

    useEffect(() => {
        const projects = rootStore.projectStore.getProjects;
        setProjects(projects);
    }, [rootStore.projectStore.getProjects])

    useEffect(() => {
        fetchProjectDetailsFromQueryString();
    }, [selectedProjectId]);

    useEffect(() => {
        const selectedProject = rootStore.projectStore.getProjectById;
        if (selectedProject !== null) {
            setProjectId(selectedProject.projectId);
            setName(selectedProject.name);
            setIsActive(selectedProject.isActive);
        }
    }, [selectedProjectId, rootStore.projectStore.getProjectById])

    const fetchProjectDetailsFromQueryString = () => {
        if (handleNullOrUndefined(selectedProjectId) !== "") {
            rootStore.projectStore.fetchProjectById(selectedProjectId);
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
        setProjectId(0);
        setName("");
        setIsActive(true);
        setHasError(false);
    }

    const cancelHandler = () => {
        rootStore.projectStore.resetProjectById();
        clearStates();
        navigate("/project", { replace: true });
    }

    const deleteHandler = async (projectId) => {
        await rootStore.projectStore.deleteProject(projectId);
        await rootStore.projectStore.fetchProjects();
        displayToast("delete");

    }

    const saveHandler = async () => {
        setHasError(false);
        if (handleNullOrUndefined(name.trim()) === "") {
            showError("Name cannot be empty !");
            return false;
        }
        const postObject = {
            ProjectId: projectId,
            Name: name,
            IsActive: isActive
        }
        await rootStore.projectStore.saveProject(postObject);
        displayToast(projectId > 0 ? "update" : "insert");
        cancelHandler();
        rootStore.projectStore.fetchProjects();
    }

    return (
        <Container>
            <Row>
                <h1>Project</h1>
                <SystemToast
                    visible={showToast}
                    majorHeading={majorHeading}
                    body={toastBody}
                />
            </Row>
            <Row>
                <Form>
                    <Form.Group className="mb-4" controlId="project-name">
                        <Form.Label>Name <span className='required'>*</span></Form.Label>
                        <Form.Control type="text"
                            placeholder="Project..."
                            value={name}
                            onChange={(event) => setName(event.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="active">
                        <Form.Check
                            type="switch"
                            id="active-switch"
                            label="Active"
                            checked={isActive}
                            onChange={(event) => setIsActive(event.target.checked)} />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="project-name">
                        {hasError && <SystemAlert variant="danger" message={message} />}
                        <Button variant="outline-primary" onClick={saveHandler}>Save</Button>{' '}
                        <Button variant="outline-primary" onClick={cancelHandler}>Cancel</Button>
                    </Form.Group>
                </Form>
            </Row>
            <Row>
                <ProjectGrid projects={projects} deleteProject={deleteHandler} />
            </Row>
        </Container>
    );
});