# Panduan: menjual undangan joglo ke banyak klien

## Isi repo
```
netlify.toml        pengaturan Netlify (jangan diubah)
build.js            membuat halaman tiap klien otomatis
template.html       desain undangan (di sini nanti Anda revisi joglo)
assets/             gambar bersama (joglo, bunga, langit, dll.)
alat/link-tamu.html pembuat link tamu massal
rsvp.gs             skrip Google Sheets untuk RSVP dan buku ucapan
klien/demo/         undangan contoh untuk portofolio
klien/<nama>/       satu folder per klien (config.json + folder foto)
```
Alamat hasilnya: `situsanda.netlify.app/<nama>/` (editor di `/studio/`, alat di `/alat/link-tamu.html`).

## 1. Pasang sekali (di komputer)
1. Ekstrak ZIP, buat repo GitHub baru, lalu seret SEMUA isi folder ke halaman repo (Add file, Upload files). Folder ikut terunggah jika memakai komputer.
2. Netlify: Add new project, Import from GitHub, pilih repo ini. Build command dan Publish directory terisi otomatis dari `netlify.toml`.
3. Netlify: Project configuration, Environment variables, tambah `EDITOR_PASSWORD` berisi kata sandi pilihan Anda, lalu deploy ulang. Sandi ini mengunci editor di `/studio/`. Ini pengaman ringan, bukan keamanan penuh.
4. Pastikan situs berstatus Public.

## 2. Menambah klien baru
1. Buka `situsanda.netlify.app/studio/?edit=1`, masukkan sandi.
2. Ubah teks, foto, tanggal, WhatsApp, musik, dan opsi lain.
3. Ketuk Editor, lalu Unduh config.json dan Unduh foto (file foto diunduh satu per satu).
4. Di GitHub buat folder `klien/nama-klien/` (huruf kecil, angka, tanda minus saja). Taruh `config.json` di dalamnya, dan foto di `klien/nama-klien/foto/`.
5. Tunggu deploy 1 sampai 2 menit. Link klien: `situsanda.netlify.app/nama-klien/`.
6. Di editor, ketuk Reset editor sebelum mulai klien berikutnya.

Mengubah undangan klien: unduh ulang config.json dari studio dan timpa file lama.
Musik klien: taruh `musik.mp3` di folder klien dan isi kolom File musik dengan `musik.mp3`.

## 3. RSVP dan buku ucapan (opsional, gratis)
1. Buat Google Sheet baru, lalu Extensions, Apps Script. Tempel isi `rsvp.gs`.
2. Deploy, New deployment, Web app. Execute as: Me. Who has access: Anyone. Salin URL yang berakhiran `/exec`.
3. Tempel URL itu di kolom Link Apps Script di editor, untuk semua klien. Satu Sheet melayani semua klien, kolom "klien" membedakannya.
4. Jika kolom itu kosong, RSVP dikirim lewat WhatsApp seperti biasa.
Hanya nama dan ucapan yang tampil publik. Data hadir dan jumlah hanya Anda yang melihat di Sheet.

## 4. Link tamu massal
Buka `/alat/link-tamu.html`, tempel link klien dan daftar nama, lalu kirim lewat tombol WhatsApp.

## 5. Sebelum dijual
- [ ] Uji di beberapa HP: Android lama, iPhone (Safari), sinyal lambat. Efek 3D dan paralaks paling sering bermasalah di HP murah.
- [ ] Cek lisensi gambar dan musik untuk pemakaian komersial.
- [ ] Siapkan formulir pesanan: harga, jumlah revisi, masa aktif link.
- [ ] Minta persetujuan klien untuk data pribadi (nama, alamat, rekening) dan hapus saat masa aktif habis.
- [ ] Domain sendiri per klien (.my.id atau .web.id) bila diminta, biayanya dibebankan ke klien.
- [ ] Cek batas gratis Netlify di situs resminya. Jika trafik besar, pindah ke Cloudflare Pages.
- [ ] Netlify wajib dipakai di domain utama (bukan subfolder), karena gambar dirujuk dari `/assets/`.

## 6. Revisi desain joglo nanti
Ganti gambar di `assets/` dengan nama yang sama, atau ubah `template.html`. Semua undangan klien ikut berubah setelah deploy. Cache gambar 1 jam, jadi tampilan baru bisa tertunda sebentar.
