# Arsitektur

Dokumen ini menjelaskan pembagian tanggung jawab utama di Account Manager.

## Prinsip

`+page.svelte` dibuat sebagai controller tipis. File ini boleh tahu state utama aplikasi, data turunan, dan event penting seperti export Markdown. Detail tampilan dipindahkan ke komponen yang lebih kecil.

Dengan pola ini, perubahan UI tidak membuat `+page.svelte` jadi file raksasa, dan komponen seperti list, card, badge, serta panel detail bisa dirawat sendiri-sendiri.

Sidebar memakai `selectedMenu` untuk mengganti view internal aplikasi. Menu yang tersedia saat ini adalah Dashboard, Email Induk, Akun Game, dan Sosmed.

## Alur Data

```txt
+page.svelte
├── accounts, emails
├── selectedMenu
├── search
├── selectedCategory
├── selectedEmail
├── selectedAccountId
├── selectedAccount
├── selectedEmailItem
├── filteredAccounts
└── exportMarkdown()
```

`selectedMenu` juga memengaruhi `filteredAccounts`. Saat menu Akun Game aktif, daftar akun dipaksa ke kategori `game`. Saat menu Sosmed aktif, daftar akun dipaksa ke kategori `sosmed`.

State utama diteruskan ke:

```txt
app-shell
├── Sidebar
└── DashboardContent
    ├── Topbar
    ├── StatGrid
    ├── Toolbar
    ├── AccountList
    ├── EmailList
    ├── EmailSummary
    └── DetailPanel
```

Data awal diambil dari `src/lib/data/mock.ts` melalui service:

```txt
mock data → service → local state di +page.svelte → komponen UI
```

Service yang tersedia:

- `account-service.ts`: mengambil, membuat, mengubah, menghapus, dan memfilter akun berdasarkan email.
- `email-service.ts`: mengambil, membuat, mengubah, menghapus, dan menghitung jumlah akun per email.
- `export-service.ts`: mengubah data akun menjadi Markdown.

Komponen child yang perlu mengubah state memakai bindable props Svelte 5, contohnya:

```svelte
<Toolbar {emails} bind:search bind:selectedCategory bind:selectedEmail />
<AccountList {emails} {accounts} bind:selectedAccountId />
```

## Tanggung Jawab File

| Area                             | Tanggung jawab                                        |
| -------------------------------- | ----------------------------------------------------- |
| `src/routes/+page.svelte`        | Controller state utama dan derived data.              |
| `src/lib/components/layout/`     | Layout besar aplikasi.                                |
| `src/lib/components/navigation/` | Brand, grup navigasi, dan item navigasi.              |
| `src/lib/components/dashboard/`  | Topbar dan statistik dashboard.                       |
| `src/lib/components/account/`    | List akun, card akun, detail akun, dan row informasi. |
| `src/lib/components/email/`      | List email dan card email.                            |
| `src/lib/components/ui/`         | Komponen UI kecil yang reusable.                      |
| `src/lib/data/`                  | Sumber data sementara.                                |
| `src/lib/services/`              | Operasi data lokal sebelum nanti diganti backend/API. |
| `src/lib/types/`                 | TypeScript type untuk domain akun.                    |
| `src/lib/utils/`                 | Helper domain akun.                                   |

## Svelte 5 Runes

Project memakai runes mode. Gunakan:

- `$state` untuk state mutable.
- `$derived` untuk nilai turunan sederhana.
- `$derived.by` untuk nilai turunan yang butuh block logic.
- `$bindable` untuk prop yang bisa di-bind dari parent.

Hindari reactive statement legacy `$:` karena tidak dipakai di runes mode.

## Export Markdown

`exportMarkdown()` berada di `+page.svelte` karena fungsi ini bergantung pada `selectedAccount` dan `selectedEmailItem`. Saat ini output masih dikirim ke `console.log`. Nanti fungsi ini bisa dikembangkan menjadi:

- download file `.md`;
- copy ke clipboard;
- export batch semua akun;
- integrasi folder Obsidian lokal.
