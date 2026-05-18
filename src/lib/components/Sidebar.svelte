<script lang="ts">
	type Props = {
		selectedMenu: string;
		totalAccounts: number;
		totalEmails: number;
		gameCount: number;
		socialCount: number;
		onExport: () => void;
	};

	let {
		selectedMenu = $bindable(),
		totalAccounts,
		totalEmails,
		gameCount,
		socialCount,
		onExport
	}: Props = $props();
</script>

<aside class="sidebar">
	<div class="brand">
		<div class="brand-logo">AM</div>
		<div>
			<h1>Akun Manager</h1>
			<p>Local account tracker</p>
		</div>
	</div>

	<nav class="nav-group" aria-label="Menu utama">
		<p class="nav-label">Menu</p>
		<button
			class:active={selectedMenu === 'dashboard'}
			onclick={() => (selectedMenu = 'dashboard')}
		>
			<span>🏠 Dashboard</span>
			<b>{totalAccounts}</b>
		</button>
		<button class:active={selectedMenu === 'emails'} onclick={() => (selectedMenu = 'emails')}>
			<span>📧 Email Induk</span>
			<b>{totalEmails}</b>
		</button>
		<button class:active={selectedMenu === 'games'} onclick={() => (selectedMenu = 'games')}>
			<span>🎮 Akun Game</span>
			<b>{gameCount}</b>
		</button>
		<button class:active={selectedMenu === 'sosmed'} onclick={() => (selectedMenu = 'sosmed')}>
			<span>🌐 Sosmed</span>
			<b>{socialCount}</b>
		</button>
	</nav>

	<nav class="nav-group" aria-label="Tools">
		<p class="nav-label">Tools</p>
		<button onclick={onExport}><span>📤 Export Obsidian</span></button>
		<button><span>💾 Backup JSON</span></button>
		<button><span>⚙️ Settings</span></button>
	</nav>

	<div class="security-card">
		<strong>Security Mode</strong>
		<p>Password asli tidak disimpan. Cuma lokasi password.</p>
	</div>
</aside>
