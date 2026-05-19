<script lang="ts">
	import DashboardContent from '$lib/components/layout/DashboardContent.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { accountToMarkdown } from '$lib/services/export-markdown';
	import { useAccountStore } from '$lib/stores/account-store.svelte';
	import { useEmailStore } from '$lib/stores/email-store.svelte';
	import { useToastStore } from '$lib/stores/toast-store.svelte';
	import { useUiStore } from '$lib/stores/ui-store.svelte';
	import type { AccountFormData, EmailFormData } from '$lib/types/account';

	const accountStore = useAccountStore();
	const emailStore = useEmailStore();
	const toastStore = useToastStore();
	const uiStore = useUiStore();

	const accounts = $derived(accountStore.accounts);
	const emails = $derived(emailStore.emails);

	const selectedAccount = $derived(
		accounts.find((account) => account.id === uiStore.selectedAccountId) ?? accounts[0]
	);

	const selectedEmailItem = $derived(
		selectedAccount ? emails.find((email) => email.id === selectedAccount.linkedEmailId) : undefined
	);

	const filteredAccounts = $derived.by(() =>
		accounts.filter((account) => {
			const email = emails.find((item) => item.id === account.linkedEmailId);
			const keyword =
				`${account.name} ${account.platform} ${account.username} ${email?.label ?? ''}`.toLowerCase();
			const menuCategory =
				uiStore.selectedMenu === 'games'
					? 'game'
					: uiStore.selectedMenu === 'sosmed'
						? 'sosmed'
						: uiStore.selectedCategory;

			return (
				keyword.includes(uiStore.search.toLowerCase()) &&
				(menuCategory === 'all' || account.category === menuCategory) &&
				(uiStore.selectedEmail === 'all' || account.linkedEmailId === Number(uiStore.selectedEmail))
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
		if (uiStore.selectedMenu === 'emails' || filteredAccounts.length === 0) {
			return;
		}

		const selectedAccountIsVisible = filteredAccounts.some(
			(account) => account.id === uiStore.selectedAccountId
		);

		if (!selectedAccountIsVisible) {
			uiStore.selectedAccountId = filteredAccounts[0].id;
		}
	});

	function exportMarkdown() {
		if (!selectedAccount) {
			toastStore.error('Akun tidak ditemukan.');
			return;
		}

		console.log(accountToMarkdown(selectedAccount, selectedEmailItem));
		toastStore.success('Markdown akun berhasil dibuat di console.');
	}

	async function handleCreateAccount(data: AccountFormData) {
		try {
			const account = await accountStore.createAccount(data);
			uiStore.selectedAccountId = account.id;
			toastStore.success('Akun berhasil ditambahkan.');
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal menambahkan akun.'));
		}
	}

	async function handleUpdateAccount(id: number, data: AccountFormData) {
		try {
			await accountStore.updateAccount(id, data);
			uiStore.selectedAccountId = id;
			toastStore.success('Akun berhasil diperbarui.');
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal memperbarui akun.'));
		}
	}

	async function handleDeleteAccount(id: number) {
		try {
			await accountStore.deleteAccount(id);
			uiStore.selectedAccountId = accountStore.accounts[0]?.id ?? 0;
			toastStore.success('Akun berhasil dihapus.');
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal menghapus akun.'));
		}
	}

	async function handleCreateEmail(data: EmailFormData) {
		try {
			const email = await emailStore.createEmail(data);
			uiStore.selectedEmail = String(email.id);
			toastStore.success('Email berhasil ditambahkan.');
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal menambahkan email.'));
		}
	}

	async function handleUpdateEmail(id: number, data: EmailFormData) {
		try {
			await emailStore.updateEmail(id, data);
			uiStore.selectedEmail = String(id);
			toastStore.success('Email berhasil diperbarui.');
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal memperbarui email.'));
		}
	}

	async function handleDeleteEmail(id: number) {
		try {
			await emailStore.deleteEmail(id);

			if (uiStore.selectedEmail === String(id)) {
				uiStore.selectedEmail = emailStore.emails[0] ? String(emailStore.emails[0].id) : 'all';
			}

			toastStore.success('Email berhasil dihapus.');
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal menghapus email.'));
		}
	}

	function getErrorMessage(error: unknown, fallback: string) {
		return error instanceof Error ? error.message : fallback;
	}
</script>

<svelte:head>
	<title>Akun Manager</title>
</svelte:head>

<div class="app-shell">
	<Sidebar
		bind:selectedMenu={uiStore.selectedMenu}
		{totalAccounts}
		{totalEmails}
		{gameCount}
		{socialCount}
		onExport={exportMarkdown}
	/>

	<DashboardContent
		selectedMenu={uiStore.selectedMenu}
		{emails}
		accounts={filteredAccounts}
		{totalEmails}
		{totalAccounts}
		{activeTwoFactor}
		{needAudit}
		{safeEmails}
		account={selectedAccount}
		email={selectedEmailItem}
		bind:search={uiStore.search}
		bind:selectedCategory={uiStore.selectedCategory}
		bind:selectedEmail={uiStore.selectedEmail}
		bind:selectedAccountId={uiStore.selectedAccountId}
		onExport={exportMarkdown}
		onCreateAccount={handleCreateAccount}
		onUpdateAccount={handleUpdateAccount}
		onDeleteAccount={handleDeleteAccount}
		onCreateEmail={handleCreateEmail}
		onUpdateEmail={handleUpdateEmail}
		onDeleteEmail={handleDeleteEmail}
	/>

	<Toast />
</div>
