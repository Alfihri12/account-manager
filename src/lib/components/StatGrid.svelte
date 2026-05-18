<script lang="ts">
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
	<article>
		<span>Email Induk</span>
		<strong>{totalEmails}</strong>
		<p>{safeEmails} aman</p>
	</article>

	<article>
		<span>Total Akun</span>
		<strong>{totalAccounts}</strong>
		<p>Game, sosmed, dev</p>
	</article>

	<article>
		<span>2FA Aktif</span>
		<strong>{activeTwoFactor}</strong>
		<p>{totalAccounts - activeTwoFactor} belum aktif</p>
	</article>

	<article>
		<span>Perlu Audit</span>
		<strong>{needAudit}</strong>
		<p>Jangan pura-pura lupa</p>
	</article>
</section>
