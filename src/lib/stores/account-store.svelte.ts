import * as accountRepository from '$lib/repositories/account-repository';
import { initializeAppStorage } from '$lib/services/app-init-service';
import type { AccountItem, CreateAccountInput, UpdateAccountInput } from '$lib/types/account';

let accounts = $state<AccountItem[]>(accountRepository.getAccountsSnapshot());
let loading = $state(false);
let error = $state<string | null>(null);
let initialized = $state(false);

export function useAccountStore() {
	async function loadAccounts() {
		loading = true;

		try {
			await initializeAppStorage();
			accounts = await accountRepository.getAccounts();
			error = null;
		} catch (err) {
			error = getErrorMessage(err, 'Gagal memuat akun.');
		} finally {
			loading = false;
			initialized = true;
		}
	}

	async function createAccount(input: CreateAccountInput) {
		return runMutation(async () => {
			const account = await accountRepository.createAccount(input);
			accounts = [...accounts, account];

			return account;
		}, 'Gagal menambahkan akun.');
	}

	async function updateAccount(id: number, input: UpdateAccountInput) {
		return runMutation(async () => {
			const account = await accountRepository.updateAccount(id, input);
			accounts = accounts.map((item) => (item.id === id ? account : item));

			return account;
		}, 'Gagal memperbarui akun.');
	}

	async function deleteAccount(id: number) {
		await runMutation(async () => {
			await accountRepository.deleteAccount(id);
			accounts = accounts.filter((account) => account.id !== id);
		}, 'Gagal menghapus akun.');
	}

	async function getAccountsByEmail(emailId: number) {
		return accountRepository.getAccountsByEmail(emailId);
	}

	async function replaceAccounts(nextAccounts: AccountItem[]) {
		await runMutation(async () => {
			accounts = await accountRepository.replaceAccounts(nextAccounts);
		}, 'Gagal mengganti data akun.');
	}

	async function resetAccountsToDefault() {
		await runMutation(async () => {
			accounts = await accountRepository.resetAccountsToDefault();
		}, 'Gagal reset akun.');
	}

	async function clearAccounts() {
		await runMutation(async () => {
			accounts = await accountRepository.clearAccounts();
		}, 'Gagal menghapus semua akun.');
	}

	async function runMutation<T>(callback: () => Promise<T>, fallback: string) {
		loading = true;

		try {
			const result = await callback();
			error = null;
			initialized = true;

			return result;
		} catch (err) {
			error = getErrorMessage(err, fallback);
			throw err;
		} finally {
			loading = false;
		}
	}

	return {
		get accounts() {
			return accounts;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get initialized() {
			return initialized;
		},
		loadAccounts,
		createAccount,
		updateAccount,
		deleteAccount,
		getAccountsByEmail,
		replaceAccounts,
		resetAccountsToDefault,
		clearAccounts
	};
}

function getErrorMessage(error: unknown, fallback: string) {
	return error instanceof Error ? error.message : fallback;
}
