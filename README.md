# Account Manager

Account Manager adalah dashboard lokal untuk mencatat akun, email induk, status 2FA, lokasi password, dan catatan audit ringan. Aplikasi ini sengaja tidak menyimpan password asli. Yang dicatat hanya lokasi password, misalnya Bitwarden atau Google Password Manager.

Project ini dibuat dengan SvelteKit, Svelte 5 runes, TypeScript, Vite, ESLint, dan Prettier.

## Fitur

- Dashboard ringkasan total email, total akun, akun dengan 2FA aktif, dan akun yang perlu audit.
- Filter akun berdasarkan keyword, kategori, dan email induk.
- Relasi akun ke email induk.
- Panel detail akun berisi platform, username, metode login, email, lokasi password, 2FA, tag, dan catatan.
- Export akun terpilih ke format Markdown untuk Obsidian atau catatan lokal.
- Struktur komponen modular supaya gampang dikembangkan.

## Quick Start

Install dependency:

```sh
npm install
```

Jalankan development server:

```sh
npm run dev
```

Build production:

```sh
npm run build
```

Preview hasil build:

```sh
npm run preview
```

## Script

| Command           | Fungsi                                               |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Menjalankan Vite dev server.                         |
| `npm run build`   | Membuat build production.                            |
| `npm run preview` | Preview build production.                            |
| `npm run check`   | Menjalankan `svelte-check` dengan TypeScript config. |
| `npm run lint`    | Cek formatting Prettier dan lint ESLint.             |
| `npm run format`  | Format semua file dengan Prettier.                   |

## Struktur Project

```txt
src/lib/
├── components/
│   ├── account/
│   ├── dashboard/
│   ├── email/
│   ├── layout/
│   ├── navigation/
│   └── ui/
├── data/
├── types/
└── utils/
```

File penting:

- `src/routes/+page.svelte`: controller utama untuk state, derived data, dan export Markdown.
- `src/lib/components/layout/DashboardContent.svelte`: layout konten dashboard.
- `src/lib/components/layout/Sidebar.svelte`: sidebar navigasi dan tools.
- `src/lib/data/mock.ts`: data sementara akun dan email.
- `src/lib/types/account.ts`: tipe data akun dan email.
- `src/lib/utils/account.ts`: helper label dan ikon akun.

## Dokumentasi Lanjutan

- [Arsitektur](docs/architecture.md)
- [Komponen](docs/components.md)
- [Data Model](docs/data-model.md)

## Catatan Keamanan

Aplikasi ini untuk tracking lokal. Jangan simpan password asli, recovery code, token API, private key, atau data sensitif mentah di data mock maupun catatan akun. Simpan rahasia di password manager, lalu tulis lokasinya saja di `passwordLocation`.

## Status

Saat ini data masih memakai mock statis di `src/lib/data/mock.ts`. Langkah pengembangan berikutnya bisa diarahkan ke storage lokal, import/export JSON, atau integrasi database lokal.
