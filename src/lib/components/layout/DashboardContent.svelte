<script lang="ts">
	import AccountList from '$lib/components/account/AccountList.svelte';
	import DetailPanel from '$lib/components/account/DetailPanel.svelte';
	import StatGrid from '$lib/components/dashboard/StatGrid.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import EmailList from '$lib/components/email/EmailList.svelte';
	import Toolbar from '$lib/components/ui/Toolbar.svelte';
	import type { AccountItem, EmailItem } from '$lib/types/account';

	type Props = {
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
</script>

<section class="content-shell">
	<main class="main-content">
		<Topbar {onExport} />

		<StatGrid {totalEmails} {totalAccounts} {activeTwoFactor} {needAudit} {safeEmails} />

		<Toolbar {emails} bind:search bind:selectedCategory bind:selectedEmail />

		<section class="workspace">
			<AccountList {emails} {accounts} bind:selectedAccountId />
			<EmailList {emails} bind:selectedEmail />
		</section>
	</main>

	<DetailPanel {account} {email} {onExport} />
</section>
