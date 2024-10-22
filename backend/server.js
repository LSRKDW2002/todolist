const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Inisialisasi Aplikasi
const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi Koneksi Database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist', // Ganti sesuai nama database
});

// Cek Koneksi ke Database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Endpoint GET untuk mengambil semua tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// Endpoint POST untuk menambah task baru
app.post('/tasks', (req, res) => {
  const { name, category } = req.body;
  const query = 'INSERT INTO tasks (name, category, date, edit, is_deleted) VALUES (?, ?, NOW(), ?, ?)';
  db.query(query, [name, category, false, false], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Task added successfully', taskId: result.insertId });
  });
});

// Endpoint PUT untuk mengupdate task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const query = 'UPDATE tasks SET name = ?, category = ?, edit = true WHERE id = ?';

  db.query(query, [name, category, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Task updated successfully' });
  });
});

// Endpoint DELETE untuk menghapus task secara permanen
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).send(err);
    }
    console.log('Task deleted with id:', id);
    res.json({ message: 'Task deleted successfully' });
  });
});

// Jalankan Server
app.listen(5000, () => {
  console.log('Server berjalan di port 5000');
});
