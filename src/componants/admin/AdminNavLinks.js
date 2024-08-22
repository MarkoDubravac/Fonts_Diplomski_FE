import React from 'react';
import { Nav } from 'react-bootstrap';

export default function AdminNavLinks({ onSelect }) {
    return (
        <Nav fill variant="tabs" defaultActiveKey="/" onSelect={onSelect}>
            <Nav.Item>
                <Nav.Link eventKey="surveys">
                    Surveys
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="newSurveys">
                    New Survey
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="newTexts">
                    New Texts
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="adminStats">
                    Stats
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}
