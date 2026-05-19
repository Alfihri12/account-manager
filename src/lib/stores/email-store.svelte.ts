import * as emailRepository from '$lib/repositories/email-repository';
import { useAccountStore } from '$lib/stores/account-store.svelte';
import type { CreateEmailInput, EmailItem, UpdateEmailInput } from '$lib/types/account';

let emails = $state<EmailItem[]>(emailRepository.getEmailsSnapshot());
let loading = $state(false);
let error = $state<string | null>(null);
let initialized = $state(false);

export function useEmailStore() {
	const accountStore = useAccountStore();

	async function loadEmails() {
		loading = true;

		try {
			emails = await emailRepository.getEmails();
			error = null;
		} catch (err) {
			error = getErrorMessage(err, 'Gagal memuat email.');
		} finally {
			loading = false;
			initialized = true;
		}
	}

	async function createEmail(input: CreateEmailInput) {
		return runMutation(async () => {
			const email = await emailRepository.createEmail(input);
			emails = [...emails, email];

			return email;
		}, 'Gagal menambahkan email.');
	}

	async function updateEmail(id: number, input: UpdateEmailInput) {
		return runMutation(async () => {
			const email = await emailRepository.updateEmail(id, input);
			emails = emails.map((item) => (item.id === id ? email : item));

			return email;
		}, 'Gagal memperbarui email.');
	}

	async function deleteEmail(id: number) {
		await runMutation(async () => {
			await emailRepository.deleteEmail(id);
			emails = emails.filter((email) => email.id !== id);
		}, 'Gagal menghapus email.');
	}

	async function replaceEmails(nextEmails: EmailItem[]) {
		await runMutation(async () => {
			emails = await emailRepository.replaceEmails(nextEmails);
		}, 'Gagal mengganti data email.');
	}

	async function resetEmailsToDefault() {
		await runMutation(async () => {
			emails = await emailRepository.resetEmailsToDefault();
		}, 'Gagal reset email.');
	}

	async function clearEmails() {
		await runMutation(async () => {
			emails = await emailRepository.clearEmails();
		}, 'Gagal menghapus semua email.');
	}

	async function runMutation<T>(callback: () => Promise<T>, fallback: string) {
		loading = true;

		try {
			const result = await callback();
			error = null;
			initialized = true;

			return result;
		} catch (err) {
			error = getErrorMessage(err, fallback);
			throw err;
		} finally {
			loading = false;
		}
	}

	return {
		get emails() {
			return withAccountCounts(emails, accountStore.accounts);
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get initialized() {
			return initialized;
		},
		loadEmails,
		createEmail,
		updateEmail,
		deleteEmail,
		replaceEmails,
		resetEmailsToDefault,
		clearEmails
	};
}

function withAccountCounts(
	emails: EmailItem[],
	accounts: ReturnType<typeof useAccountStore>['accounts']
) {
	return emails.map((email) => ({
		...email,
		accountCount: accounts.filter((account) => account.linkedEmailId === email.id).length
	}));
}

function getErrorMessage(error: unknown, fallback: string) {
	return error instanceof Error ? error.message : fallback;
}
