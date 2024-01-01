import { useState } from 'react';
import { ToastContainer } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';

export const SystemToast = ({ majorHeading, minorHeading, body, visible }) => {
    return (
        <div style={{ display: visible ? "block" : "none" }}>
            <ToastContainer
                className="p-3"
                position="bottom-end"
                style={{ zIndex: 1 }}
            >
                <Toast delay={3000} autohide>
                    <Toast.Header closeButton={false} >
                        <strong className="me-auto">{majorHeading}</strong>
                        {minorHeading && <small>minorHeading</small>}
                    </Toast.Header>
                    <Toast.Body>{body}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}