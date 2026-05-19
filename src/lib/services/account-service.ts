import { accounts as mockAccounts } from '$lib/data/mock';
import type { AccountItem } from '$lib/types/account';

export type AccountFormData = Omit<AccountItem, 'id'>;

export function getAccounts() {
	return mockAccounts.map((account) => ({
		...account,
		tags: [...account.tags]
	}));
}

export function createAccount(accounts: AccountItem[], data: AccountFormData) {
	const nextId = Math.max(0, ...accounts.map((account) => account.id)) + 1;

	return [...accounts, { id: nextId, ...normalizeAccount(data) }];
}

export function updateAccount(accounts: AccountItem[], id: number, data: AccountFormData) {
	return accounts.map((account) =>
		account.id === id ? { id, ...normalizeAccount(data) } : account
	);
}

export function deleteAccount(accounts: AccountItem[], id: number) {
	return accounts.filter((account) => account.id !== id);
}

export function getAccountsByEmail(accounts: AccountItem[], emailId: number) {
	return accounts.filter((account) => account.linkedEmailId === emailId);
}

function normalizeAccount(data: AccountFormData): AccountFormData {
	return {
		...data,
		name: data.name.trim(),
		platform: data.platform.trim(),
		username: data.username.trim(),
		userId: data.userId?.trim() || undefined,
		loginMethod: data.loginMethod.trim(),
		passwordLocation: data.passwordLocation.trim(),
		tags: data.tags.map((tag) => tag.trim()).filter(Boolean),
		notes: data.notes.trim()
	};
}
