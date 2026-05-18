<script lang="ts">
	import StatCard from './StatCard.svelte';

	type Props = {
		totalEmails: number;
		totalAccounts: number;
		activeTwoFactor: number;
		needAudit: number;
		safeEmails: number;
	};

	let { totalEmails, totalAccounts, activeTwoFactor, needAudit, safeEmails }: Props = $props();
</script>

<section class="stats-grid" aria-label="Ringkasan akun">
	<StatCard label="Email Induk" value={totalEmails} note={`${safeEmails} aman`} />
	<StatCard label="Total Akun" value={totalAccounts} note="Game, sosmed, dev" />
	<StatCard
		label="2FA Aktif"
		value={activeTwoFactor}
		note={`${totalAccounts - activeTwoFactor} belum aktif`}
	/>
	<StatCard label="Perlu Audit" value={needAudit} note="Jangan pura-pura lupa" />
</section>
