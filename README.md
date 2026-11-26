# Delcom Blog — Frontend

Frontend React/Vite untuk Delcom Blog. Backend berada di repository `ifs24014-pabwe2026-sk-p9-be-golang-gin` dan menyediakan REST API pada port `8081`.

## Struktur kode

- `src/App.jsx`: sinkronisasi rute SPA, sesi pengguna, dan pemilihan halaman.
- `src/components/`: komponen UI bersama seperti header, brand, modal, dan kartu statistik.
- `src/features/<fitur>/api/`: permintaan backend yang khusus untuk fitur `blog`, `auth`, `author`, atau `admin`.
- `src/features/<fitur>/components/`: komponen UI khusus fitur, seperti kartu artikel, viewer/editor Markdown, halaman autentikasi, dan dashboard.
- `src/features/<fitur>/`: halaman dan alur tiap fitur; halaman tetap mengorkestrasi API dan komponennya.
- `src/helpers/`: helper API dan pemrosesan data blog.
- `src/hooks/`: hook reusable seperti tema dan navigasi browser.

## Menjalankan lokal

1. Pastikan PostgreSQL dan backend aktif. Dari folder backend, jalankan:

   ```powershell
   go run cmd/server/main.go
   ```

   Backend harus dapat diakses di `http://localhost:8081`.

2. Dari folder frontend, salin konfigurasi contoh dan jalankan Vite:

   ```powershell
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```

   Buka `http://localhost:5174`. Jika `VITE_API_URL` kosong, Vite meneruskan request `/api` ke backend lokal pada port `8081`.

3. Cek koneksi API atau buka dokumentasi backend:

   - `http://localhost:5174/api/public/categories`
   - `http://localhost:8081/swagger/index.html`

## Menghubungkan saat deployment

Atur environment variable **pada hosting frontend sebelum build**:

```env
VITE_API_URL=https://alamat-backend-anda
```

Isi dengan base URL backend tanpa akhiran `/api` dan tanpa slash terakhir. Frontend akan memanggil endpoint seperti `https://alamat-backend-anda/api/public/posts`. Setelah menambahkan atau mengubah environment variable, jalankan deployment ulang.

Backend harus tersedia melalui HTTPS dan mengizinkan origin domain frontend melalui CORS. Hosting frontend juga perlu mengarahkan rute SPA (contohnya `/posts/*`, `/author`, `/admin`, `/login`, dan `/register`) kembali ke `index.html` agar halaman bisa dibuka langsung atau di-refresh.

Jangan commit `.env` atau memasukkan secret backend ke variable `VITE_*`; nilai tersebut dapat dibaca dari browser. `.env.example` aman untuk dibagikan dan `.env` sudah diabaikan Git.

## Build produksi

```powershell
npm run build
npm run preview
```

Hasil build berada di `dist/`.
