<script lang="ts">
	import DashboardContent from '$lib/components/layout/DashboardContent.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import {
		createAccountInTauri,
		createEmailInTauri,
		getAccountsFromTauri,
		getEmailsFromTauri,
		initDatabase,
		pingRust,
		updateAccountInTauri,
		updateEmailInTauri
	} from '$lib/api/tauri';
	import {
		downloadBackupJson,
		exportBackupJson,
		importBackupJson
	} from '$lib/services/backup-service';
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
	const loading = $derived(accountStore.loading || emailStore.loading);
	const error = $derived(accountStore.error ?? emailStore.error);

	$effect(() => {
		if (!accountStore.initialized && !accountStore.loading) {
			void accountStore.loadAccounts();
		}

		if (!emailStore.initialized && !emailStore.loading) {
			void emailStore.loadEmails();
		}
	});

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

	function handleExportBackup() {
		try {
			const json = exportBackupJson(emails, accounts);
			downloadBackupJson(json);
			toastStore.success('Backup JSON berhasil dibuat.');
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal membuat backup JSON.'));
		}
	}

	async function handleImportBackup(file: File) {
		try {
			const backup = await importBackupJson(file);
			await emailStore.replaceEmails(backup.emails);
			await accountStore.replaceAccounts(backup.accounts);
			uiStore.selectedEmail = emailStore.emails[0] ? String(emailStore.emails[0].id) : 'all';
			uiStore.selectedAccountId = accountStore.accounts[0]?.id ?? 0;
			toastStore.success('Backup JSON berhasil dipulihkan.');
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal import backup JSON.'));
		}
	}

	async function handleResetSample() {
		try {
			await emailStore.resetEmailsToDefault();
			await accountStore.resetAccountsToDefault();
			uiStore.selectedEmail = emailStore.emails[0] ? String(emailStore.emails[0].id) : 'all';
			uiStore.selectedAccountId = accountStore.accounts[0]?.id ?? 0;
			toastStore.success('Data sample berhasil dipulihkan.');
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal reset data sample.'));
		}
	}

	async function handleClearLocalData() {
		try {
			await emailStore.clearEmails();
			await accountStore.clearAccounts();
			uiStore.selectedEmail = 'all';
			uiStore.selectedAccountId = 0;
			toastStore.success('Semua data lokal berhasil dihapus.');
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal menghapus data lokal.'));
		}
	}

	async function handlePingRust() {
		try {
			const result = await pingRust();
			console.log(result);
			toastStore.success(result);
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal ping Rust. Jalankan lewat Tauri dev.'));
		}
	}

	async function handleInitDatabase() {
		try {
			const result = await initDatabase();
			console.log(result);
			toastStore.success(`${result.message}: ${result.path}`);
		} catch (error) {
			toastStore.error(getErrorMessage(error, 'Gagal init database. Jalankan lewat Tauri dev.'));
		}
	}

	async function handleTestSqliteGetEmails() {
		try {
			const result = await getEmailsFromTauri();
			console.log(result);
			toastStore.success(JSON.stringify(result));
		} catch (error) {
			toastStore.error(
				getErrorMessage(error, 'Gagal get emails SQLite. Jalankan lewat Tauri dev.')
			);
		}
	}

	async function handleTestSqliteGetAccounts() {
		try {
			const result = await getAccountsFromTauri();
			console.log(result);
			toastStore.success(JSON.stringify(result));
		} catch (error) {
			toastStore.error(
				getErrorMessage(error, 'Gagal get accounts SQLite. Jalankan lewat Tauri dev.')
			);
		}
	}

	async function handleTestSqliteCreateEmail() {
		try {
			const suffix = Date.now();
			const result = await createEmailInTauri({
				label: `Debug Email ${suffix}`,
				address: `debug-${suffix}@example.test`,
				provider: 'Debug Provider',
				purpose: 'SQLite create command test',
				twoFactor: true,
				recovery: 'Debug recovery note',
				status: 'audit'
			});

			console.log(result);
			toastStore.success(JSON.stringify(result));
		} catch (error) {
			toastStore.error(
				getErrorMessage(error, 'Gagal create email SQLite. Jalankan lewat Tauri dev.')
			);
		}
	}

	async function handleTestSqliteCreateAccount() {
		try {
			const emails = await getEmailsFromTauri();
			const email = emails[0];

			if (!email) {
				toastStore.error('Buat email SQLite dulu sebelum create account.');
				return;
			}

			const suffix = Date.now();
			const result = await createAccountInTauri({
				name: `Debug Account ${suffix}`,
				category: 'game',
				platform: 'Debug Platform',
				username: `debug-user-${suffix}`,
				userId: `debug-${suffix}`,
				loginMethod: 'Email Password',
				linkedEmailId: email.id,
				passwordLocation: 'Debug password manager',
				twoFactor: false,
				status: 'need_check',
				tags: ['debug', 'sqlite'],
				notes: 'Created from Settings SQLite debug button.'
			});

			console.log(result);
			toastStore.success(JSON.stringify(result));
		} catch (error) {
			toastStore.error(
				getErrorMessage(error, 'Gagal create account SQLite. Jalankan lewat Tauri dev.')
			);
		}
	}

	async function handleTestSqliteUpdateEmail() {
		try {
			const emails = await getEmailsFromTauri();
			const email = emails[0];

			if (!email) {
				toastStore.error('Buat email SQLite dulu sebelum update email.');
				return;
			}

			const suffix = Date.now();
			const result = await updateEmailInTauri(email.id, {
				label: `Updated Email ${suffix}`,
				address: email.address,
				provider: 'Updated Provider',
				purpose: 'SQLite update command test',
				twoFactor: !email.twoFactor,
				recovery: `Updated recovery ${suffix}`,
				status: email.status === 'safe' ? 'audit' : 'safe'
			});

			console.log(result);
			toastStore.success(JSON.stringify(result));
		} catch (error) {
			toastStore.error(
				getErrorMessage(error, 'Gagal update email SQLite. Jalankan lewat Tauri dev.')
			);
		}
	}

	async function handleTestSqliteUpdateAccount() {
		try {
			const accounts = await getAccountsFromTauri();
			const account = accounts[0];

			if (!account) {
				toastStore.error('Buat account SQLite dulu sebelum update account.');
				return;
			}

			const emails = await getEmailsFromTauri();
			const email = emails[0];

			if (!email) {
				toastStore.error('Buat email SQLite dulu sebelum update account.');
				return;
			}

			const suffix = Date.now();
			const result = await updateAccountInTauri(account.id, {
				name: `Updated Account ${suffix}`,
				category: account.category,
				platform: 'Updated Platform',
				username: `updated-user-${suffix}`,
				userId: account.userId ?? `updated-${suffix}`,
				loginMethod: account.loginMethod,
				linkedEmailId: email.id,
				passwordLocation: 'Updated password manager',
				twoFactor: !account.twoFactor,
				status: account.status === 'active' ? 'need_check' : 'active',
				tags: [...account.tags, 'updated'],
				notes: `Updated from Settings SQLite debug button at ${suffix}.`
			});

			console.log(result);
			toastStore.success(JSON.stringify(result));
		} catch (error) {
			toastStore.error(
				getErrorMessage(error, 'Gagal update account SQLite. Jalankan lewat Tauri dev.')
			);
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
		onBackup={handleExportBackup}
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
		{loading}
		{error}
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
		onExportBackup={handleExportBackup}
		onImportBackup={handleImportBackup}
		onResetSample={handleResetSample}
		onClearLocalData={handleClearLocalData}
		onPingRust={handlePingRust}
		onInitDatabase={handleInitDatabase}
		onTestSqliteGetEmails={handleTestSqliteGetEmails}
		onTestSqliteGetAccounts={handleTestSqliteGetAccounts}
		onTestSqliteCreateEmail={handleTestSqliteCreateEmail}
		onTestSqliteCreateAccount={handleTestSqliteCreateAccount}
		onTestSqliteUpdateEmail={handleTestSqliteUpdateEmail}
		onTestSqliteUpdateAccount={handleTestSqliteUpdateAccount}
	/>

	<Toast />
</div>
