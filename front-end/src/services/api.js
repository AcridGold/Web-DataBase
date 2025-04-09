import axios from 'axios';

const api = {
    getRecords: async () => {
        const response = await axios.get('http://localhost:5000/api/records');
        console.log('Response from getRecords:', response.data);
        return response.data;
    },
    saveRecords: async (records) => {
        console.log('Sending records to save:', records);
        await axios.post('http://localhost:5000/api/records', records);
    },
    addRecord: async (record) => {
        console.log('Adding record:', record);
        const response = await axios.post('http://localhost:5000/api/records/add', record);
        console.log('Response from addRecord:', response.data);
        return response.data;
    },
    updateRecord: async (id, updatedRecord) => {
        console.log('Updating record with id:', id, 'data:', updatedRecord);
        const response = await axios.put(`http://localhost:5000/api/records/${id}`, updatedRecord);
        console.log('Response from updateRecord:', response.data);
        return response.data;
    },
    deleteRecord: async (id) => {
        console.log('Deleting record with id:', id);
        try {
            const response = await axios.delete(`http://localhost:5000/api/records/${id}`);
            console.log('Record deleted successfully:', response.data);
        } catch (error) {
            console.error('Error in deleteRecord:', error.response?.status, error.response?.data);
            throw error;
        }
    },
    clearRecords: async () => {
        console.log('Clearing records');
        await axios.post('http://localhost:5000/api/records/clear');
    },
};

export default api;