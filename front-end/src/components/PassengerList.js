import React from 'react';
import api from '../services/api';

function PassengerList({ records, setRecords }) {
    const deleteRecord = async (passengerId) => {
        try {
            await api.deleteRecord(passengerId);
            const updatedRecords = await api.getRecords();
            setRecords(updatedRecords);
        } catch (error) {
            alert('Error deleting record: ' + error.message);
        }
    };

    const fetchRecords = async () => {
        try {
            const updatedRecords = await api.getRecords();
            setRecords(updatedRecords);
        } catch (error) {
            alert('Error fetching records: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Records</h2>
            <button onClick={fetchRecords}>Show All</button>
            {records.length === 0 ? (
                <p>No records available.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>PassengerId</th>
                        <th>Survived</th>
                        <th>Pclass</th>
                        <th>Name</th>
                        <th>Sex</th>
                        <th>Age</th>
                        <th>SibSp</th>
                        <th>Parch</th>
                        <th>Ticket</th>
                        <th>Fare</th>
                        <th>Cabin</th>
                        <th>Embarked</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {records.map((record, index) => (
                        <tr key={index}>
                            <td>{record.PassengerId}</td>
                            <td>{record.Survived}</td>
                            <td>{record.Pclass}</td>
                            <td>{record.Name}</td>
                            <td>{record.Sex}</td>
                            <td>{record.Age === "null" ? "null" : record.Age}</td>
                            <td>{record.SibSp}</td>
                            <td>{record.Parch}</td>
                            <td>{record.Ticket}</td>
                            <td>{record.Fare}</td>
                            <td>{record.Cabin === "null" ? "null" : record.Cabin}</td>
                            <td>{record.Embarked}</td>
                            <td>
                                <button onClick={() => deleteRecord(record.PassengerId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default PassengerList;