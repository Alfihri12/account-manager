import { initDatabase } from '$lib/api/tauri';
import { ACTIVE_ADAPTER } from '$lib/repositories/adapter-mode';

let initialized = false;
let initializePromise: Promise<void> | null = null;

export async function initializeAppStorage() {
	if (initialized || ACTIVE_ADAPTER !== 'tauri') {
		return;
	}

	initializePromise ??= initDatabase()
		.then(() => {
			initialized = true;
		})
		.catch((error) => {
			initializePromise = null;
			throw error;
		});

	await initializePromise;
}
