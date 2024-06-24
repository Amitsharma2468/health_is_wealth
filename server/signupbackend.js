const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lifecycle'
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { fullName, username, email, password } = req.body;
  
  // Insert into signupdb table
  const sql = 'INSERT INTO signupdb (fullName, username, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [fullName, username, email, password], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    console.log('New user signed up:', result);
    return res.status(201).json({ message: 'Signup successful' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
