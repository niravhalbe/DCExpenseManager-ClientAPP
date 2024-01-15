import React, { useState } from 'react';
import { Button, Container, Row, Form, Col, Card } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/useStore';
import { SystemAlert } from '../ui-componants/SystemAlert/SystemAlert';
import { delay, deleteValueFromLocalstorage, getToastMessage, handleNullOrUndefined } from '../utils/helperFunctions';
import { SystemToast } from '../ui-componants/SystemToast/SystemToast';


export const Login = observer(({ userLoggedIn }) => {
    const { rootStore } = useStore();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [hasError, setHasError] = useState(false);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [majorHeading, setMajorHeading] = useState("");
    const [toastBody, setToastBody] = useState("");

    const showError = (message) => {
        setHasError(true);
        setMessage(message);
    }

    const displayToast = async (type) => {
        setMajorHeading("Login");
        setToastBody(getToastMessage(type));
        setShowToast(true);
        await delay(2000);
        setShowToast(false);
    }

    const saveHandler = async () => {
        setHasError(false);
        if (handleNullOrUndefined(username.trim()) === "") {
            showError("Username cannot be blank.");
            return false;
        }
        if (handleNullOrUndefined(password.trim()) === "") {
            showError("Password cannot be blank.");
            return false;
        }

        const postObject = {
            Username: username,
            Password: password
        }
        var result = await rootStore.commonStore.validateUser(postObject);
        if (result.userId > 0) {
            displayToast("valid-login");
            userLoggedIn({ "userId": result.userId, "type": result.type, "firstName": result.firstName });
        }
        else {
            displayToast("invalid-login");
            deleteValueFromLocalstorage();
        }
        displayToast(result?.userId > 0 ? "valid-login" : "invalid-login");
    }

    return (
        <Container>
            <Card>
                <Card.Header as="h5">Expense Manager</Card.Header>
                <Card.Body>
                    <Card.Title>Login</Card.Title>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="username">
                            <Form.Label column sm="2">
                                Username <span className='required'>*</span>
                            </Form.Label>
                            <Col sm="6">
                                <Form.Control type="text"
                                    placeholder="Username..."
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Form.Label column sm="2">
                                Password <span className='required'>*</span>
                            </Form.Label>
                            <Col sm="6">
                                <Form.Control type="password"
                                    placeholder="Password..."
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)} />
                            </Col>
                        </Form.Group>
                    </Form>
                    <Form.Group as={Row} controlId="project-name">
                        <Form.Label column sm="2">
                        </Form.Label>
                        <Col sm="1">
                            <Button variant="primary" onClick={saveHandler}>Submit</Button>{' '}
                        </Col>
                    </Form.Group>
                </Card.Body>
            </Card>
            {hasError && <SystemAlert variant="danger" message={message} />}
            <SystemToast
                visible={showToast}
                majorHeading={majorHeading}
                body={toastBody}
            />
        </Container>
    );
});