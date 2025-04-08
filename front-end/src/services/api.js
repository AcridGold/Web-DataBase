import axios from 'axios';

const api = {
    getRecords: async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/records');
            return response.data;
        } catch (error) {
            console.error('Error fetching records:', error.message);
            return [];
        }
    },

    addRecord: async (record) => {
        try {
            await axios.post('http://localhost:5000/api/add', record);
        } catch (error) {
            console.error('Error adding record:', error.message);
            throw error;
        }
    },

    findRecords: async (name) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/find?name=${name}`);
            return response.data;
        } catch (error) {
            console.error('Error finding records:', error.message);
            return [];
        }
    },

    deleteRecord: async (passengerId) => {
        try {
            await axios.delete(`http://localhost:5000/api/delete?passengerId=${passengerId}`);
        } catch (error) {
            console.error('Error deleting record:', error.message);
            throw error;
        }
    },

    saveRecords: async (records) => {
        try {
            await axios.post('http://localhost:5000/api/records', { data: JSON.stringify(records) });
        } catch (error) {
            console.error('Error saving records:', error.message);
            throw error;
        }
    }
};

export default api;