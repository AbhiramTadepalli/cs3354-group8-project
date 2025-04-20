const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const db = require('./dbConnection.js')
const app = express();

//MiddleWare
app.use(cors());
app.use(express.json());

// default route
app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

// Include route files
const retrieve = require('./routes/retrieveFromDB.js');
const send = require('./routes/sendToDB.js');

// Use routes
app.use('/GET', retrieve);
app.use('/POST', send);

// specify port and start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/get-professor', (req, res) => {
    const query = 'SELECT * FROM Users WHERE user_id = ?'; // make sure the table name is correct
    db.query(query, [24], (err, results) => {
      if (err) {
        console.error('Query error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    });
  });
  