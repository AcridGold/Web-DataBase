const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const recordsFilePath = path.join(__dirname, 'data', 'records.json');

const readRecords = async () => {
    try {
        const data = await fs.readFile(recordsFilePath, 'utf8');
        if (data.trim() === '') {
            await fs.writeFile(recordsFilePath, JSON.stringify([], null, 2));
            return [];
        }
        let records = JSON.parse(data);
        if (records && typeof records === 'object' && 'data' in records) {
            if (typeof records.data === 'string') {
                try {
                    records = JSON.parse(records.data);
                } catch (parseError) {
                    console.error('Error parsing records.data:', parseError);
                    records = [];
                }
            } else {
                records = records.data;
            }
        }
        if (!Array.isArray(records)) {
            console.warn('records.json does not contain an array, resetting to []');
            records = [];
            await fs.writeFile(recordsFilePath, JSON.stringify(records, null, 2));
        }
        return records;
    } catch (error) {
        console.error('Error reading records:', error);
        throw error;
    }
};

app.post('/api/records/add', async (req, res) => {
    try {
        const newRecord = req.body;
        if (!newRecord || !newRecord.PassengerId) {
            return res.status(400).json({ error: 'Invalid record data' });
        }

        const records = await readRecords();

        const existingRecord = records.find(record => record.PassengerId === newRecord.PassengerId);
        if (existingRecord) {
            return res.status(400).json({ error: 'Record with this PassengerId already exists' });
        }

        records.push(newRecord);
        await fs.writeFile(recordsFilePath, JSON.stringify(records, null, 2));
        res.json(newRecord);
    } catch (error) {
        console.error('Error adding record:', error);
        res.status(500).json({ error: 'Failed to add record' });
    }
});

app.put('/api/records/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedRecord = req.body;

        const records = await readRecords();
        const index = records.findIndex(record => record.PassengerId === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Record not found' });
        }

        records[index] = { ...records[index], ...updatedRecord };
        await fs.writeFile(recordsFilePath, JSON.stringify(records, null, 2));
        res.json(records[index]);
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Failed to update record' });
    }
});

app.delete('/api/records/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const records = await readRecords();
        const index = records.findIndex(record => record.PassengerId === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Record not found' });
        }

        records.splice(index, 1);
        await fs.writeFile(recordsFilePath, JSON.stringify(records, null, 2));
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

app.get('/api/records', async (req, res) => {
    try {
        const records = await readRecords();
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read records' });
    }
});

app.post('/api/records', async (req, res) => {
    try {
        let records = req.body;
        console.log('Received records to save:', records);
        if (records && typeof records === 'object' && 'data' in records) {
            if (typeof records.data === 'string') {
                try {
                    records = JSON.parse(records.data);
                } catch (parseError) {
                    console.error('Error parsing records.data:', parseError);
                    return res.status(400).json({ error: 'Invalid data format in request body' });
                }
            } else {
                records = records.data;
            }
        }
        if (!Array.isArray(records)) {
            console.error('Request body is not an array:', records);
            return res.status(400).json({ error: 'Request body must be an array' });
        }
        await fs.writeFile(recordsFilePath, JSON.stringify(records, null, 2));
        res.json({ message: 'Records saved successfully' });
    } catch (error) {
        console.error('Error saving records:', error);
        res.status(500).json({ error: 'Failed to save records' });
    }
});

app.post('/api/records/clear', async (req, res) => {
    try {
        await fs.writeFile(recordsFilePath, JSON.stringify([], null, 2));
        res.json({ message: 'Records cleared successfully' });
    } catch (error) {
        console.error('Error clearing records:', error);
        res.status(500).json({ error: 'Failed to clear records' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});