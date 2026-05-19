import { accounts, emails } from '$lib/data/mock';
import * as accountRepository from '$lib/repositories/account-repository';
import * as emailRepository from '$lib/repositories/email-repository';

export function getMockSeedData() {
	return {
		accounts: accounts.map((account) => ({
			...account,
			tags: [...account.tags]
		})),
		emails: emails.map((email) => ({ ...email }))
	};
}

export async function seedMockData() {
	const seed = getMockSeedData();

	await emailRepository.replaceEmails(seed.emails);
	await accountRepository.replaceAccounts(seed.accounts);

	return seed;
}

export async function resetToDefaultData() {
	return seedMockData();
}

export async function clearLocalData() {
	await emailRepository.clearEmails();
	await accountRepository.clearAccounts();

	return {
		emails: [],
		accounts: []
	};
}
