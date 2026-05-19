<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { getCategoryIcon } from '$lib/utils/account';
	import type { AccountItem, EmailItem } from '$lib/types/account';

	type Props = {
		emails: EmailItem[];
		accounts: AccountItem[];
		selectedEmail: string;
	};

	let { emails, accounts, selectedEmail }: Props = $props();

	const selectedEmailItem = $derived.by(() => {
		const selectedId = Number(selectedEmail);
		return emails.find((email) => email.id === selectedId) ?? emails[0];
	});

	const linkedAccounts = $derived.by(() => {
		if (!selectedEmailItem) return [];

		return accounts.filter((account) => account.linkedEmailId === selectedEmailItem.id);
	});

	const gameAccounts = $derived(linkedAccounts.filter((account) => account.category === 'game'));
	const socialAccounts = $derived(
		linkedAccounts.filter((account) => account.category === 'sosmed')
	);
	const accountsWithoutTwoFactor = $derived(linkedAccounts.filter((account) => !account.twoFactor));
	const accountsNeedCheck = $derived(
		linkedAccounts.filter((account) => account.status === 'need_check' || !account.twoFactor)
	);
</script>

<section class="email-summary" aria-label="Ringkasan email induk">
	{#if selectedEmailItem}
		<article>
			<div>
				<h3>{selectedEmailItem.label}</h3>
				<p>{selectedEmailItem.address}</p>
			</div>

			<dl>
				<div>
					<dt>Provider</dt>
					<dd>{selectedEmailItem.provider}</dd>
				</div>
				<div>
					<dt>Purpose</dt>
					<dd>{selectedEmailItem.purpose}</dd>
				</div>
				<div>
					<dt>Recovery</dt>
					<dd>{selectedEmailItem.recovery}</dd>
				</div>
				<div>
					<dt>2FA</dt>
					<dd>{selectedEmailItem.twoFactor ? 'Aktif' : 'Belum aktif'}</dd>
				</div>
			</dl>

			<div class="email-summary-footer">
				<strong>{linkedAccounts.length} akun terhubung</strong>
				<StatusBadge
					variant={selectedEmailItem.status === 'safe' ? 'good' : 'warn'}
					label={selectedEmailItem.status === 'safe' ? 'aman' : 'audit'}
				/>
			</div>
		</article>

		<article>
			<h3>Relasi Akun</h3>
			<div class="relation-stats">
				<span>{gameAccounts.length} game</span>
				<span>{socialAccounts.length} sosmed</span>
				<span>{accountsWithoutTwoFactor.length} tanpa 2FA</span>
				<span>{accountsNeedCheck.length} perlu dicek</span>
			</div>

			<div class="relation-section">
				<h4>Semua akun terhubung</h4>
				{#if linkedAccounts.length > 0}
					<ul class="relation-list">
						{#each linkedAccounts as account (account.id)}
							<li>
								<span>{getCategoryIcon(account.category)} {account.name}</span>
								<StatusBadge
									variant={account.twoFactor ? 'good' : 'warn'}
									label={account.twoFactor ? '2FA aktif' : 'belum 2FA'}
								/>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="muted">Belum ada akun yang terhubung ke email ini.</p>
				{/if}
			</div>

			<div class="relation-section">
				<h4>Akun tanpa 2FA / perlu dicek</h4>
				{#if accountsNeedCheck.length > 0}
					<ul class="relation-list">
						{#each accountsNeedCheck as account (account.id)}
							<li>
								<span>{account.name}</span>
								<StatusBadge
									variant="warn"
									label={account.twoFactor ? 'perlu dicek' : 'tanpa 2FA'}
								/>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="muted">Aman. Tidak ada akun bermasalah di email ini.</p>
				{/if}
			</div>
		</article>
	{:else}
		<article>
			<h3>Belum ada email induk.</h3>
			<p>Tambahkan email induk dulu untuk melihat relasi akun.</p>
		</article>
	{/if}
</section>
