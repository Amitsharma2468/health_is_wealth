const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const SSLCommerzPayment = require("sslcommerz-lts");

const app = express();
const port = process.env.PORT || 5000;

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: 'lifecycle'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(uploadDir));

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!uploadDir) {
      return cb(new Error('Upload directory is not defined'));
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// SSLCommerz Configuration
const sslcommerzDb = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: 'lifecycle'
}).promise();

const store_id = process.env.NEXT_PUBLIC_SSL_STORE_ID;
const store_passwd = process.env.NEXT_PUBLIC_SSL_STORE_PASSWORD;
const is_live = false;

app.get("/sslcommerz", (req, res) => {
  res.send({ store_id, store_passwd });
});

app.post("/sslcommerz/init", async (req, res) => {
  const { name, age, bloodGroup, amount, currency } = req.body;
  const tran_id = `TRANS_${Date.now()}`;
  const data = {
    store_id,
    store_passwd,
    total_amount: amount,
    cus_name: name,
    cus_age: age,
    cus_bloodGroup: bloodGroup,
    cus_email: "customer@example.com",
    cus_phone: "01711111111",
    shipping_method: "NO",
    product_name: "Registration",
    product_category: "N/A",
    product_profile: "Ticket",
    currency,
    tran_id,
    success_url: `http://localhost:${port}/sslcommerz/success/${tran_id}`,
    fail_url: `http://localhost:${port}/sslcommerz/fail`,
    cancel_url: `http://localhost:${port}/sslcommerz/fail`,
    emi_option: 0,
  };

  try {
    const query = `INSERT INTO bills (transaction_id, name, age, blood_group, status, amount, currency) VALUES (?, ?, ?, ?, 'pending', ?, ?)`;
    await sslcommerzDb.execute(query, [data.tran_id, name, age, bloodGroup, data.total_amount, currency]);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({ url: GatewayPageURL });
      console.log("Redirecting to: ", GatewayPageURL);
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post("/sslcommerz/success/:tran_id", async (req, res) => {
  const { tran_id } = req.params;

  try {
    // Update the bill status to 'paid' in the database
    const updateQuery = `UPDATE bills SET status = 'paid' WHERE transaction_id = ?`;
    const [result] = await sslcommerzDb.execute(updateQuery, [tran_id]);

    if (result.affectedRows > 0) {
      console.log(`Transaction ${tran_id} updated successfully.`);
      // Redirect to the success page or send any other response
      res.redirect(`http://localhost:5173/success?invoice=${tran_id}`);
    } else {
      console.log(`Transaction ${tran_id} not found.`);
      res.status(404).send('Transaction not found');
    }
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).send('Error updating transaction status');
  }
});
// Endpoint to get transaction details
app.get("/api/transaction/:tran_id", async (req, res) => {
  const { tran_id } = req.params;

  try {
    // Query to get transaction details from the database
    const query = `SELECT * FROM bills WHERE transaction_id = ?`;
    const [rows] = await sslcommerzDb.execute(query, [tran_id]);

    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send('Transaction not found');
    }
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).send('Error fetching transaction details');
  }
});


app.post("/sslcommerz/fail", (req, res) => {
  res.redirect("http://localhost:5173/fail");
});

// Other Routes
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
app.post('/api/profile/:username', upload.single('profilePicture'), (req, res) => {
  const { habits, age, bloodGroup, birthdate, profilePictureUrl } = req.body;
  const { username } = req.params;

  const sqlUpdate = 
    `UPDATE signupdb 
    SET habits = ?, age = ?, bloodGroup = ?, birthdate = STR_TO_DATE(?, '%Y-%m-%d'), profilePicture = ?
    WHERE username = ?`
  ;

  db.query(sqlUpdate, [habits, age, bloodGroup, birthdate, profilePictureUrl, username], (err, result) => {
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
  const sqlFetch = 'SELECT habits, age, bloodGroup, DATE_FORMAT(birthdate, "%Y-%m-%d") AS birthdate, profilePicture FROM signupdb WHERE username = ?';

  db.query(sqlFetch, [username], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err.sqlMessage);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = results[0];
    if (profile.profilePicture) {
      profile.profilePictureUrl = profile.profilePicture;
    }
    return res.status(200).json({ profile });
  });
});

// Fetch doctor list endpoint
app.get('/api/doctors', (req, res) => {
  const sqlFetchDoctors = 'SELECT name, degree, hospital, address, phonenum, link FROM doctorlist';

  db.query(sqlFetchDoctors, (err, results) => {
    if (err) {
      console.error('Error fetching doctor list:', err.sqlMessage);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json({ doctors: results });
  });
});

// Fetch medicine list endpoint
app.get('/api/medicines', (req, res) => {
  const sqlFetchMedicines = 'SELECT name, generic, drugclass, uses, sideeffects, precautions, interactions, image FROM medicine_list';

  db.query(sqlFetchMedicines, (err, results) => {
    if (err) {
      console.error('Error fetching medicine list:', err.sqlMessage);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json({ medicines: results });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});