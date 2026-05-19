<script lang="ts">
	type Props = {
		totalEmails: number;
		totalAccounts: number;
		loading: boolean;
		error?: string | null;
		onExportBackup: () => void;
		onImportBackup: (file: File) => void | Promise<void>;
		onResetSample: () => void | Promise<void>;
		onClearLocalData: () => void | Promise<void>;
		onPingRust: () => void | Promise<void>;
		onInitDatabase: () => void | Promise<void>;
	};

	let {
		totalEmails,
		totalAccounts,
		loading,
		error,
		onExportBackup,
		onImportBackup,
		onResetSample,
		onClearLocalData,
		onPingRust,
		onInitDatabase
	}: Props = $props();

	let fileInput = $state<HTMLInputElement>();

	async function handleImport(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		await onImportBackup(file);
		input.value = '';
	}
</script>

<section class="settings-page" aria-label="Settings">
	{#if error}
		<div class="error-banner">{error}</div>
	{/if}

	<section class="settings-section">
		<div>
			<h3>Data</h3>
			<p>{totalEmails} email induk, {totalAccounts} akun tersimpan.</p>
		</div>

		<div class="settings-actions">
			<button class="secondary" disabled={loading} onclick={onExportBackup}
				>Export semua data JSON</button
			>
			<button class="secondary" disabled={loading} onclick={() => fileInput?.click()}>
				Import data dari JSON
			</button>
			<button class="secondary" disabled={loading} onclick={onResetSample}
				>Reset ke sample data</button
			>
			<button class="danger" disabled={loading} onclick={onClearLocalData}
				>Hapus semua data lokal</button
			>
		</div>

		<input
			bind:this={fileInput}
			class="visually-hidden"
			type="file"
			accept="application/json,.json"
			onchange={handleImport}
		/>
	</section>

	<section class="settings-section">
		<div>
			<h3>Obsidian</h3>
			<p>Pengaturan ini disiapkan untuk fase export folder berikutnya.</p>
		</div>

		<div class="settings-grid">
			<label>
				<span>Folder export default</span>
				<input type="text" value="exports/" readonly />
			</label>
			<label>
				<span>Format nama file</span>
				<input type="text" value="{name}.md" readonly />
			</label>
			<label class="toggle-field">
				<input type="checkbox" checked readonly />
				<span>Pisah folder Email/Game/Sosmed</span>
			</label>
		</div>
	</section>

	<section class="settings-section">
		<div>
			<h3>Security</h3>
			<p>Mode password: lokasi saja. Jangan simpan password asli di aplikasi ini.</p>
		</div>
	</section>

	<section class="settings-section">
		<div>
			<h3>Tauri Bridge</h3>
			<p>Tes koneksi frontend ke Rust dan inisialisasi SQLite awal.</p>
		</div>

		<div class="settings-actions">
			<button class="secondary" disabled={loading} onclick={onPingRust}>Test Rust ping</button>
			<button class="secondary" disabled={loading} onclick={onInitDatabase}
				>Test database init</button
			>
		</div>
	</section>
</section>
