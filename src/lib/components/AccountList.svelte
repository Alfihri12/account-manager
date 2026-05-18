<script lang="ts">
	import type { AccountItem, EmailItem } from '$lib/types/account';
	import { getCategoryIcon } from '$lib/utils/account';

	type Props = {
		accounts: AccountItem[];
		emails: EmailItem[];
		selectedAccountId: number;
	};

	let { accounts, emails, selectedAccountId = $bindable() }: Props = $props();
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
			<button
				class="account-card"
				class:selected={selectedAccountId === account.id}
				onclick={() => (selectedAccountId = account.id)}
			>
				<div>
					<strong>{getCategoryIcon(account.category)} {account.name}</strong>
					<p>{account.username} · {email?.label ?? 'Email tidak jelas'}</p>
				</div>
				<span class:good={account.twoFactor} class:warn={!account.twoFactor}>
					{account.twoFactor ? '2FA aktif' : 'belum 2FA'}
				</span>
			</button>
		{/each}

		{#if accounts.length === 0}
			<div class="empty-state">
				<strong>Nggak ada akun.</strong>
				<p>Filter-mu mungkin terlalu ketat. Longgarkan dikit.</p>
			</div>
		{/if}
	</div>
</div>
