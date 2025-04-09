import React, { useRef } from 'react';
import api from '../services/api';

const FileOperations = ({ setRecords }) => {
    const fileInputRef = useRef(null);

    const loadRecords = async () => {
        console.log('Loading records from titanic.json');
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
            console.error('Error in loadRecords:', error);
            alert('Error loading data: ' + error.message);
        }
    };

    const clearRecords = async () => {
        console.log('Clearing records');
        try {
            await api.clearRecords();
            setRecords([]);
            alert('Records cleared successfully');
        } catch (error) {
            console.error('Error in clearRecords:', error);
            alert('Error clearing records: ' + error.message);
        }
    };

    const saveRecords = async () => {
        console.log('Saving records to Downloads');
        try {
            const records = await api.getRecords();
            if (!Array.isArray(records)) {
                throw new Error('Records data is not an array');
            }

            const jsonString = JSON.stringify(records, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'records.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert('Records saved to Downloads');
        } catch (error) {
            console.error('Error in saveRecords:', error);
            alert('Error saving records: ' + error.message);
        }
    };

    const loadFile = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        console.log('Loading file:', file.name);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const fileData = JSON.parse(e.target.result);
                    if (!Array.isArray(fileData)) {
                        throw new Error('Loaded file is not an array');
                    }

                    const currentRecords = await api.getRecords();
                    if (!Array.isArray(currentRecords)) {
                        throw new Error('Current records data is not an array');
                    }

                    const existingIds = new Set(currentRecords.map(record => record.PassengerId));
                    const newRecords = fileData.filter(record => !existingIds.has(record.PassengerId));

                    const updatedRecords = [...currentRecords, ...newRecords];

                    await api.saveRecords(updatedRecords);
                    setRecords(updatedRecords);
                    alert('File loaded and records updated successfully');
                } catch (error) {
                    console.error('Error in loadFile (parsing):', error);
                    alert('Error loading file: ' + error.message);
                }
            };
            reader.readAsText(file);
        } catch (error) {
            console.error('Error in loadFile (reading):', error);
            alert('Error reading file: ' + error.message);
        }
    };

    const openFileExplorer = () => {
        console.log('Opening file explorer');
        fileInputRef.current.click();
    };

    return (
        <div style={{ margin: '20px 0' }}>
            <h2>File Operations</h2>
            <button style={{ marginRight: '10px', padding: '8px 16px' }} onClick={loadRecords}>Load from File</button>
            <button style={{ marginRight: '10px', padding: '8px 16px' }} onClick={clearRecords}>New File</button>
            <button style={{ marginRight: '10px', padding: '8px 16px' }} onClick={saveRecords}>Save File</button>
            <button style={{ marginRight: '10px', padding: '8px 16px' }} onClick={openFileExplorer}>Load File</button>
            <button style={{ marginRight: '10px', padding: '8px 16px' }} onClick={clearRecords}>Clear Records</button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="application/json"
                onChange={loadFile}
            />
        </div>
    );
};

export default FileOperations;