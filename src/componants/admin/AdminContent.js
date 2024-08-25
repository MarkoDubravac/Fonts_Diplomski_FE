import React, { useState, useEffect } from 'react';
import NewAdminSurvey from './NewAdminSurvey';
import LoginForm from '../LoginForm';
import Buttons from '../Buttons';
import Card from 'react-bootstrap/Card';
import { request, setAuthToken } from '../../axios_helper';
import AdminNavLinks from './AdminNavLinks';
import AllAdminSurveys from "./AllAdminSurveys";
import NewAdminText from "./NewAdminText";
import AdminStats from "./AdminStats";

export default function AdminContent() {
    const [adminPermissions, setAdminPermissions] = useState(false);
    const [componentToShow, setComponentToShow] = useState('surveys');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAdminPermissions(true);
            setAuthToken(token);
        }
    }, []);

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('token');
        setAdminPermissions(false);
    };

    const onLogin = (e, username, password) => {
        e.preventDefault();
        request('POST', '/login', { login: username, password: password })
            .then((response) => {
                setAdminPermissions(true);
                setAuthToken(response.data.token);
                localStorage.setItem('token', response.data.token);
            })
            .catch(() => {
                setAdminPermissions(false);
            });
    };

    const onRegister = (e, firstName, lastName, username, password) => {
        e.preventDefault();
        request('POST', '/register', {
            firstName: firstName,
            lastName: lastName,
            login: username,
            password: password,
        })
            .then((response) => {
                setAdminPermissions(true);
                setAuthToken(response.data.token);
                localStorage.setItem('token', response.data.token);
            })
            .catch(() => {
                setAdminPermissions(false);
            });
    };

    const handleNavSelect = (eventKey) => {
        setComponentToShow(eventKey);
    };

    return (
        <div className="container d-grid p-2" style={{ placeItems: 'center' }}>
            <Card style={{ width: '80%' }}>
                {adminPermissions && <AdminNavLinks onSelect={handleNavSelect} />}
                {!adminPermissions && (
                    <LoginForm onLogin={onLogin} onRegister={onRegister} />
                )}
                {adminPermissions && componentToShow === 'surveys' && <AllAdminSurveys />}
                {adminPermissions && componentToShow === 'newSurveys' && <NewAdminSurvey />}
                {adminPermissions && componentToShow === 'newTexts' && <NewAdminText />}
                {adminPermissions && componentToShow === 'adminStats' && <AdminStats />}
            </Card>
            {adminPermissions && <Buttons logout={logout} />}
        </div>
    );
}
