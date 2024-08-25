import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import {request} from "../../axios_helper";

const AdminStats = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container mt-3 mb-3">
            <h5>Korisnička statistika</h5>
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
        </div>
    );
};

export default AdminStats;
