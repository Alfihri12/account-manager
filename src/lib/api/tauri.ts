import { invoke } from '@tauri-apps/api/core';

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
