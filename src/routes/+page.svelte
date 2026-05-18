<script lang="ts">
	import DashboardContent from '$lib/components/layout/DashboardContent.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	import { accounts, emails } from '$lib/data/mock';
	import { getStatusLabel } from '$lib/utils/account';

	let selectedMenu = $state('dashboard');
	let search = $state('');
	let selectedCategory = $state('all');
	let selectedEmail = $state('all');
	let selectedAccountId = $state(1);

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

			return (
				keyword.includes(search.toLowerCase()) &&
				(selectedCategory === 'all' || account.category === selectedCategory) &&
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

	function exportMarkdown() {
		const email = selectedEmailItem?.label ?? '-';
		const markdown = `# ${selectedAccount.name}\n\nKategori: ${selectedAccount.category}\nPlatform: ${selectedAccount.platform}\nUsername: ${selectedAccount.username}\nLogin via: ${selectedAccount.loginMethod}\nEmail Terhubung: [[${email}]]\nPassword: lihat ${selectedAccount.passwordLocation}\n2FA: ${selectedAccount.twoFactor ? 'Aktif' : 'Belum aktif'}\nStatus: ${getStatusLabel(selectedAccount.status)}\n\n## Catatan\n${selectedAccount.notes}\n`;

		console.log(markdown);
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
	/>
</div>
