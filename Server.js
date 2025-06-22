const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 🛢 MySQL Setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mahadev#441',
  database: 'kerala_dashboard'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected');
});

// 🗂 Chat file
const chatFilePath = './chat.json';

// 🧠 USERS file
const usersFilePath = './users.json';

// 🧩 ROUTES

// -- CHAT --
app.get('/api/chat', (req, res) => {
  fs.readFile(chatFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read chat file' });
    res.json(JSON.parse(data || '[]'));
  });
});

app.post('/api/chat', (req, res) => {
  const newMessage = req.body;
  fs.readFile(chatFilePath, 'utf-8', (err, data) => {
    const messages = err ? [] : JSON.parse(data || '[]');
    messages.push(newMessage);
    fs.writeFile(chatFilePath, JSON.stringify(messages, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to write chat message' });
      res.json({ success: true });
    });
  });
});

// 🚧 Vendor Project Submission API
// ✅ Vendor Project Submission Route
app.post('/api/vendor-submissions', (req, res) => {
  const {
    title,
    type,
    cost,
    description,
    location,
    vendorId,
    vendorName,
    status,
    submitDate
  } = req.body;

  const sql = `
    INSERT INTO vendor_submissions
    (title, type, cost, description, location, vendor_id, vendor_name, status, submit_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, type, cost, description, location, vendorId, vendorName, status, submitDate], (err, result) => {
    if (err) {
      console.error('❌ MySQL Insert Error:', err);
      return res.status(500).json({ error: 'Database error while inserting submission' });
    }
    res.status(200).json({ message: 'Project submitted successfully', id: result.insertId });
  });
});
// ✅ Get all vendor submissions
app.get('/api/vendor-submissions', (req, res) => {
  const query = `SELECT * FROM vendor_submissions ORDER BY submit_date DESC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch vendor submissions:', err);
      return res.status(500).json({ error: 'Failed to fetch vendor submissions' });
    }

    res.json({ submissions: results });
  });
});



// -- SOCKET.IO --
io.on('connection', (socket) => {
  console.log('🔌 New user connected');

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);
    fs.readFile(chatFilePath, 'utf-8', (err, data) => {
      const messages = err ? [] : JSON.parse(data || '[]');
      messages.push(msg);
      fs.writeFile(chatFilePath, JSON.stringify(messages, null, 2), () => {});
    });
  });

  socket.on('typing', (user) => {
    socket.broadcast.emit('typing', user);
  });
});

// -- MYSQL APIs --
app.get('/api/departments', (req, res) => {
  db.query('SELECT * FROM departments', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ departments: results });
  });
});

app.get('/api/projects', (req, res) => {
  const query = `
    SELECT p.*, d.name AS department 
    FROM projects p
    JOIN departments d ON p.department_id = d.id`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch projects' });
    res.json({ projects: results });
  });
});

app.put('/api/departments/status', (req, res) => {
  const { departmentId, status } = req.body;
  const query = `
    UPDATE departments 
    SET status = ?, 
        last_updated = CURDATE(), 
        completion_rate = CASE 
            WHEN ? = 'Completed' THEN 100
            WHEN ? = 'Ongoing' THEN 70
            ELSE 30 
        END 
    WHERE id = ?`;

  db.query(query, [status, status, status, departmentId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update status' });
    res.json({ message: 'Status updated successfully' });
  });
});

app.post('/api/reports/upload', (req, res) => {
  res.json({ message: 'Report uploaded (simulated)' });
});

// -- USERS (file-based) --
app.post('/login', (req, res) => {
  const { role, username, password } = req.body;

  if (!role || !username || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

  const user = users.find(
    (u) => u.role === role && u.username === username && u.password === password
  );

  if (user) {
    res.json({ success: true, message: "Login successful!", role: user.role });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.post('/update-users', (req, res) => {
  const { adminKey, newUser } = req.body;

  if (adminKey !== "mySecretAdminKey") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    res.json({ success: true, message: "User added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating users" });
  }
});

app.post('/delete-user', (req, res) => {
  const { adminKey, username } = req.body;

  if (adminKey !== "admin123") {
    return res.status(403).json({ success: false, message: "Invalid admin key" });
  }

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }

  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  const updatedUsers = users.filter((user) => user.username !== username);

  if (users.length === updatedUsers.length) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  fs.writeFileSync(usersFilePath, JSON.stringify(updatedUsers, null, 2));
  res.json({ success: true, message: `User "${username}" deleted successfully.` });
});

// 🚀 Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
