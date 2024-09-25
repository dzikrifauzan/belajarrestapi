const itemsList = document.getElementById('item-list'); // Pastikan ID sesuai dengan HTML
const toggleButton = document.getElementById('toggle-items');

// Fetch all items
async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/api/items'); // Update URL ke API
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const items = await response.json();
        const itemList = document.getElementById('item-list');

        itemList.innerHTML = ''; // Kosongkan tabel sebelum menambah item baru
        let index = 1;
        items.forEach(item => {
            const row = document.createElement('tr');

            const indexCell = document.createElement('td');
            indexCell.textContent = `${index++}.`;
            row.appendChild(indexCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const phoneCell = document.createElement('td');
            phoneCell.textContent = item.noTelepon;
            row.appendChild(phoneCell);

            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'hapus';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteItem(item.id);
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            itemList.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching items:', error);
        alert('Error fetching items. Please try again later.');
    }
}

// Delete all items
async function deleteAllItems() {
    if (confirm('Are you sure you want to delete all items?')) { // Konfirmasi sebelum menghapus
        try {
            const response = await fetch(`http://localhost:3000/api/all`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('All items have been deleted and IDs reset.');
                itemsList.innerHTML = ''; // Clear the list
            } else {
                const errorData = await response.json();
                alert('Error: ' + errorData.error);
            }
        } catch (error) {
            console.error('Error deleting items:', error);
            alert('Error deleting items. Please try again later.');
        }

        const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteItem(item.id); // Menghubungkan tombol ke fungsi delete

            li.appendChild(deleteButton); // Append button ke li
            itemsList.appendChild(li); // Append li ke itemsList
        };
    }


// Add new item
async function addItem(event) {
    event.preventDefault(); // Prevent form submission
    const name = document.getElementById('name').value.trim();
    const noTelepon = document.getElementById('noTelepon').value.trim();

    // Input validation
    // if (!name || !noTelepon) {
    //     alert('Please fill in both fields.');
    //     return;
    // }

    // Validasi nomor telepon: hanya angka
    const phoneRegex = /^[0-9]+$/; // Regex untuk memeriksa hanya angka
    if (!phoneRegex.test(noTelepon)) {
        alert('Nomor telepon harus berupa angka saja.'); // Pesan jika input tidak valid
        return; 
    }
    console.log('Adding item:', { name, noTelepon }); // Logging untuk debugging

    try {
        const response = await fetch('http://localhost:3000/api', { // Update URL to match the API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, noTelepon }),
        });

        console.log('Response status:', response.status); // Log status response

        if (response.ok) {
            alert('Item added successfully!');
            document.getElementById('item-form').reset(); // Clear the form
            fetchItems(); // Refresh the item list
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.error);
        }
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Error adding item. Please try again later.');
    }
}


// Hapus item berdasarkan ID
async function deleteItem(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchItems(); // Refresh the item list after deletion
            } else {
                const errorData = await response.json();
                alert('Error: ' + errorData.error);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item. Please try again later.');
        }
    }

// Fungsi untuk menyembunyikan item
async function toggleItems() {
    // Jika item belum ditampilkan, ambil dan tampilkan data
    if (itemsList.style.display === "none" || itemsList.innerHTML === '') {
        // Ambil data item
        await fetchItems(); 

        // Tampilkan item
        itemsList.style.display = ""; 
        toggleButton.textContent = "Sembunyikan Item"; // Ubah teks tombol ke "Sembunyikan"
    } else {
        // Sembunyikan item
        itemsList.style.display = "none";
        toggleButton.textContent = "Lihat semua data"; // Ubah teks tombol ke "Lihat semua data"
    }
}

// Event Listeners
document.getElementById('delete-items').addEventListener('click', deleteAllItems);
document.getElementById('item-form').addEventListener('submit', addItem);
toggleButton.addEventListener('click', toggleItems);