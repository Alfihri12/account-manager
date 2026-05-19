import {
	createEmailInTauri,
	deleteEmailInTauri,
	getEmailsFromTauri,
	updateEmailInTauri
} from '$lib/api/tauri';
import type { CreateEmailInput, EmailItem, UpdateEmailInput } from '$lib/types/account';

export function getEmailsSnapshot() {
	return [];
}

export async function getEmails() {
	return getEmailsFromTauri();
}

export async function createEmail(input: CreateEmailInput) {
	return createEmailInTauri(normalizeEmail(input));
}

export async function updateEmail(id: number, input: UpdateEmailInput) {
	const existing = await getEmailById(id);
	const nextInput: CreateEmailInput = normalizeEmail({
		label: input.label ?? existing.label,
		address: input.address ?? existing.address,
		provider: input.provider ?? existing.provider,
		purpose: input.purpose ?? existing.purpose,
		twoFactor: input.twoFactor ?? existing.twoFactor,
		recovery: input.recovery ?? existing.recovery,
		status: input.status ?? existing.status
	});

	return updateEmailInTauri(id, nextInput);
}

export async function deleteEmail(id: number) {
	await deleteEmailInTauri(id);
}

export async function replaceEmails(nextEmails: EmailItem[]): Promise<EmailItem[]> {
	void nextEmails;
	throw new Error('Import JSON ke SQLite belum diaktifkan.');
}

export async function resetEmailsToDefault(): Promise<EmailItem[]> {
	throw new Error('Reset sample data ke SQLite belum diaktifkan.');
}

export async function clearEmails(): Promise<EmailItem[]> {
	throw new Error('Clear semua email SQLite belum diaktifkan.');
}

async function getEmailById(id: number) {
	const email = (await getEmails()).find((item) => item.id === id);

	if (!email) {
		throw new Error('Email tidak ditemukan.');
	}

	return email;
}

function normalizeEmail(input: CreateEmailInput): CreateEmailInput {
	return {
		...input,
		label: input.label.trim(),
		address: input.address.trim(),
		provider: input.provider.trim(),
		purpose: input.purpose.trim(),
		recovery: input.recovery.trim()
	};
}
