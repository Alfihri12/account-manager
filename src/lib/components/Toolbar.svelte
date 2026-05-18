<script lang="ts">
	import type { EmailItem } from '$lib/types/account';

	type Props = {
		emails: EmailItem[];
		search: string;
		selectedCategory: string;
		selectedEmail: string;
	};

	let {
		emails,
		search = $bindable(),
		selectedCategory = $bindable(),
		selectedEmail = $bindable()
	}: Props = $props();
</script>

<section class="toolbar" aria-label="Filter akun">
	<input bind:value={search} type="search" placeholder="Cari akun, username, email, platform..." />

	<select bind:value={selectedCategory}>
		<option value="all">Semua kategori</option>
		<option value="game">Game</option>
		<option value="sosmed">Sosmed</option>
		<option value="dev">Dev</option>
		<option value="freelance">Freelance</option>
		<option value="education">Education</option>
	</select>

	<select bind:value={selectedEmail}>
		<option value="all">Semua email</option>
		{#each emails as email (email.id)}
			<option value={email.id}>{email.label}</option>
		{/each}
	</select>
</section>
