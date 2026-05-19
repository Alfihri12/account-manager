<script lang="ts">
	import AccountForm from '$lib/components/account/AccountForm.svelte';
	import AccountList from '$lib/components/account/AccountList.svelte';
	import DetailPanel from '$lib/components/account/DetailPanel.svelte';
	import StatGrid from '$lib/components/dashboard/StatGrid.svelte';
	import Topbar from '$lib/components/dashboard/Topbar.svelte';
	import EmailForm from '$lib/components/email/EmailForm.svelte';
	import EmailList from '$lib/components/email/EmailList.svelte';
	import EmailSummary from '$lib/components/email/EmailSummary.svelte';
	import SettingsPage from '$lib/components/settings/SettingsPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Toolbar from '$lib/components/ui/Toolbar.svelte';
	import type { AccountFormData, AccountItem, EmailFormData, EmailItem } from '$lib/types/account';

	type DialogMode = 'create-account' | 'edit-account' | 'create-email' | 'edit-email' | null;
	type DeleteTarget =
		| { type: 'account'; id: number; label: string }
		| { type: 'email'; id: number; label: string }
		| null;

	type Props = {
		selectedMenu: string;
		emails: EmailItem[];
		accounts: AccountItem[];
		totalEmails: number;
		totalAccounts: number;
		activeTwoFactor: number;
		needAudit: number;
		safeEmails: number;
		loading: boolean;
		error?: string | null;
		account?: AccountItem;
		email?: EmailItem;
		search: string;
		selectedCategory: string;
		selectedEmail: string;
		selectedAccountId: number;
		onExport: () => void;
		onCreateAccount: (data: AccountFormData) => void | Promise<void>;
		onUpdateAccount: (id: number, data: AccountFormData) => void | Promise<void>;
		onDeleteAccount: (id: number) => void | Promise<void>;
		onCreateEmail: (data: EmailFormData) => void | Promise<void>;
		onUpdateEmail: (id: number, data: EmailFormData) => void | Promise<void>;
		onDeleteEmail: (id: number) => void | Promise<void>;
		onExportBackup: () => void;
		onImportBackup: (file: File) => void | Promise<void>;
		onResetSample: () => void | Promise<void>;
		onClearLocalData: () => void | Promise<void>;
		onPingRust: () => void | Promise<void>;
		onInitDatabase: () => void | Promise<void>;
		onTestSqliteGetEmails: () => void | Promise<void>;
		onTestSqliteGetAccounts: () => void | Promise<void>;
		onTestSqliteCreateEmail: () => void | Promise<void>;
		onTestSqliteCreateAccount: () => void | Promise<void>;
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
		loading,
		error,
		account,
		email,
		search = $bindable(),
		selectedCategory = $bindable(),
		selectedEmail = $bindable(),
		selectedAccountId = $bindable(),
		onExport,
		onCreateAccount,
		onUpdateAccount,
		onDeleteAccount,
		onCreateEmail,
		onUpdateEmail,
		onDeleteEmail,
		onExportBackup,
		onImportBackup,
		onResetSample,
		onClearLocalData,
		onPingRust,
		onInitDatabase,
		onTestSqliteGetEmails,
		onTestSqliteGetAccounts,
		onTestSqliteCreateEmail,
		onTestSqliteCreateAccount
	}: Props = $props();

	let dialogMode = $state<DialogMode>(null);
	let editingEmailId = $state<number | null>(null);
	let deleteTarget = $state<DeleteTarget>(null);

	const pageTitle = $derived.by(() => {
		if (selectedMenu === 'emails') return 'Email Induk';
		if (selectedMenu === 'games') return 'Akun Game';
		if (selectedMenu === 'sosmed') return 'Sosmed';
		if (selectedMenu === 'settings') return 'Settings';

		return 'Dashboard Akun';
	});

	const pageDescription = $derived.by(() => {
		if (selectedMenu === 'emails') return 'Kelola email utama, recovery, 2FA, dan relasi akun.';
		if (selectedMenu === 'games') return 'Fokus ke akun game dan status keamanan dasarnya.';
		if (selectedMenu === 'sosmed')
			return 'Pantau akun sosial media, login, dan email yang terhubung.';
		if (selectedMenu === 'settings')
			return 'Backup, restore, reset data lokal, dan persiapan export Obsidian.';

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

	const deleteMessage = $derived.by(() => {
		if (!deleteTarget) return '';
		if (deleteTarget.type === 'email') {
			return `Hapus email "${deleteTarget.label}"? Akun yang terhubung tidak ikut dihapus, tapi relasi emailnya akan menjadi tidak jelas.`;
		}

		return `Hapus akun "${deleteTarget.label}"? Data ini akan hilang dari state lokal.`;
	});

	$effect(() => {
		if (selectedMenu === 'emails' && selectedEmail === 'all' && emails[0]) {
			selectedEmail = String(emails[0].id);
		}
	});

	function closeDialog() {
		dialogMode = null;
		editingEmailId = null;
	}

	function openCreateAccount() {
		dialogMode = 'create-account';
	}

	function openEditAccount() {
		if (!account) return;

		dialogMode = 'edit-account';
	}

	function openCreateEmail() {
		dialogMode = 'create-email';
	}

	function openEditEmail(email: EmailItem) {
		editingEmailId = email.id;
		dialogMode = 'edit-email';
	}

	async function handleAccountSubmit(data: AccountFormData) {
		if (dialogMode === 'edit-account' && account) {
			await onUpdateAccount(account.id, data);
		} else {
			await onCreateAccount(data);
		}

		closeDialog();
	}

	async function handleEmailSubmit(data: EmailFormData) {
		if (dialogMode === 'edit-email' && editingEmailId !== null) {
			await onUpdateEmail(editingEmailId, data);
		} else {
			await onCreateEmail(data);
		}

		closeDialog();
	}

	function requestDeleteAccount() {
		if (!account) return;

		deleteTarget = { type: 'account', id: account.id, label: account.name };
	}

	function requestDeleteEmail(email: EmailItem) {
		deleteTarget = { type: 'email', id: email.id, label: email.label };
	}

	function closeConfirmDialog() {
		deleteTarget = null;
	}

	async function confirmDelete() {
		if (!deleteTarget) return;

		if (deleteTarget.type === 'account') {
			await onDeleteAccount(deleteTarget.id);
		} else {
			await onDeleteEmail(deleteTarget.id);
		}

		closeConfirmDialog();
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

		{#if selectedMenu !== 'settings'}
			<Toolbar {emails} bind:search bind:selectedCategory bind:selectedEmail />
		{/if}

		{#if selectedMenu === 'settings'}
			<SettingsPage
				{totalEmails}
				{totalAccounts}
				{loading}
				{error}
				{onExportBackup}
				{onImportBackup}
				{onResetSample}
				{onClearLocalData}
				{onPingRust}
				{onInitDatabase}
				{onTestSqliteGetEmails}
				{onTestSqliteGetAccounts}
				{onTestSqliteCreateEmail}
				{onTestSqliteCreateAccount}
			/>
		{:else if selectedMenu === 'emails'}
			<section class="email-page">
				<EmailList
					{emails}
					bind:selectedEmail
					onCreate={openCreateEmail}
					onEdit={openEditEmail}
					onDelete={requestDeleteEmail}
				/>
				<EmailSummary {emails} {accounts} {selectedEmail} />
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
						onDelete={requestDeleteEmail}
					/>
				{/if}
			</section>
		{/if}
	</main>

	{#if selectedMenu !== 'emails' && selectedMenu !== 'settings' && account}
		<DetailPanel
			{account}
			{email}
			{onExport}
			onEdit={openEditAccount}
			onDelete={requestDeleteAccount}
		/>
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

	<ConfirmDialog
		open={deleteTarget !== null}
		title="Konfirmasi Hapus"
		message={deleteMessage}
		onCancel={closeConfirmDialog}
		onConfirm={confirmDelete}
	/>
</section>
