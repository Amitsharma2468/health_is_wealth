const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD || '', // Use environment variable for password
  database: 'lifecycle'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); // Exit process with error code
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { fullName, username, email, password } = req.body;
  console.log('Signup request received:', req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sqlSignup = 'INSERT INTO signupdb (fullName, username, email, password) VALUES (?, ?, ?, ?)';
    db.query(sqlSignup, [fullName, username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err.sqlMessage);
        return res.status(500).json({ error: 'Internal server error' });
      }

      console.log('New user signed up:', result);
      return res.status(201).json({ message: 'Signup successful' });
    });
  } catch (err) {
    console.error('Error hashing password:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login request received:', req.body);

  const sql = 'SELECT * FROM signupdb WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err.sqlMessage);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    console.log('User logged in:', user);
    return res.status(200).json({ message: 'Login successful', username: user.username });
  });
});

// Update profile endpoint
app.post('/api/profile/:username', async (req, res) => {
  const { habits, age, bloodGroup, birthdate } = req.body;
  const { username } = req.params;

  const sqlUpdate = `
    UPDATE signupdb 
    SET habits = ?, age = ?, bloodGroup = ?, birthdate = ? 
    WHERE username = ?
  `;

  console.log("Hitted with",username);

  db.query(sqlUpdate, [habits, age, bloodGroup, birthdate, username], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err.sqlMessage);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log('Profile information updated for user:', username);
    return res.status(200).json({ message: 'Profile information updated successfully' });
  });
});

// Fetch profile information endpoint
app.get('/api/profile/:username', (req, res) => {
  const { username } = req.params;
  const sqlFetch = 'SELECT habits, age, bloodGroup, birthdate FROM signupdb WHERE username = ?';

  db.query(sqlFetch, [username], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err.sqlMessage);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = results[0];
    return res.status(200).json({ profile });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
