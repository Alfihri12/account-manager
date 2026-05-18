<script lang="ts">
	import AccountCard from './AccountCard.svelte';
	import type { AccountItem, EmailItem } from '$lib/types/account';

	type Props = {
		emails: EmailItem[];
		accounts: AccountItem[];
		selectedAccountId: number;
	};

	let { emails, accounts, selectedAccountId = $bindable() }: Props = $props();
</script>

<div class="panel account-panel">
	<div class="panel-header">
		<div>
			<h3>Akun</h3>
			<p>{accounts.length} akun ditemukan</p>
		</div>
		<button class="mini-button">Sort</button>
	</div>

	<div class="list">
		{#each accounts as account (account.id)}
			{@const email = emails.find((item) => item.id === account.linkedEmailId)}

			<AccountCard
				{account}
				{email}
				selected={selectedAccountId === account.id}
				onSelect={() => (selectedAccountId = account.id)}
			/>
		{/each}

		{#if accounts.length === 0}
			<div class="empty-state">
				<strong>Nggak ada akun.</strong>
				<p>Filter-mu mungkin terlalu nyebelin. Longgarkan dikit.</p>
			</div>
		{/if}
	</div>
</div>
