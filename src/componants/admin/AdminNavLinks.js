import React from 'react';
import { Nav } from 'react-bootstrap';

export default function AdminNavLinks({ onSelect }) {
    return (
        <Nav fill variant="tabs" defaultActiveKey="/" onSelect={onSelect}>
            <Nav.Item>
                <Nav.Link eventKey="surveys">
                    Ankete i Kolekcije
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="newSurveys">
                    Nova Anketa
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="newTexts">
                    Nova Kolekcija i Tekst
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="adminStats">
                    Korisnikova Statistika
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}
