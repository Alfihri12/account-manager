import type { AccountItem, EmailItem } from '$lib/types/account';

export const emails: EmailItem[] = [
	{
		id: 1,
		label: 'Gmail Gaming',
		address: 'gaming@example.com',
		provider: 'Gmail',
		purpose: 'Gaming',
		twoFactor: true,
		accountCount: 6,
		recovery: 'Gmail Utama',
		status: 'safe'
	},
	{
		id: 2,
		label: 'Gmail Dev',
		address: 'dev@example.com',
		provider: 'Gmail',
		purpose: 'Development',
		twoFactor: true,
		accountCount: 4,
		recovery: 'Gmail Utama',
		status: 'safe'
	},
	{
		id: 3,
		label: 'Gmail Lama',
		address: 'old@example.com',
		provider: 'Gmail',
		purpose: 'Akun lama',
		twoFactor: false,
		accountCount: 2,
		recovery: 'Belum jelas',
		status: 'audit'
	}
];

export const accounts: AccountItem[] = [
	{
		id: 1,
		name: 'Steam',
		category: 'game',
		platform: 'Steam',
		username: 'kanari_xxx',
		userId: '-',
		loginMethod: 'Google',
		linkedEmailId: 1,
		passwordLocation: 'Bitwarden',
		twoFactor: true,
		status: 'active',
		tags: ['gaming', 'utama', 'pc'],
		notes: 'Akun utama untuk game PC. Password asli jangan disimpan di aplikasi ini.'
	},
	{
		id: 2,
		name: 'Discord Gaming',
		category: 'sosmed',
		platform: 'Discord',
		username: 'kanari.dev',
		loginMethod: 'Email Password',
		linkedEmailId: 1,
		passwordLocation: 'Google Password Manager',
		twoFactor: true,
		status: 'need_check',
		tags: ['gaming', 'chat'],
		notes: 'Cek recovery email dan nomor HP. Jangan males, ini akun sering kepakai.'
	},
	{
		id: 3,
		name: 'GitHub',
		category: 'dev',
		platform: 'GitHub',
		username: 'fahrifathullah2',
		loginMethod: 'Email Password',
		linkedEmailId: 2,
		passwordLocation: 'Bitwarden',
		twoFactor: true,
		status: 'active',
		tags: ['dev', 'utama'],
		notes: 'Akun development utama. Wajib 2FA aktif.'
	},
	{
		id: 4,
		name: 'Riot Games',
		category: 'game',
		platform: 'Riot',
		username: 'kanari',
		loginMethod: 'Email Password',
		linkedEmailId: 1,
		passwordLocation: 'Belum dicatat',
		twoFactor: false,
		status: 'need_check',
		tags: ['game', 'audit'],
		notes: 'Belum jelas status 2FA. Ini perlu dicek, jangan sok lupa.'
	}
];
