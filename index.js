const express = require('express');
const db = require('./db.js');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.use(express.json());


// TAMBAHAN DATA
app.post('/api/tambah', async (req, res) => {
    try {
        const { name, noTelepon } = req.body;  

        // mastiin kolomnya ada dalam tabel
        const query = 'INSERT INTO items (name, noTelepon) VALUES (?, ?)';
        const values = [name, noTelepon];
        // Query memasukkan data ke database
        const [result] = await db.query(query, values);

        // Send respon data yang baru dimasukan
        const newItem = { id: result.insertId, name, noTelepon };
        res.status(201).json(newItem); 

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// PENGAMBILAN DATA
app.get('/api/ambil/alldata', async (req, res) => {
    try {
        // Query untuk mengambil data dari database
        const [rows] = await db.query('SELECT * FROM items');

        // Mengirimkan respons berupa data yang diambil
        res.status(200).json(rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//belum ada di frontend
app.get('/api/ambil/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const query = 'SELECT * FROM items WHERE id = ?'; // Query untuk mengambil item berdasarkan ID
        const [rows] = await db.query(query, [id]); // Menjalankan query dengan id sebagai parameter

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' }); 
        }
        res.status(200).json(rows[0]); 
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
});

// MENGHAPUS DATA

app.delete('/api/hapus/alldata', async (req, res) => {
    try {
        await db.query('TRUNCATE TABLE items');
        res.status(204).send(); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//belum ada di frontend
app.delete('/api/hapus/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const query = `DELETE FROM items WHERE id = ${id}`; // Query untuk menghapus item berdasarkan ID
        const [result] = await db.query(query, [id]); // Menjalankan query dengan id sebagai parameter

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found' }); 
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
});





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



