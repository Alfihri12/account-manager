<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import type { EmailItem } from '$lib/types/account';

	type Props = {
		emails: EmailItem[];
	};

	let { emails }: Props = $props();
</script>

<section class="email-summary" aria-label="Ringkasan email induk">
	{#each emails as email (email.id)}
		<article>
			<div>
				<h3>{email.label}</h3>
				<p>{email.address}</p>
			</div>

			<dl>
				<div>
					<dt>Provider</dt>
					<dd>{email.provider}</dd>
				</div>
				<div>
					<dt>Purpose</dt>
					<dd>{email.purpose}</dd>
				</div>
				<div>
					<dt>Recovery</dt>
					<dd>{email.recovery}</dd>
				</div>
				<div>
					<dt>2FA</dt>
					<dd>{email.twoFactor ? 'Aktif' : 'Belum aktif'}</dd>
				</div>
			</dl>

			<div class="email-summary-footer">
				<strong>{email.accountCount} akun</strong>
				<StatusBadge
					variant={email.status === 'safe' ? 'good' : 'warn'}
					label={email.status === 'safe' ? 'aman' : 'audit'}
				/>
			</div>
		</article>
	{/each}
</section>
