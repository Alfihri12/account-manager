<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import type { AccountItem, EmailItem } from '$lib/types/account';
	import { getCategoryIcon } from '$lib/utils/account';

	type Props = {
		account: AccountItem;
		email?: EmailItem;
		selected: boolean;
		onSelect: () => void;
	};

	let { account, email, selected, onSelect }: Props = $props();
</script>

<button class="account-card" class:selected onclick={onSelect}>
	<div>
		<strong>{getCategoryIcon(account.category)} {account.name}</strong>
		<p>{account.username} · {email?.label ?? 'Email tidak jelas'}</p>
	</div>

	<StatusBadge
		variant={account.twoFactor ? 'good' : 'warn'}
		label={account.twoFactor ? '2FA aktif' : 'belum 2FA'}
	/>
</button>
