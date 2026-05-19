<script lang="ts">
	import AccountForm from '$lib/components/account/AccountForm.svelte';
	import AccountList from '$lib/components/account/AccountList.svelte';
	import DetailPanel from '$lib/components/account/DetailPanel.svelte';
	import StatGrid from '$lib/components/dashboard/StatGrid.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import EmailForm from '$lib/components/email/EmailForm.svelte';
	import EmailList from '$lib/components/email/EmailList.svelte';
	import EmailSummary from '$lib/components/email/EmailSummary.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Toolbar from '$lib/components/ui/Toolbar.svelte';
	import type { AccountFormData } from '$lib/services/account-service';
	import type { EmailFormData } from '$lib/services/email-service';
	import type { AccountItem, EmailItem } from '$lib/types/account';

	type DialogMode = 'create-account' | 'edit-account' | 'create-email' | 'edit-email' | null;

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
		onCreateAccount: (data: AccountFormData) => void;
		onUpdateAccount: (id: number, data: AccountFormData) => void;
		onCreateEmail: (data: EmailFormData) => void;
		onUpdateEmail: (id: number, data: EmailFormData) => void;
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
		onExport,
		onCreateAccount,
		onUpdateAccount,
		onCreateEmail,
		onUpdateEmail
	}: Props = $props();

	let dialogMode = $state<DialogMode>(null);
	let editingEmailId = $state<number | null>(null);

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

	const dialogTitle = $derived.by(() => {
		if (dialogMode === 'edit-account') return 'Edit Akun';
		if (dialogMode === 'create-email') return 'Tambah Email Induk';
		if (dialogMode === 'edit-email') return 'Edit Email Induk';

		return 'Tambah Akun';
	});

	const defaultAccountCategory = $derived.by(() => {
		if (selectedMenu === 'sosmed') return 'sosmed';
		if (selectedMenu === 'games') return 'game';

		return 'game';
	});

	const editingEmail = $derived(emails.find((item) => item.id === editingEmailId));

	function closeDialog() {
		dialogMode = null;
		editingEmailId = null;
	}

	function openCreateAccount() {
		dialogMode = 'create-account';
	}

	function openEditAccount() {
		dialogMode = 'edit-account';
	}

	function openCreateEmail() {
		dialogMode = 'create-email';
	}

	function openEditEmail(email: EmailItem) {
		editingEmailId = email.id;
		dialogMode = 'edit-email';
	}

	function handleAccountSubmit(data: AccountFormData) {
		if (dialogMode === 'edit-account') {
			onUpdateAccount(account.id, data);
		} else {
			onCreateAccount(data);
		}

		closeDialog();
	}

	function handleEmailSubmit(data: EmailFormData) {
		if (dialogMode === 'edit-email' && editingEmailId !== null) {
			onUpdateEmail(editingEmailId, data);
		} else {
			onCreateEmail(data);
		}

		closeDialog();
	}
</script>

<section class="content-shell" class:email-mode={selectedMenu === 'emails'}>
	<main class="main-content">
		<Topbar
			title={pageTitle}
			description={pageDescription}
			{onExport}
			onAddAccount={openCreateAccount}
		/>

		{#if selectedMenu === 'dashboard'}
			<StatGrid {totalEmails} {totalAccounts} {activeTwoFactor} {needAudit} {safeEmails} />
		{/if}

		<Toolbar {emails} bind:search bind:selectedCategory bind:selectedEmail />

		{#if selectedMenu === 'emails'}
			<section class="email-page">
				<EmailList {emails} bind:selectedEmail onCreate={openCreateEmail} onEdit={openEditEmail} />
				<EmailSummary {emails} />
			</section>
		{:else}
			<section class="workspace">
				<AccountList {emails} {accounts} bind:selectedAccountId />
				{#if selectedMenu === 'dashboard'}
					<EmailList
						{emails}
						bind:selectedEmail
						onCreate={openCreateEmail}
						onEdit={openEditEmail}
					/>
				{/if}
			</section>
		{/if}
	</main>

	{#if selectedMenu !== 'emails'}
		<DetailPanel {account} {email} {onExport} onEdit={openEditAccount} />
	{/if}

	<Modal open={dialogMode !== null} title={dialogTitle} onClose={closeDialog}>
		{#if dialogMode === 'create-account' || dialogMode === 'edit-account'}
			<AccountForm
				{emails}
				account={dialogMode === 'edit-account' ? account : undefined}
				defaultCategory={defaultAccountCategory}
				onSubmit={handleAccountSubmit}
				onCancel={closeDialog}
			/>
		{:else if dialogMode === 'create-email' || dialogMode === 'edit-email'}
			<EmailForm
				email={dialogMode === 'edit-email' ? editingEmail : undefined}
				onSubmit={handleEmailSubmit}
				onCancel={closeDialog}
			/>
		{/if}
	</Modal>
</section>
