import { browser } from '$app/environment';

export function loadJson<T>(key: string, fallback: T): T {
	if (!browser) return fallback;

	const raw = localStorage.getItem(key);

	if (!raw) return fallback;

	try {
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

export function saveJson<T>(key: string, value: T) {
	if (!browser) return;

	localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string) {
	if (!browser) return;

	localStorage.removeItem(key);
}
