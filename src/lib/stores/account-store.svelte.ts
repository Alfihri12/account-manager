import * as accountRepository from '$lib/repositories/account-repository';
import type { AccountItem, CreateAccountInput, UpdateAccountInput } from '$lib/types/account';

let accounts = $state<AccountItem[]>(accountRepository.getAccountsSnapshot());

export function useAccountStore() {
	async function createAccount(input: CreateAccountInput) {
		const account = await accountRepository.createAccount(input);
		accounts = [...accounts, account];

		return account;
	}

	async function updateAccount(id: number, input: UpdateAccountInput) {
		const account = await accountRepository.updateAccount(id, input);
		accounts = accounts.map((item) => (item.id === id ? account : item));

		return account;
	}

	async function deleteAccount(id: number) {
		await accountRepository.deleteAccount(id);
		accounts = accounts.filter((account) => account.id !== id);
	}

	async function getAccountsByEmail(emailId: number) {
		return accountRepository.getAccountsByEmail(emailId);
	}

	return {
		get accounts() {
			return accounts;
		},
		createAccount,
		updateAccount,
		deleteAccount,
		getAccountsByEmail
	};
}
