import { emails as mockEmails } from '$lib/data/mock';
import type { AccountItem, EmailItem } from '$lib/types/account';

export type EmailFormData = Omit<EmailItem, 'id' | 'accountCount'>;

export function getEmails() {
	return mockEmails.map((email) => ({ ...email }));
}

export function createEmail(emails: EmailItem[], data: EmailFormData) {
	const nextId = Math.max(0, ...emails.map((email) => email.id)) + 1;

	return [...emails, { id: nextId, accountCount: 0, ...normalizeEmail(data) }];
}

export function updateEmail(emails: EmailItem[], id: number, data: EmailFormData) {
	return emails.map((email) =>
		email.id === id ? { id, accountCount: email.accountCount, ...normalizeEmail(data) } : email
	);
}

export function deleteEmail(emails: EmailItem[], id: number) {
	return emails.filter((email) => email.id !== id);
}

export function withAccountCounts(emails: EmailItem[], accounts: AccountItem[]) {
	return emails.map((email) => ({
		...email,
		accountCount: accounts.filter((account) => account.linkedEmailId === email.id).length
	}));
}

function normalizeEmail(data: EmailFormData): EmailFormData {
	return {
		...data,
		label: data.label.trim(),
		address: data.address.trim(),
		provider: data.provider.trim(),
		purpose: data.purpose.trim(),
		recovery: data.recovery.trim()
	};
}
