import { invoke } from '@tauri-apps/api/core';

export async function pingRust() {
	return invoke<string>('ping');
}
