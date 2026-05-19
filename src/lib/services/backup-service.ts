import type { AccountItem, EmailItem } from '$lib/types/account';

export type BackupData = {
	version: 1;
	exportedAt: string;
	emails: EmailItem[];
	accounts: AccountItem[];
};

export function exportBackupJson(emails: EmailItem[], accounts: AccountItem[]) {
	const backup: BackupData = {
		version: 1,
		exportedAt: new Date().toISOString(),
		emails: emails.map((email) => ({ ...email })),
		accounts: accounts.map((account) => ({
			...account,
			tags: [...account.tags]
		}))
	};

	return JSON.stringify(backup, null, 2);
}

export async function importBackupJson(file: File) {
	const text = await file.text();
	const data = JSON.parse(text) as unknown;

	return validateBackupData(data);
}

export function validateBackupData(data: unknown): BackupData {
	if (!isBackupData(data)) {
		throw new Error('Format backup tidak valid.');
	}

	return data;
}

export function downloadBackupJson(json: string, filename = 'account-manager-backup.json') {
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}

function isBackupData(data: unknown): data is BackupData {
	if (!data || typeof data !== 'object') return false;

	const backup = data as BackupData;

	return (
		backup.version === 1 &&
		typeof backup.exportedAt === 'string' &&
		Array.isArray(backup.emails) &&
		Array.isArray(backup.accounts)
	);
}
