<script lang="ts">
	type Props = {
		title?: string;
		description?: string;
		onExport: () => void;
	};

	let {
		title = 'Dashboard Akun',
		description = 'Pantau email induk, akun game, sosmed, dan status keamanan dasar.',
		onExport
	}: Props = $props();
</script>

<header class="topbar">
	<div>
		<p class="eyebrow">Desktop local app</p>
		<h2>{title}</h2>
		<p>{description}</p>
	</div>

	<div class="action-row">
		<button class="secondary" onclick={onExport}>Export</button>
		<button class="primary">+ Tambah Akun</button>
	</div>
</header>
