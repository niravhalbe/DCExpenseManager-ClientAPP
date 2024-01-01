import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Form } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/useStore';
import { SystemAlert } from '../ui-componants/SystemAlert/SystemAlert';
import { delay, getToastMessage, handleNullOrUndefined } from '../utils/helperFunctions';
import { useNavigate, useParams } from 'react-router-dom';
import { SystemToast } from '../ui-componants/SystemToast/SystemToast';
import { CustomerGrid } from './Grids/CustomerGrid';

export const Customer = observer(() => {
    const { rootStore } = useStore();
    const [customerId, setCustomerId] = useState(0);
    const [name, setName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [majorHeading, setMajorHeading] = useState("");
    const [toastBody, setToastBody] = useState("");
    const [customers, setCustomers] = useState([]);

    const navigate = useNavigate();
    const { id: selectedCustomerId } = useParams();

    useEffect(() => {
        rootStore.customerStore.resetCustomerById();
        rootStore.customerStore.fetchCustomers();
    }, []);

    useEffect(() => {
        const customers = rootStore.customerStore.getCustomers;
        setCustomers(customers);
    }, [rootStore.customerStore.getCustomers])

    useEffect(() => {
        fetchCustomerDetailsFromQueryString();
    }, [selectedCustomerId]);

    useEffect(() => {
        const selectedCustomer = rootStore.customerStore.getCustomerById;
        if (selectedCustomer !== null) {
            setCustomerId(selectedCustomer.customerId);
            setName(selectedCustomer.name);
            setIsActive(selectedCustomer.isActive);
        }
    }, [selectedCustomerId, rootStore.customerStore.getCustomerById])

    const fetchCustomerDetailsFromQueryString = () => {
        if (handleNullOrUndefined(selectedCustomerId) !== "") {
            rootStore.customerStore.fetchCustomerById(selectedCustomerId);
        }
    }

    const showError = (message) => {
        setHasError(true);
        setMessage(message);
    }

    const displayToast = async (type) => {
        setMajorHeading("Customer");
        setToastBody(getToastMessage(type));
        setShowToast(true);
        await delay(2000);
        setShowToast(false);
    }

    const clearStates = () => {
        setCustomerId(0);
        setName("");
        setIsActive(true);
        setHasError(false);
    }

    const cancelHandler = () => {
        rootStore.customerStore.resetCustomerById();
        clearStates();
        navigate("/customer", { replace: true });
    }

    const deleteHandler = async (customerId) => {
        await rootStore.customerStore.deleteCustomer(customerId);
        await rootStore.customerStore.fetchCustomers();
        displayToast("delete");
        cancelHandler();
    }

    const saveHandler = async () => {
        setHasError(false);
        if (handleNullOrUndefined(name.trim()) === "") {
            showError("Name cannot be empty !");
            return false;
        }
        const postObject = {
            CustomerId: customerId,
            Name: name,
            IsActive: isActive
        }
        await rootStore.customerStore.saveCustomer(postObject);
        displayToast(customerId > 0 ? "update" : "insert");
        cancelHandler();
        rootStore.customerStore.fetchCustomers();
    }

    return (
        <Container>
            <Row>
                <h1>Customer</h1>
                <SystemToast
                    visible={showToast}
                    majorHeading={majorHeading}
                    body={toastBody}
                />
            </Row>
            <Row>
                <Form>
                    <Form.Group className="mb-4" controlId="customer-name">
                        <Form.Label>Name <span className='required'>*</span></Form.Label>
                        <Form.Control type="text"
                            placeholder="Customer..."
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
                    <Form.Group className="mb-4" controlId="customer-name">
                        {hasError && <SystemAlert variant="danger" message={message} />}
                        <Button variant="outline-primary" onClick={saveHandler}>Save</Button>{' '}
                        <Button variant="outline-primary" onClick={cancelHandler}>Cancel</Button>
                    </Form.Group>
                </Form>
            </Row>
            <Row>
                <CustomerGrid customers={customers} deleteCustomer={deleteHandler} />
            </Row>
        </Container>
    );
});