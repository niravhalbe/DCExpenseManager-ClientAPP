import Alert from 'react-bootstrap/Alert';

export const SystemAlert = ({ variant, message }) => {
    return (
        <>
            <Alert key={variant} variant={variant}>
                {message}
            </Alert>
        </>
    );
};