  // Verileri çekmek için Axios kullanımı
  function fetchData() {
    axios.get('https://northwind.vercel.app/api/products')
        .then(function (response) {
            // Verileri alındıktan sonra tabloyu temizle
            const tableBody = document.querySelector('#productTable tbody');
            tableBody.innerHTML = ''; // Tabloyu temizle

            // Yeni verileri tabloya ekleyin
            const data = response.data;
            data.forEach(function (product) {
                const row = tableBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                const cell5 = row.insertCell(4);
                cell1.textContent = product.id || "-";
                cell2.textContent = product.name || "-";
                cell3.textContent = product.unitPrice || "0";
                cell4.textContent = product.unitsInStock || "0"; 

                // Delete 
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', async () => {
                    try {
                        await axios.delete(`https://northwind.now.sh/api/products/${product.id}`);
                        alert(`Product with ID ${product.id} deleted successfully.`);
                        productTable.deleteRow(row.rowIndex);
                    } catch (error) {
                        console.error('Error deleting product:', error);
                    }
                   
                });

                cell5.appendChild(deleteButton);
            });
        })
        .catch(function (error) {
            console.error('Veri çekme hatası:', error);
        });
}


const fetchButton = document.querySelector('#fetch-button');
fetchButton.addEventListener('click', fetchData);



// Fiyat aralığına göre filtreleme 
function filterByPrice(price) {
    const tableBody = document.querySelector('#productTable tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach((row) => {
        const unitPrice = parseFloat(row.cells[2].textContent);
        if (price === 'All' || unitPrice <= price) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}



// Fiyat filtresi değiştikçe filtreleme
const priceFilter = document.querySelector('#priceFilter');
priceFilter.addEventListener('change', () => {
    const selectedPrice = parseFloat(priceFilter.value);
    filterByPrice(selectedPrice);
});



// Sıralama 
function sortData(direction) {
    const tableBody = document.querySelector('#productTable tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const priceA = parseFloat(a.cells[2].textContent);
        const priceB = parseFloat(b.cells[2].textContent);

        if (direction === 'asc') {
            return priceA - priceB;
        } else {
            return priceB - priceA;
        }
    });

    tableBody.innerHTML = '';
    rows.forEach((row) => {
        tableBody.appendChild(row);
    });
}



// Sıralama buttonu
const sortButton = document.querySelector('#sort-button');
sortButton.addEventListener('click', () => {
    const sortSelect = document.querySelector('#sort-select');
    const selectedOption = sortSelect.options[sortSelect.selectedIndex].value;
    sortData(selectedOption);
});