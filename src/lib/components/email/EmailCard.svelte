<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import type { EmailItem } from '$lib/types/account';

	type Props = {
		email: EmailItem;
		selected: boolean;
		onSelect: () => void;
		onEdit: () => void;
		onDelete: () => void;
	};

	let { email, selected, onSelect, onEdit, onDelete }: Props = $props();
</script>

<article class="email-card" class:selected>
	<button class="card-main" onclick={onSelect}>
		<div>
			<strong>{email.label}</strong>
			<p>{email.accountCount} akun · Recovery: {email.recovery}</p>
		</div>
	</button>

	<div class="card-actions">
		<StatusBadge
			variant={email.status === 'safe' ? 'good' : 'warn'}
			label={email.status === 'safe' ? 'aman' : 'audit'}
		/>
		<button class="mini-button" onclick={onEdit}>Edit</button>
		<button class="mini-button danger" onclick={onDelete}>Hapus</button>
	</div>
</article>
