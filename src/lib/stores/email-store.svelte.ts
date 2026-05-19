import * as emailRepository from '$lib/repositories/email-repository';
import { useAccountStore } from '$lib/stores/account-store.svelte';
import type { CreateEmailInput, EmailItem, UpdateEmailInput } from '$lib/types/account';

let emails = $state<EmailItem[]>(emailRepository.getEmailsSnapshot());

export function useEmailStore() {
	const accountStore = useAccountStore();

	async function createEmail(input: CreateEmailInput) {
		const email = await emailRepository.createEmail(input);
		emails = [...emails, email];

		return email;
	}

	async function updateEmail(id: number, input: UpdateEmailInput) {
		const email = await emailRepository.updateEmail(id, input);
		emails = emails.map((item) => (item.id === id ? email : item));

		return email;
	}

	async function deleteEmail(id: number) {
		await emailRepository.deleteEmail(id);
		emails = emails.filter((email) => email.id !== id);
	}

	return {
		get emails() {
			return withAccountCounts(emails, accountStore.accounts);
		},
		createEmail,
		updateEmail,
		deleteEmail
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
