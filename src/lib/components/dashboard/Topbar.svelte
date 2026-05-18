<script lang="ts">
	type Props = {
		onExport: () => void;
	};

	let { onExport }: Props = $props();
</script>

<header class="topbar">
	<div>
		<p class="eyebrow">Desktop local app</p>
		<h2>Dashboard Akun</h2>
		<p>Pantau email induk, akun game, sosmed, dan status keamanan dasar.</p>
	</div>

	<div class="action-row">
		<button class="secondary" onclick={onExport}>Export</button>
		<button class="primary">+ Tambah Akun</button>
	</div>
</header>
