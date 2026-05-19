import { emails as mockEmails } from '$lib/data/mock';
import { loadJson, saveJson } from '$lib/storage/local-storage';
import type { CreateEmailInput, EmailItem, UpdateEmailInput } from '$lib/types/account';
import { createId } from '$lib/utils/id';

const storageKey = 'account-manager:emails';

let emails = loadJson<EmailItem[]>(
	storageKey,
	mockEmails.map((email) => ({ ...email }))
);

export function getEmailsSnapshot() {
	return emails.map((email) => ({ ...email }));
}

export async function getEmails() {
	return getEmailsSnapshot();
}

export async function createEmail(input: CreateEmailInput) {
	const now = new Date().toISOString();
	const email: EmailItem = {
		id: createId(),
		accountCount: 0,
		...normalizeEmail(input),
		createdAt: now,
		updatedAt: now
	};

	emails = [...emails, email];
	persist();

	return { ...email };
}

export async function updateEmail(id: number, input: UpdateEmailInput) {
	const existing = emails.find((email) => email.id === id);

	if (!existing) {
		throw new Error('Email tidak ditemukan.');
	}

	const email: EmailItem = {
		...existing,
		...normalizePartialEmail(input),
		id,
		accountCount: existing.accountCount,
		createdAt: existing.createdAt,
		updatedAt: new Date().toISOString()
	};

	emails = emails.map((item) => (item.id === id ? email : item));
	persist();

	return { ...email };
}

export async function deleteEmail(id: number) {
	emails = emails.filter((email) => email.id !== id);
	persist();
}

function persist() {
	saveJson(storageKey, emails);
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

function normalizePartialEmail(input: UpdateEmailInput): UpdateEmailInput {
	return removeUndefined({
		...input,
		label: input.label?.trim(),
		address: input.address?.trim(),
		provider: input.provider?.trim(),
		purpose: input.purpose?.trim(),
		recovery: input.recovery?.trim()
	});
}

function removeUndefined<T extends Record<string, unknown>>(value: T) {
	return Object.fromEntries(
		Object.entries(value).filter(([, item]) => item !== undefined)
	) as Partial<T>;
}
