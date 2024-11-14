const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Path to attendance records file
const ATTENDANCE_FILE = path.join(__dirname, 'attendance.json');

// Endpoint to mark attendance
app.post('/markattendance', (req, res) => {
    const { name, date } = req.body;

    if (!name || !date) {
        return res.status(400).json({ error: 'Name and Date are required.' });
    }

    // Read existing data
    fs.readFile(ATTENDANCE_FILE, (err, data) => {
        let attendanceRecords = [];

        if (!err && data.length > 0) {
            attendanceRecords = JSON.parse(data);
        }

        // Add the new record
        attendanceRecords.push({ name, date });

        // Save updated records
        fs.writeFile(ATTENDANCE_FILE, JSON.stringify(attendanceRecords, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save attendance.' });
            }
            res.status(200).json({ message: 'Attendance recorded successfully!' });
        });
    });
});

// Endpoint to view attendance
app.get('/saveattendance', (req, res) => {
    fs.readFile(ATTENDANCE_FILE, (err, data) => {
        if (err || data.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(JSON.parse(data));
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

