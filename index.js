const express = require('express');
const db = require('./db.js');  // Import file db.js
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.post('/api', async (req, res) => {
    try {
        const { name, noTelepon } = req.body;  // Mengambil data dari request body

        // Pastikan kolom yang Anda masukkan benar-benar ada di tabel
        const query = 'INSERT INTO items (name, noTelepon) VALUES (?, ?)';
        const values = [name, noTelepon]; // Menggabungkan semua parameter dalam satu array

        // Query untuk memasukkan data ke database
        const [result] = await db.query(query, values);

        // Mengirimkan respons berupa data yang baru dimasukkan
        const newItem = { id: result.insertId, name, noTelepon };
        res.status(201).json(newItem);  // Status 201 menandakan data berhasil dibuat

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/items', async (req, res) => {
    try {
        // Query untuk mengambil data dari database
        const [rows] = await db.query('SELECT * FROM items');

        // Mengirimkan respons berupa data yang diambil
        res.status(200).json(rows);  // Status 200 menandakan data berhasil diambil

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete('/api/all', async (req, res) => {
    try {
        await db.query('TRUNCATE TABLE items');
 // Hapus semua item
        res.status(204).send(); // Status 204 No Content
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/:id', async (req, res) => {
    try {
        const { id } = req.params; // Mengambil id dari parameter URL
        const query = `DELETE FROM items WHERE id = ${id}`; // Query untuk menghapus item berdasarkan ID
        const [result] = await db.query(query, [id]); // Menjalankan query dengan id sebagai parameter

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found' }); // Jika tidak ada item yang dihapus
        }
        res.status(204).send(); // Jika berhasil dihapus, kirimkan status 204 No Content
    } catch (err) {
        res.status(500).json({ error: err.message }); // Jika terjadi kesalahan
    }
});





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



