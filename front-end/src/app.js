import React, { useState, useEffect } from 'react';
import PassengerForm from './components/PassengerForm';
import PassengerList from './components/PassengerList';
import SearchForm from './components/SearchForm';
import FileOperations from './components/FileOperations';
import api from './services/api';
import './App.css';

function App() {
    const [records, setRecords] = useState([]);
    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        const loadExistingData = async () => {
            try {
                const existingRecords = await api.getRecords();
                setRecords(existingRecords);
            } catch (error) {
                console.error('Error loading existing data:', error.message);
                setRecords([]);
            }
        };

        loadExistingData();
    }, []);

    return (
        <div className="App">
            <h1>Titanic Notebook</h1>
            <PassengerForm setRecords={setRecords} />
            <SearchForm filterName={filterName} setFilterName={setFilterName} setRecords={setRecords} />
            <PassengerList records={records} setRecords={setRecords} />
            <FileOperations records={records} setRecords={setRecords} />
        </div>
    );
}

export default App;