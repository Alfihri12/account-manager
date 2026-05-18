<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import type { EmailItem } from '$lib/types/account';

	type Props = {
		email: EmailItem;
		selected: boolean;
		onSelect: () => void;
	};

	let { email, selected, onSelect }: Props = $props();
</script>

<button class="email-card" class:selected onclick={onSelect}>
	<div>
		<strong>{email.label}</strong>
		<p>{email.accountCount} akun · Recovery: {email.recovery}</p>
	</div>

	<StatusBadge
		variant={email.status === 'safe' ? 'good' : 'warn'}
		label={email.status === 'safe' ? 'aman' : 'audit'}
	/>
</button>
