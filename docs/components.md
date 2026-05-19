# Komponen

Dokumen ini berisi peta komponen dan tanggung jawabnya.

## Layout

### `layout/Sidebar.svelte`

Sidebar utama aplikasi. Menggabungkan:

- `navigation/Brand.svelte`
- `navigation/NavGroup.svelte`

Props penting:

- `selectedMenu`
- `totalAccounts`
- `totalEmails`
- `gameCount`
- `socialCount`
- `onExport`

### `layout/DashboardContent.svelte`

Pembungkus konten dashboard. Komponen ini menjaga `+page.svelte` tetap tipis dengan mengatur susunan:

- `Topbar`
- `StatGrid`
- `Toolbar`
- `AccountList`
- `EmailList`
- `EmailSummary`
- `DetailPanel`

Komponen ini juga menentukan view berdasarkan `selectedMenu`. Dashboard menampilkan statistik, toolbar, daftar akun, daftar email, dan detail akun. Email Induk menampilkan daftar email dan ringkasan email. Akun Game dan Sosmed menampilkan daftar akun yang sudah difilter kategori.

## Navigation

### `navigation/Brand.svelte`

Logo kecil dan nama aplikasi.

### `navigation/NavGroup.svelte`

Render satu grup navigasi berdasarkan array item.

### `navigation/NavItem.svelte`

Button navigasi tunggal. Mendukung state `active`, label, counter, dan callback `onSelect`.

## Dashboard

### `dashboard/Topbar.svelte`

Header dashboard dan action utama seperti export.

### `dashboard/StatGrid.svelte`

Grid ringkasan statistik. Komponen ini tidak merender markup card sendiri, tapi meneruskan data ke `StatCard`.

### `dashboard/StatCard.svelte`

Card statistik kecil dengan `label`, `value`, dan `note`.

## Account

### `account/AccountList.svelte`

Panel daftar akun. Bertugas render header list, empty state, dan kumpulan `AccountCard`.

### `account/AccountCard.svelte`

Card akun tunggal. Menampilkan nama akun, username, email terkait, dan badge status 2FA.

### `account/DetailPanel.svelte`

Panel detail akun terpilih. Menampilkan informasi akun, tag, catatan, dan tombol export.

### `account/InfoRow.svelte`

Row kecil untuk pasangan label dan value di detail akun.

## Email

### `email/EmailList.svelte`

Panel daftar email induk. Bertugas render kumpulan `EmailCard`.

### `email/EmailCard.svelte`

Card email tunggal. Menampilkan label email, jumlah akun, recovery, dan status audit.

### `email/EmailSummary.svelte`

Ringkasan detail semua email induk, termasuk provider, purpose, recovery, 2FA, jumlah akun, dan status audit.

## UI

### `ui/Toolbar.svelte`

Filter akun berdasarkan keyword, kategori, dan email induk. Props `search`, `selectedCategory`, dan `selectedEmail` dibuat bindable.

### `ui/StatusBadge.svelte`

Badge reusable untuk status sederhana.

Variant yang tersedia:

- `good`
- `warn`

## Aturan Penambahan Komponen

- Kalau komponen mulai punya loop besar, pecah item loop jadi komponen card sendiri.
- Kalau markup detail berulang, pecah jadi row kecil seperti `InfoRow`.
- Komponen di `ui/` sebaiknya tidak tahu domain terlalu banyak.
- Komponen domain seperti `AccountCard` boleh tahu type `AccountItem`.
- State utama tetap naik ke `+page.svelte` atau parent layout yang paling masuk akal.
