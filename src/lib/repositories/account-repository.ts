import { accounts as mockAccounts } from '$lib/data/mock';
import { loadJson, saveJson } from '$lib/storage/local-storage';
import type { AccountItem, CreateAccountInput, UpdateAccountInput } from '$lib/types/account';
import { createId } from '$lib/utils/id';

const storageKey = 'account-manager:accounts';

let accounts = loadJson<AccountItem[]>(storageKey, cloneAccounts(mockAccounts));

export function getAccountsSnapshot() {
	return cloneAccounts(accounts);
}

export async function getAccounts() {
	return getAccountsSnapshot();
}

export async function createAccount(input: CreateAccountInput) {
	const now = new Date().toISOString();
	const account: AccountItem = {
		id: createId(),
		...normalizeAccount(input),
		createdAt: now,
		updatedAt: now
	};

	accounts = [...accounts, account];
	persist();

	return cloneAccount(account);
}

export async function updateAccount(id: number, input: UpdateAccountInput) {
	const existing = accounts.find((account) => account.id === id);

	if (!existing) {
		throw new Error('Akun tidak ditemukan.');
	}

	const account: AccountItem = {
		...existing,
		...normalizePartialAccount(input),
		id,
		createdAt: existing.createdAt,
		updatedAt: new Date().toISOString()
	};

	accounts = accounts.map((item) => (item.id === id ? account : item));
	persist();

	return cloneAccount(account);
}

export async function deleteAccount(id: number) {
	accounts = accounts.filter((account) => account.id !== id);
	persist();
}

export async function getAccountsByEmail(emailId: number) {
	return cloneAccounts(accounts.filter((account) => account.linkedEmailId === emailId));
}

function persist() {
	saveJson(storageKey, accounts);
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

function normalizePartialAccount(input: UpdateAccountInput): UpdateAccountInput {
	return removeUndefined({
		...input,
		name: input.name?.trim(),
		platform: input.platform?.trim(),
		username: input.username?.trim(),
		userId: input.userId?.trim() || undefined,
		loginMethod: input.loginMethod?.trim(),
		passwordLocation: input.passwordLocation?.trim(),
		tags: input.tags?.map((tag) => tag.trim()).filter(Boolean),
		notes: input.notes?.trim()
	});
}

function cloneAccounts(items: AccountItem[]) {
	return items.map(cloneAccount);
}

function cloneAccount(account: AccountItem): AccountItem {
	return {
		...account,
		tags: [...account.tags]
	};
}

function removeUndefined<T extends Record<string, unknown>>(value: T) {
	return Object.fromEntries(
		Object.entries(value).filter(([, item]) => item !== undefined)
	) as Partial<T>;
}
