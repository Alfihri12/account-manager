<script lang="ts">
	import DashboardContent from '$lib/components/layout/DashboardContent.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import {
		createAccount,
		getAccounts,
		updateAccount,
		type AccountFormData
	} from '$lib/services/account-service';
	import {
		createEmail,
		getEmails,
		updateEmail,
		withAccountCounts
	} from '$lib/services/email-service';
	import { accountToMarkdown } from '$lib/services/export-service';
	import type { EmailFormData } from '$lib/services/email-service';

	let selectedMenu = $state('dashboard');
	let search = $state('');
	let selectedCategory = $state('all');
	let selectedEmail = $state('all');
	let selectedAccountId = $state(1);
	let accounts = $state(getAccounts());
	let storedEmails = $state(getEmails());
	const emails = $derived(withAccountCounts(storedEmails, accounts));

	const selectedAccount = $derived(
		accounts.find((account) => account.id === selectedAccountId) ?? accounts[0]
	);

	const selectedEmailItem = $derived(
		emails.find((email) => email.id === selectedAccount.linkedEmailId)
	);

	const filteredAccounts = $derived.by(() =>
		accounts.filter((account) => {
			const email = emails.find((item) => item.id === account.linkedEmailId);
			const keyword =
				`${account.name} ${account.platform} ${account.username} ${email?.label ?? ''}`.toLowerCase();
			const menuCategory =
				selectedMenu === 'games' ? 'game' : selectedMenu === 'sosmed' ? 'sosmed' : selectedCategory;

			return (
				keyword.includes(search.toLowerCase()) &&
				(menuCategory === 'all' || account.category === menuCategory) &&
				(selectedEmail === 'all' || account.linkedEmailId === Number(selectedEmail))
			);
		})
	);

	const totalAccounts = $derived(accounts.length);
	const totalEmails = $derived(emails.length);
	const activeTwoFactor = $derived(accounts.filter((account) => account.twoFactor).length);
	const needAudit = $derived(
		accounts.filter((account) => account.status === 'need_check' || !account.twoFactor).length
	);
	const safeEmails = $derived(emails.filter((email) => email.status === 'safe').length);
	const gameCount = $derived(accounts.filter((account) => account.category === 'game').length);
	const socialCount = $derived(accounts.filter((account) => account.category === 'sosmed').length);

	$effect(() => {
		if (selectedMenu === 'emails' || filteredAccounts.length === 0) {
			return;
		}

		const selectedAccountIsVisible = filteredAccounts.some(
			(account) => account.id === selectedAccountId
		);

		if (!selectedAccountIsVisible) {
			selectedAccountId = filteredAccounts[0].id;
		}
	});

	function exportMarkdown() {
		console.log(accountToMarkdown(selectedAccount, selectedEmailItem));
	}

	function handleCreateAccount(data: AccountFormData) {
		accounts = createAccount(accounts, data);
		selectedAccountId = accounts.at(-1)?.id ?? selectedAccountId;
	}

	function handleUpdateAccount(id: number, data: AccountFormData) {
		accounts = updateAccount(accounts, id, data);
		selectedAccountId = id;
	}

	function handleCreateEmail(data: EmailFormData) {
		storedEmails = createEmail(storedEmails, data);
		selectedEmail = String(storedEmails.at(-1)?.id ?? 'all');
	}

	function handleUpdateEmail(id: number, data: EmailFormData) {
		storedEmails = updateEmail(storedEmails, id, data);
		selectedEmail = String(id);
	}
</script>

<svelte:head>
	<title>Akun Manager</title>
</svelte:head>

<div class="app-shell">
	<Sidebar
		bind:selectedMenu
		{totalAccounts}
		{totalEmails}
		{gameCount}
		{socialCount}
		onExport={exportMarkdown}
	/>

	<DashboardContent
		{selectedMenu}
		{emails}
		accounts={filteredAccounts}
		{totalEmails}
		{totalAccounts}
		{activeTwoFactor}
		{needAudit}
		{safeEmails}
		account={selectedAccount}
		email={selectedEmailItem}
		bind:search
		bind:selectedCategory
		bind:selectedEmail
		bind:selectedAccountId
		onExport={exportMarkdown}
		onCreateAccount={handleCreateAccount}
		onUpdateAccount={handleUpdateAccount}
		onCreateEmail={handleCreateEmail}
		onUpdateEmail={handleUpdateEmail}
	/>
</div>
