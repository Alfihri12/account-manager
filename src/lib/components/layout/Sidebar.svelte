<script lang="ts">
	import Brand from '$lib/components/navigation/Brand.svelte';
	import NavGroup from '$lib/components/navigation/NavGroup.svelte';

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

	const menuItems = $derived([
		{ id: 'dashboard', label: '🏠 Dashboard', count: totalAccounts },
		{ id: 'emails', label: '📧 Email Induk', count: totalEmails },
		{ id: 'games', label: '🎮 Akun Game', count: gameCount },
		{ id: 'sosmed', label: '🌐 Sosmed', count: socialCount }
	]);

	const toolItems = [
		{ id: 'export', label: '📤 Export Obsidian' },
		{ id: 'backup', label: '💾 Backup JSON' },
		{ id: 'settings', label: '⚙️ Settings' }
	];

	function handleToolSelect(id: string) {
		if (id === 'export') {
			onExport();
		}
	}
</script>

<aside class="sidebar">
	<Brand />

	<NavGroup label="Menu" items={menuItems} {selectedMenu} onSelect={(id) => (selectedMenu = id)} />

	<NavGroup label="Tools" items={toolItems} onSelect={handleToolSelect} />

	<div class="security-card">
		<strong>Security Mode</strong>
		<p>Password asli tidak disimpan. Cuma lokasi password.</p>
	</div>
</aside>
