<script lang="ts">
	import AccountList from '$lib/components/account/AccountList.svelte';
	import DetailPanel from '$lib/components/account/DetailPanel.svelte';
	import StatGrid from '$lib/components/dashboard/StatGrid.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import EmailList from '$lib/components/email/EmailList.svelte';
	import EmailSummary from '$lib/components/email/EmailSummary.svelte';
	import Toolbar from '$lib/components/ui/Toolbar.svelte';
	import type { AccountItem, EmailItem } from '$lib/types/account';

	type Props = {
		selectedMenu: string;
		emails: EmailItem[];
		accounts: AccountItem[];
		totalEmails: number;
		totalAccounts: number;
		activeTwoFactor: number;
		needAudit: number;
		safeEmails: number;
		account: AccountItem;
		email?: EmailItem;
		search: string;
		selectedCategory: string;
		selectedEmail: string;
		selectedAccountId: number;
		onExport: () => void;
	};

	let {
		selectedMenu,
		emails,
		accounts,
		totalEmails,
		totalAccounts,
		activeTwoFactor,
		needAudit,
		safeEmails,
		account,
		email,
		search = $bindable(),
		selectedCategory = $bindable(),
		selectedEmail = $bindable(),
		selectedAccountId = $bindable(),
		onExport
	}: Props = $props();

	const pageTitle = $derived.by(() => {
		if (selectedMenu === 'emails') return 'Email Induk';
		if (selectedMenu === 'games') return 'Akun Game';
		if (selectedMenu === 'sosmed') return 'Sosmed';

		return 'Dashboard Akun';
	});

	const pageDescription = $derived.by(() => {
		if (selectedMenu === 'emails') return 'Kelola email utama, recovery, 2FA, dan relasi akun.';
		if (selectedMenu === 'games') return 'Fokus ke akun game dan status keamanan dasarnya.';
		if (selectedMenu === 'sosmed')
			return 'Pantau akun sosial media, login, dan email yang terhubung.';

		return 'Pantau email induk, akun game, sosmed, dan status keamanan dasar.';
	});
</script>

<section class="content-shell" class:email-mode={selectedMenu === 'emails'}>
	<main class="main-content">
		<Topbar title={pageTitle} description={pageDescription} {onExport} />

		{#if selectedMenu === 'dashboard'}
			<StatGrid {totalEmails} {totalAccounts} {activeTwoFactor} {needAudit} {safeEmails} />
		{/if}

		<Toolbar {emails} bind:search bind:selectedCategory bind:selectedEmail />

		{#if selectedMenu === 'emails'}
			<section class="email-page">
				<EmailList {emails} bind:selectedEmail />
				<EmailSummary {emails} />
			</section>
		{:else}
			<section class="workspace">
				<AccountList {emails} {accounts} bind:selectedAccountId />
				{#if selectedMenu === 'dashboard'}
					<EmailList {emails} bind:selectedEmail />
				{/if}
			</section>
		{/if}
	</main>

	{#if selectedMenu !== 'emails'}
		<DetailPanel {account} {email} {onExport} />
	{/if}
</section>
