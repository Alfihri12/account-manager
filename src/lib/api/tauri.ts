import { invoke } from '@tauri-apps/api/core';
import type {
	AccountItem,
	CreateAccountInput,
	CreateEmailInput,
	EmailItem,
	UpdateAccountInput,
	UpdateEmailInput
} from '$lib/types/account';

export type DatabaseHealth = {
	message: string;
	path: string;
};

export async function pingRust() {
	return invoke<string>('ping');
}

export async function initDatabase() {
	return invoke<DatabaseHealth>('init_database');
}

export async function getEmailsFromTauri() {
	return invoke<EmailItem[]>('get_emails');
}

export async function getAccountsFromTauri() {
	return invoke<AccountItem[]>('get_accounts');
}

export async function createEmailInTauri(input: CreateEmailInput) {
	return invoke<EmailItem>('create_email', { input });
}

export async function createAccountInTauri(input: CreateAccountInput) {
	return invoke<AccountItem>('create_account', { input });
}

export async function updateEmailInTauri(id: number, input: UpdateEmailInput) {
	return invoke<EmailItem>('update_email', { id, input });
}

export async function updateAccountInTauri(id: number, input: UpdateAccountInput) {
	return invoke<AccountItem>('update_account', { id, input });
}
