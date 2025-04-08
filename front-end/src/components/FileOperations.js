import React from 'react';
import api from '../services/api';

function FileOperations({ records, setRecords }) {
    const loadRecords = async () => {
        try {
            const response = await fetch('/data/titanic.json');
            if (!response.ok) {
                throw new Error('Failed to fetch titanic.json');
            }

            let titanicData;
            try {
                titanicData = await response.json();
            } catch (jsonError) {
                throw new Error('Invalid JSON in titanic.json: ' + jsonError.message);
            }

            console.log('titanicData before sending:', titanicData);
            if (!Array.isArray(titanicData)) {
                if (typeof titanicData === 'string') {
                    try {
                        titanicData = JSON.parse(titanicData);
                    } catch (parseError) {
                        throw new Error('titanicData is a string but cannot be parsed: ' + parseError.message);
                    }
                }
                if (!Array.isArray(titanicData)) {
                    throw new Error('titanicData is not an array');
                }
            }

            await api.saveRecords(titanicData);

            const updatedRecords = await api.getRecords();
            console.log('updatedRecords after fetching:', updatedRecords);
            if (!Array.isArray(updatedRecords)) {
                throw new Error('Received data is not an array');
            }
            setRecords(updatedRecords);
            alert('Data loaded successfully from titanic.json');
        } catch (error) {
            alert('Error loading data: ' + error.message);
        }
    };

    const saveRecords = async () => {
        try {
            await api.saveRecords(records);
            alert('Data saved to file');
        } catch (error) {
            alert('Error saving data: ' + error.message);
        }
    };

    return (
        <div>
            <h2>File Operations</h2>
            <div>
                <button onClick={loadRecords}>Load from File</button>
            </div>
            <div>
                <button onClick={saveRecords}>Save to File</button>
            </div>
        </div>
    );
}

export default FileOperations;