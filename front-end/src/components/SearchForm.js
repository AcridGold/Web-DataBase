import React from 'react';
import api from '../services/api';

function SearchForm({ filterName, setFilterName, setRecords }) {
    const findRecords = async () => {
        const filteredRecords = await api.findRecords(filterName);
        setRecords(filteredRecords);
    };

    return (
        <div>
            <h2>Search</h2>
            <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Filter by Name" />
            <button onClick={findRecords}>Find</button>
        </div>
    );
}

export default SearchForm;