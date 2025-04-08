import React, { useState } from 'react';
import api from '../services/api';

function PassengerForm({ setRecords }) {
    const [passengerId, setPassengerId] = useState('');
    const [survived, setSurvived] = useState(0);
    const [pclass, setPclass] = useState(1);
    const [name, setName] = useState('');
    const [sex, setSex] = useState('male');
    const [age, setAge] = useState(-1.0);
    const [sibSp, setSibSp] = useState(0);
    const [parch, setParch] = useState(0);
    const [ticket, setTicket] = useState('');
    const [fare, setFare] = useState(0.0);
    const [cabin, setCabin] = useState('');
    const [embarked, setEmbarked] = useState('S');

    const addRecord = async () => {
        try {
            const record = {
                PassengerId: passengerId,
                Survived: parseInt(survived).toString(),
                Pclass: parseInt(pclass).toString(),
                Name: name,
                Sex: sex,
                Age: parseFloat(age) === -1.0 ? "null" : parseFloat(age),
                SibSp: parseInt(sibSp).toString(),
                Parch: parseInt(parch).toString(),
                Ticket: ticket,
                Fare: parseFloat(fare),
                Cabin: cabin || "null",
                Embarked: embarked
            };
            await api.addRecord(record);
            const updatedRecords = await api.getRecords();
            setRecords(updatedRecords);
            resetForm();
        } catch (error) {
            alert('Error adding record: ' + error.message);
        }
    };

    const resetForm = () => {
        setPassengerId('');
        setSurvived(0);
        setPclass(1);
        setName('');
        setSex('male');
        setAge(-1.0);
        setSibSp(0);
        setParch(0);
        setTicket('');
        setFare(0.0);
        setCabin('');
        setEmbarked('S');
    };

    return (
        <div>
            <h2>Add Passenger</h2>
            <div>
                <label>Passenger ID:</label>
                <input value={passengerId} onChange={(e) => setPassengerId(e.target.value)} placeholder="PassengerId" />
            </div>
            <div>
                <label>Survived (0 or 1):</label>
                <input type="number" value={survived} onChange={(e) => setSurvived(e.target.value)} placeholder="Survived" />
            </div>
            <div>
                <label>Pclass (1, 2, or 3):</label>
                <input type="number" value={pclass} onChange={(e) => setPclass(e.target.value)} placeholder="Pclass" />
            </div>
            <div>
                <label>Name:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            </div>
            <div>
                <label>Sex:</label>
                <select value={sex} onChange={(e) => setSex(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div>
                <label>Age (-1 for null):</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age (-1 for null)" />
            </div>
            <div>
                <label>SibSp (Siblings/Spouses):</label>
                <input type="number" value={sibSp} onChange={(e) => setSibSp(e.target.value)} placeholder="SibSp" />
            </div>
            <div>
                <label>Parch (Parents/Children):</label>
                <input type="number" value={parch} onChange={(e) => setParch(e.target.value)} placeholder="Parch" />
            </div>
            <div>
                <label>Ticket:</label>
                <input value={ticket} onChange={(e) => setTicket(e.target.value)} placeholder="Ticket" />
            </div>
            <div>
                <label>Fare:</label>
                <input type="number" step="0.01" value={fare} onChange={(e) => setFare(e.target.value)} placeholder="Fare" />
            </div>
            <div>
                <label>Cabin (empty for null):</label>
                <input value={cabin} onChange={(e) => setCabin(e.target.value)} placeholder="Cabin (empty for null)" />
            </div>
            <div>
                <label>Embarked (S, C, or Q):</label>
                <select value={embarked} onChange={(e) => setEmbarked(e.target.value)}>
                    <option value="S">S</option>
                    <option value="C">C</option>
                    <option value="Q">Q</option>
                </select>
            </div>
            <button onClick={addRecord}>Add</button>
        </div>
    );
}

export default PassengerForm;