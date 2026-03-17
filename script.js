function updateClock() {
    // Fungsi untuk memperbarui jam setiap detik
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const clockElement = document.querySelector('#clock span');
    if (clockElement) {
        clockElement.innerText = now.toLocaleDateString('id-ID', options);
    }
}

setInterval(updateClock, 1000);
updateClock();

function searchData() {
    // Mengambil nilai No. Reg dari input
    const searchInput = document.getElementById('searchReg').value.trim();
    const resultArea = document.getElementById('resultArea');
    const loading = document.getElementById('loading');

    if (!searchInput) {
        alert("Harap masukkan Nomor Registrasi Anak Binaan!");
        return;
    }

    // Tampilkan loading dan sembunyikan hasil sebelumnya
    loading.classList.remove('hidden');
    resultArea.classList.add('hidden');

    // URL Web App Google Apps Script Anda
    const scriptUrl = "https://script.google.com/macros/s/AKfycbyNh2Jl_Bf-V_pEIMHFDQvXP21rTpVsBLPe7gbPW1aaX4Krt0hLjdUfwKJ2DvmrcAeH/exec";

    // Melakukan fetch data ke server
    fetch(`${scriptUrl}?no_reg=${encodeURIComponent(searchInput)}`, {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow' 
    })
    .then(response => response.json())
    .then(data => {
        loading.classList.add('hidden');
        
        if (data.status === "success") {
            // Isi data ke elemen HTML
            document.getElementById('resNoReg').innerText = data.no_reg || "-";
            document.getElementById('resNama').innerText = data.nama || "-";
            
            // Logika untuk menampilkan link dokumen
            const linkElement = document.getElementById('resLink');
            if (data.link && data.link !== "#") {
                linkElement.href = data.link;
                linkElement.style.display = "inline-flex";
            } else {
                linkElement.style.display = "none";
            }
            
            resultArea.classList.remove('hidden');
        } else if (data.status === "not_found") {
            alert(`Data No. Reg "${searchInput}" tidak ditemukan. Pastikan nomor yang dimasukkan benar.`);
        } else {
            alert("Terjadi kesalahan: " + data.message);
        }
    })
    .catch(error => {
        loading.classList.add('hidden');
        alert("Gagal terhubung ke database. Periksa koneksi internet Anda.");
        console.error("Error:", error);
    });
}

function refreshPage() {
    setTimeout(() => {
        location.reload();
    }, 200);
}

// Menjalankan pencarian saat menekan tombol Enter
document.getElementById('searchReg').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchData();
    }
});