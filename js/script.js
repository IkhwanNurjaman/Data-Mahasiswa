let data = JSON.parse(localStorage.getItem("mahasiswa") || "[]");
let hasil = null;

// Tampilkan tabel & dashboard
function render() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  data.forEach(m => {
    const tr = document.createElement("tr");
    if (hasil === m.nim) tr.classList.add("highlight");
    tr.innerHTML = `
      <td>${m.nim}</td>
      <td>${m.nama}</td>
      <td>${m.jurusan}</td>
      <td>
        <button onclick="editMahasiswa('${m.nim}')">Edit</button>
        <button onclick="hapusMahasiswa('${m.nim}')">Hapus</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
  updateDashboard();
}

// Tambah Mahasiswa
function tambahMahasiswa() {
  const nim = document.getElementById("nim").value.trim();
  const nama = document.getElementById("nama").value.trim();
  const jurusan = document.getElementById("jurusan").value.trim();
  const pesan = document.getElementById("pesan");

  if (!/^\d{8,12}$/.test(nim)) {
    pesan.textContent = "NIM harus 8–12 digit";
    return;
  }

  data.push({nim, nama, jurusan});
  localStorage.setItem("mahasiswa", JSON.stringify(data));
  pesan.textContent = "";
  render();
}

// Edit Mahasiswa
function editMahasiswa(nim) {
  const mhs = data.find(m => m.nim === nim);
  const newNama = prompt("Nama:", mhs.nama);
  const newJurusan = prompt("Jurusan:", mhs.jurusan);
  if (newNama && newJurusan) {
    mhs.nama = newNama;
    mhs.jurusan = newJurusan;
    localStorage.setItem("mahasiswa", JSON.stringify(data));
    render();
  }
}

// Hapus Mahasiswa
function hapusMahasiswa(nim) {
  data = data.filter(m => m.nim !== nim);
  localStorage.setItem("mahasiswa", JSON.stringify(data));
  render();
}

// Pencarian
function cariMahasiswa() {
  const nimCari = document.getElementById("cariNim").value.trim();
  hasil = data.find(m => m.nim === nimCari)?.nim || null;
  if (!hasil) document.getElementById("pesan").textContent = "Data tidak ditemukan";
  else document.getElementById("pesan").textContent = "";
  render();
}

// Sorting
function urutkan() {
  const method = document.getElementById("sortMethod").value;
  if (method === "insertion") insertionSort(data);
  else data = mergeSort(data);
  localStorage.setItem("mahasiswa", JSON.stringify(data));
  render();
}

// Insertion Sort
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && key.nim < arr[j].nim) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}

// Merge Sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length/2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result=[], i=0, j=0;
  while(i<left.length && j<right.length) {
    if(left[i].nim < right[j].nim) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// Dashboard
function updateDashboard() {
  document.getElementById("totalMahasiswa").querySelector("h2").textContent = data.length;
  const jurusanList = data.map(m=>m.jurusan);
  document.getElementById("totalJurusan").querySelector("h2").textContent = [...new Set(jurusanList)].length;
  if(jurusanList.length>0) {
    const counts = {};
    jurusanList.forEach(j => counts[j]=(counts[j]||0)+1);
    const maxJurusan = Object.keys(counts).reduce((a,b)=>counts[a]>counts[b]?a:b);
    document.getElementById("jurusanTerbanyak").querySelector("h2").textContent = maxJurusan;
  } else document.getElementById("jurusanTerbanyak").querySelector("h2").textContent = "-";
}

// Export CSV
function exportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,NIM,Nama,Jurusan\n";
  data.forEach(m => { csvContent += `${m.nim},${m.nama},${m.jurusan}\n`; });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "mahasiswa.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export Excel (xlsx)
function exportExcel() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Mahasiswa");
  XLSX.writeFile(wb, "mahasiswa.xlsx");
}

// Inisialisasi
render();
