import {
	createAccountInTauri,
	deleteAccountInTauri,
	getAccountsFromTauri,
	updateAccountInTauri
} from '$lib/api/tauri';
import type { AccountItem, CreateAccountInput, UpdateAccountInput } from '$lib/types/account';

export function getAccountsSnapshot() {
	return [];
}

export async function getAccounts() {
	return getAccountsFromTauri();
}

export async function createAccount(input: CreateAccountInput) {
	return createAccountInTauri(normalizeAccount(input));
}

export async function updateAccount(id: number, input: UpdateAccountInput) {
	const existing = await getAccountById(id);
	const nextInput: CreateAccountInput = normalizeAccount({
		name: input.name ?? existing.name,
		category: input.category ?? existing.category,
		platform: input.platform ?? existing.platform,
		username: input.username ?? existing.username,
		userId: input.userId ?? existing.userId,
		loginMethod: input.loginMethod ?? existing.loginMethod,
		linkedEmailId: input.linkedEmailId ?? existing.linkedEmailId,
		passwordLocation: input.passwordLocation ?? existing.passwordLocation,
		twoFactor: input.twoFactor ?? existing.twoFactor,
		status: input.status ?? existing.status,
		tags: input.tags ?? existing.tags,
		notes: input.notes ?? existing.notes
	});

	return updateAccountInTauri(id, nextInput);
}

export async function deleteAccount(id: number) {
	await deleteAccountInTauri(id);
}

export async function getAccountsByEmail(emailId: number) {
	return (await getAccounts()).filter((account) => account.linkedEmailId === emailId);
}

export async function replaceAccounts(nextAccounts: AccountItem[]): Promise<AccountItem[]> {
	void nextAccounts;
	throw new Error('Import JSON ke SQLite belum diaktifkan.');
}

export async function resetAccountsToDefault(): Promise<AccountItem[]> {
	throw new Error('Reset sample data ke SQLite belum diaktifkan.');
}

export async function clearAccounts(): Promise<AccountItem[]> {
	throw new Error('Clear semua akun SQLite belum diaktifkan.');
}

async function getAccountById(id: number) {
	const account = (await getAccounts()).find((item) => item.id === id);

	if (!account) {
		throw new Error('Akun tidak ditemukan.');
	}

	return account;
}

function normalizeAccount(input: CreateAccountInput): CreateAccountInput {
	return {
		...input,
		name: input.name.trim(),
		platform: input.platform.trim(),
		username: input.username.trim(),
		userId: input.userId?.trim() || undefined,
		loginMethod: input.loginMethod.trim(),
		passwordLocation: input.passwordLocation.trim(),
		tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
		notes: input.notes.trim()
	};
}
