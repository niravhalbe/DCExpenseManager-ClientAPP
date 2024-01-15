import Spinner from 'react-bootstrap/Spinner';
import './Loader.css';
import { useEffect, useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { observer } from 'mobx-react-lite';

export const Loader = observer(() => {
    const { rootStore } = useStore();
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        setShowSpinner(rootStore.commonStore.getLoader);
    }, [rootStore.commonStore.getLoader])
    return (
        <>
            <div className={showSpinner ? "overlay" : "display:none"}>
                <div className="spinner" style={{ display: showSpinner ? "block" : "none" }}>
                    <Spinner animation="grow" variant="dark" />
                </div>
            </div>
        </>
    );
});