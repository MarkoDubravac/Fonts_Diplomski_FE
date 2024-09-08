import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { request } from "../../axios_helper"; // Assuming this supports different HTTP methods

const AdminStats = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = () => {
        request("GET", "/admin/stats")
            .then((response) => {
                setStats(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching admin stats: ", error);
                setError(error.message);
                setLoading(false);
            });
    };

    const handleDelete = () => {
        request("DELETE", "/admin/deleteAll")
            .then(() => {
                // Refresh stats after deletion
                fetchStats();
            })
            .catch((error) => {
                console.error("Error deleting sessions: ", error);
                setError("Failed to delete sessions");
            });
    };

    const handleExport = () => {
        request('get', '/admin/export')
            .then(response => {
                if (response.status === 200) {
                    const csvContent = response.data; // Directly use response.data
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'surveys.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                } else {
                    throw new Error('Failed to fetch CSV data');
                }
            })
            .catch(error => {
                console.error("Error exporting surveys: ", error);
                setError("Failed to export surveys");
            });
    };

    const handleParticipantExport = () => {
        request('get', '/admin/exportParticipantData')
            .then(response => {
                if (response.status === 200) {
                    const csvContent = response.data; // Directly use response.data
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'participant.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                } else {
                    throw new Error('Failed to fetch CSV data');
                }
            })
            .catch(error => {
                console.error("Error exporting surveys: ", error);
                setError("Failed to export surveys");
            });
    };


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container mt-3 mb-3">
            <h5 className="mb-2">Sesije</h5>
            <Table className="mb-3" striped bordered hover>
                <thead>
                <tr>
                    <th>Sesija</th>
                    <th>Prosječna ocjena</th>
                    <th>Prosječno trajanje</th>
                </tr>
                </thead>
                <tbody>
                {stats.map((stat, index) => (
                    <tr key={index}>
                        <td>{stat.surveySession}</td>
                        <td>{stat.averageRating.toFixed(2)}</td>
                        <td>{stat.averageDuration.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <Button variant="danger" onClick={handleDelete}>Obriši sesije</Button>
                </div>
                <div>
                    <Button className="me-2" variant="success" onClick={handleExport}>Export rezultata</Button>
                    <Button variant="success" onClick={handleParticipantExport}>Export sudionika</Button>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
