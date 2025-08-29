require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*', credentials: true }
});

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync(path.join(__dirname, 'uploads'))) fs.mkdirSync(path.join(__dirname, 'uploads'));

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Helpers
const userByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const createUser = db.prepare('INSERT INTO users (role,email,password_hash,full_name,program,year_level) VALUES (?,?,?,?,?,?)');

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, password, full_name, role = 'student', program, year_level = 1 } = req.body;
  if (!email || !password || !full_name) return res.status(400).json({ error: 'Missing fields' });
  if (userByEmail.get(email)) return res.status(409).json({ error: 'Email exists' });
  const hash = bcrypt.hashSync(password, 10);
  const info = createUser.run(role, email, hash, full_name, program || null, year_level);
  const token = jwt.sign({ id: info.lastInsertRowid, email, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = userByEmail.get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Courses
app.get('/api/courses', auth, (req, res) => {
  const courses = db.prepare('SELECT * FROM courses').all();
  res.json(courses);
});

app.post('/api/courses', auth, (req, res) => {
  if (req.user.role === 'student') return res.status(403).json({ error: 'Forbidden' });
  const { code, title, description } = req.body;
  const info = db.prepare('INSERT INTO courses (code,title,description,teacher_id) VALUES (?,?,?,?)')
    .run(code, title, description || null, req.user.id);
  res.json({ id: info.lastInsertRowid });
});

// Announcements
app.get('/api/announcements', auth, (req, res) => {
  const rows = db.prepare('SELECT a.*, u.full_name as author FROM announcements a JOIN users u ON a.author_id=u.id ORDER BY a.created_at DESC').all();
  res.json(rows);
});

app.post('/api/announcements', auth, (req, res) => {
  const { course_id, content } = req.body;
  const info = db.prepare('INSERT INTO announcements (course_id, author_id, content) VALUES (?,?,?)')
    .run(course_id || null, req.user.id, content);
  res.json({ id: info.lastInsertRowid });
});

// Assignments & Submissions
app.get('/api/assignments', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM assignments ORDER BY created_at DESC').all();
  res.json(rows);
});

app.post('/api/assignments', auth, (req, res) => {
  if (req.user.role === 'student') return res.status(403).json({ error: 'Forbidden' });
  const { course_id, title, instructions, due_at } = req.body;
  const info = db.prepare('INSERT INTO assignments (course_id,title,instructions,due_at) VALUES (?,?,?,?)')
    .run(course_id, title, instructions || null, due_at || null);
  res.json({ id: info.lastInsertRowid });
});

const upload = multer({ dest: path.join(__dirname, 'uploads') });
app.post('/api/submissions/:assignmentId', auth, upload.single('file'), (req, res) => {
  const { assignmentId } = req.params;
  const note = req.body.note || null;
  const file_path = req.file ? `/uploads/${req.file.filename}` : null;
  const info = db.prepare('INSERT INTO submissions (assignment_id, student_id, file_path, note) VALUES (?,?,?,?)')
    .run(assignmentId, req.user.id, file_path, note);
  res.json({ id: info.lastInsertRowid, file_path });
});

// Simple grading
app.post('/api/submissions/:id/grade', auth, (req, res) => {
  if (req.user.role === 'student') return res.status(403).json({ error: 'Forbidden' });
  const { id } = req.params; const { grade, feedback } = req.body;
  db.prepare('UPDATE submissions SET grade=?, feedback=? WHERE id=?').run(grade || null, feedback || null, id);
  res.json({ ok: true });
});

// Chat history & realtime
app.get('/api/chat/:room', auth, (req, res) => {
  const { room } = req.params;
  const rows = db.prepare('SELECT m.*, u.full_name as author FROM messages m JOIN users u ON m.author_id=u.id WHERE room=? ORDER BY created_at ASC').all(room);
  res.json(rows);
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token'));
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user; next();
  } catch { next(new Error('Auth failed')); }
});

io.on('connection', (socket) => {
  socket.on('join', (room) => socket.join(room));
  socket.on('message', ({ room, body }) => {
    const info = db.prepare('INSERT INTO messages (room, author_id, body) VALUES (?,?,?)')
      .run(room, socket.user.id, body);
    const msg = { id: info.lastInsertRowid, room, author_id: socket.user.id, body, created_at: new Date().toISOString() };
    io.to(room).emit('message', msg);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log('Server running on :' + port));
