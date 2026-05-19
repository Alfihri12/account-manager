import { invoke } from '@tauri-apps/api/core';
import type { AccountItem, EmailItem } from '$lib/types/account';

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
