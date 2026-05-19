<script lang="ts">
	import EmailCard from './EmailCard.svelte';
	import type { EmailItem } from '$lib/types/account';

	type Props = {
		emails: EmailItem[];
		selectedEmail: string;
		onCreate: () => void;
		onEdit: (email: EmailItem) => void;
		onDelete: (email: EmailItem) => void;
	};

	let { emails, selectedEmail = $bindable(), onCreate, onEdit, onDelete }: Props = $props();
</script>

<div class="panel email-panel">
	<div class="panel-header">
		<div>
			<h3>Email Induk</h3>
			<p>Relasi email ke akun</p>
		</div>
		<button class="mini-button" onclick={onCreate}>+ Email</button>
	</div>

	<div class="list">
		{#each emails as email (email.id)}
			<EmailCard
				{email}
				selected={selectedEmail === String(email.id)}
				onSelect={() => (selectedEmail = String(email.id))}
				onEdit={() => onEdit(email)}
				onDelete={() => onDelete(email)}
			/>
		{/each}
	</div>
</div>
