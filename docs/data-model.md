# Data Model

Data domain utama ada di `src/lib/types/account.ts`.

## Category

```ts
export type Category = 'game' | 'sosmed' | 'dev' | 'freelance' | 'education' | 'other';
```

Kategori dipakai untuk filter akun dan ikon kategori.

## Status

```ts
export type Status = 'active' | 'need_check' | 'inactive' | 'lost';
```

Status dipakai untuk menandai kondisi akun.

## EmailItem

```ts
export type EmailItem = {
	id: number;
	label: string;
	address: string;
	provider: string;
	purpose: string;
	twoFactor: boolean;
	accountCount: number;
	recovery: string;
	status: 'safe' | 'audit';
	createdAt: string;
	updatedAt: string;
};
```

Catatan field:

- `id`: identifier email, dipakai untuk relasi dengan akun.
- `label`: nama tampilan email.
- `address`: alamat email.
- `provider`: penyedia email.
- `purpose`: fungsi utama email.
- `twoFactor`: status 2FA email.
- `accountCount`: jumlah akun yang terhubung.
- `recovery`: informasi recovery secara umum.
- `status`: status keamanan email.
- `createdAt`: waktu data dibuat dalam format ISO string.
- `updatedAt`: waktu data terakhir diperbarui dalam format ISO string.

## AccountItem

```ts
export type AccountItem = {
	id: number;
	name: string;
	category: Category;
	platform: string;
	username: string;
	userId?: string;
	loginMethod: string;
	linkedEmailId: number;
	passwordLocation: string;
	twoFactor: boolean;
	status: Status;
	tags: string[];
	notes: string;
	createdAt: string;
	updatedAt: string;
};
```

Catatan field:

- `id`: identifier akun.
- `name`: nama akun yang tampil di UI.
- `category`: kategori akun.
- `platform`: platform akun, misalnya Steam, Discord, GitHub.
- `username`: username atau handle login.
- `userId`: ID tambahan jika platform punya ID khusus.
- `loginMethod`: metode login, misalnya Google atau Email Password.
- `linkedEmailId`: relasi ke `EmailItem.id`.
- `passwordLocation`: lokasi password disimpan, bukan password asli.
- `twoFactor`: status 2FA akun.
- `status`: status kondisi akun.
- `tags`: tag untuk pengelompokan ringan.
- `notes`: catatan audit atau konteks tambahan.
- `createdAt`: waktu data dibuat dalam format ISO string.
- `updatedAt`: waktu data terakhir diperbarui dalam format ISO string.

## Input Types

Data dari form dan data tersimpan dipisahkan:

```ts
export type CreateEmailInput = Omit<EmailItem, 'id' | 'accountCount' | 'createdAt' | 'updatedAt'>;
export type UpdateEmailInput = Partial<CreateEmailInput>;

export type CreateAccountInput = Omit<AccountItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAccountInput = Partial<CreateAccountInput>;
```

`Create*Input` dipakai saat menambah data baru. `Update*Input` dipakai saat mengubah data lama. Repository yang bertanggung jawab menambahkan `id`, `createdAt`, dan `updatedAt`.

## Backup JSON

Backup memakai format:

```ts
type BackupData = {
	version: 1;
	exportedAt: string;
	emails: EmailItem[];
	accounts: AccountItem[];
};
```

Service backup ada di `src/lib/services/backup-service.ts`. File ini dipakai Settings untuk export dan import data sebelum app pindah ke SQLite.

## Data Mock

Data sementara ada di:

```txt
src/lib/data/mock.ts
```

Saat menambah akun baru, pastikan:

- `id` unik.
- `linkedEmailId` mengarah ke email yang ada.
- `passwordLocation` tidak berisi password asli.
- `status` sesuai union type.
- `category` sesuai union type.

## Helper

Helper domain ada di `src/lib/utils/account.ts`.

- `getCategoryIcon(category)`: mengembalikan ikon kategori.
- `getStatusLabel(status)`: mengembalikan label status untuk UI dan export Markdown.

Kalau menambah nilai baru di `Category` atau `Status`, update helper ini juga supaya TypeScript tetap puas dan UI tidak kosong.
