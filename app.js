const cars = [
    { name: "Toyota Avanza", price: 500000},
    { name: "Toyota Kijang Innova", price: 700000},
    { name: "Honda HRV", price: 600000},
    { name: "Daihatsu Sigra", price: 450000} 
]
const bookings = JSON.parse(localStorage.getItem("bookings")) || []; 

function calculateTotal() {
    const summDiv = document.getElementById("booking-summ");
    summDiv.innerHTML = "";
    let summary = "";
    let total = 0;
    document.querySelectorAll(".car-check").forEach((checkbox, index) => {
        if (checkbox.checked) {
            const duration = parseInt(document.querySelector(`.duration[data-id = '${index}']`).value);
            const price = cars[index].price;
            let subtotal = duration * price;
            total += subtotal;
            console.log(total);
            summary += `<div class = "summ-item">${cars[index].name} : ${duration} x ${price.toLocaleString()} = Rp. ${subtotal.toLocaleString()}<div/>`
        }

    })
    summary += `<div>Total harga = Rp. ${total.toLocaleString()}<div/>`
    summDiv.innerHTML = summary;
}

function saveBooking() {
    const name = document.getElementById("customer-name").value;
    const timeStamp = new Date().toLocaleString();
    const allCheck = [...document.querySelectorAll(".car-check")].some(cb => cb.checked);
    let isValid = true;
    let totalOrder = 0;
    let order = {
        name, timeStamp, items: [], totalOrder
    };
    if (name.trim() === "") {
        alert("nama pelanggan tidak boleh kosong!");
        isValid = false;
        return;
    }
    if (!allCheck) {
        alert("Pilih minimal 1 mobil!");
        isValid = false;
        return;
    }
    
    document.querySelectorAll(".car-check").forEach((checkbox, index) => {
        if (checkbox.checked) {
            let startDateInput = document.querySelector(`.date[data-id = '${index}'] `).value.trim();
                if (startDateInput.toLocaleString() === "") {
                    alert("Tanggal wajib diisi");
                    isValid = false;
                }
            const duration = parseInt(document.querySelector(`.duration[data-id = '${index}']`).value);
            if (isNaN(duration)||duration<= 0 ) {
                alert("durasi harus lebih dari 0 hari!");
                isValid = false;
                return;
            }
            const price = cars[index].price;
            let subtotal = duration * price;

            totalOrder += subtotal;
            startDateInput = document.querySelector(`.date[data-id = '${index}']`).value;
            const startDate = startDateInput.toLocaleString();

            order.items.push({
                car: cars[index].name,
                duration,
                startDate
            })
            order.totalOrder = totalOrder;
            console.log(order);
        }
    })
    if (isValid) {
        bookings.push(order);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        console.log(localStorage);
        console.log(bookings);
        viewOrder();
    }
}
function viewOrder(){
    const viewList = document.getElementById("viewBooking");
    viewList.innerHTML = "";
    bookings.forEach((items, index) => {
        const orderCard = document.createElement("div");
        const nama = document.createElement("h3");
        const timeStamp = document.createElement("h3");
        const total = document.createElement("h4");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Hapus";
        deleteBtn.onclick = () =>{
            bookings.splice(index, 1);
            alert("order pemesanan berhasil dihapus!")
            console.log(bookings);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            viewOrder();
        }
        orderCard.classList.add("card-order");

        nama.textContent = `Nama: ${items.name}`;
        timeStamp.textContent = `Waktu: ${items.timeStamp}`;
        total.textContent = `Total: ${items.totalOrder}`;

        orderCard.append(nama, timeStamp, total, deleteBtn);
        viewList.appendChild(orderCard);
    });
}

