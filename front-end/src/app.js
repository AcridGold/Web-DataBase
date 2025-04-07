import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [records, setRecords] = useState([]);
    const [passengerId, setPassengerId] = useState('');
    const [survived, setSurvived] = useState(0);
    const [pclass, setPclass] = useState(1);
    const [name, setName] = useState('');
    const [sex, setSex] = useState('male');
    const [age, setAge] = useState(0);
    const [sibSp, setSibSp] = useState(0);
    const [parch, setParch] = useState(0);
    const [ticket, setTicket] = useState('');
    const [fare, setFare] = useState(0.0);
    const [cabin, setCabin] = useState('');
    const [embarked, setEmbarked] = useState('S');
    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/notebook.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.Module.onRuntimeInitialized = () => {
                console.log('WASM loaded');
                fetchRecords();
            };
        };
    }, []);

    const addRecord = () => {
        if (window.Module) {
            window.Module._add_record_js(
                passengerId, parseInt(survived), parseInt(pclass), name, sex, parseFloat(age),
                parseInt(sibSp), parseInt(parch), ticket, parseFloat(fare), cabin || '', embarked
            );
            resetForm();
            fetchRecords();
        }
    };

    const fetchRecords = () => {
        if (window.Module) {
            const oldLog = console.log;
            let output = [];
            console.log = (msg) => output.push(JSON.parse(msg));
            window.Module._print_all_js();
            console.log = oldLog;
            setRecords(output);
        }
    };

    const findRecords = () => {
        if (window.Module) {
            const oldLog = console.log;
            let output = [];
            console.log = (msg) => output.push(JSON.parse(msg));
            window.Module._find_by_name_js(filterName);
            console.log = oldLog;
            setRecords(output);
        }
    };

    const deleteRecord = () => {
        if (window.Module) {
            window.Module._delete_by_passengerId_js(passengerId);
            setPassengerId('');
            fetchRecords();
        }
    };

    const resetForm = () => {
        setPassengerId('');
        setSurvived(0);
        setPclass(1);
        setName('');
        setSex('male');
        setAge(0);
        setSibSp(0);
        setParch(0);
        setTicket('');
        setFare(0.0);
        setCabin('');
        setEmbarked('S');
    };

    return (
        <div className="App">
            <h1>Titanic Notebook</h1>
            <div>
                <input value={passengerId} onChange={(e) => setPassengerId(e.target.value)} placeholder="PassengerId" />
                <input type="number" value={survived} onChange={(e) => setSurvived(e.target.value)} placeholder="Survived" />
                <input type="number" value={pclass} onChange={(e) => setPclass(e.target.value)} placeholder="Pclass" />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <select value={sex} onChange={(e) => setSex(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
                <input type="number" value={sibSp} onChange={(e) => setSibSp(e.target.value)} placeholder="SibSp" />
                <input type="number" value={parch} onChange={(e) => setParch(e.target.value)} placeholder="Parch" />
                <input value={ticket} onChange={(e) => setTicket(e.target.value)} placeholder="Ticket" />
                <input type="number" step="0.01" value={fare} onChange={(e) => setFare(e.target.value)} placeholder="Fare" />
                <input value={cabin} onChange={(e) => setCabin(e.target.value)} placeholder="Cabin" />
                <select value={embarked} onChange={(e) => setEmbarked(e.target.value)}>
                    <option value="S">S</option>
                    <option value="C">C</option>
                    <option value="Q">Q</option>
                </select>
                <button onClick={addRecord}>Add</button>
            </div>
            <div>
                <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Filter by Name" />
                <button onClick={findRecords}>Find</button>
                <button onClick={deleteRecord}>Delete by PassengerId</button>
                <button onClick={fetchRecords}>Show All</button>
            </div>
            <div>
                <h2>Records</h2>
                <ul>
                    {records.map((record, index) => (
                        <li key={index}>{JSON.stringify(record)}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;