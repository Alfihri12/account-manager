<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import type { AccountItem, EmailItem } from '$lib/types/account';
	import { getStatusLabel } from '$lib/utils/account';
	import InfoRow from './InfoRow.svelte';

	type Props = {
		account: AccountItem;
		email?: EmailItem;
		onExport: () => void;
	};

	let { account, email, onExport }: Props = $props();
</script>

<aside class="detail-panel">
	<div class="detail-header">
		<div class="avatar">{account.name.slice(0, 1)}</div>
		<StatusBadge
			variant={account.status === 'active' ? 'good' : 'warn'}
			label={getStatusLabel(account.status)}
		/>
	</div>

	<div class="detail-title">
		<h2>{account.name}</h2>
		<p>{account.category} · {email?.label ?? 'Email tidak jelas'}</p>
	</div>

	<section class="detail-section">
		<h3>Informasi Akun</h3>
		<dl>
			<InfoRow label="Platform" value={account.platform} />
			<InfoRow label="Username" value={account.username} />
			<InfoRow label="User ID" value={account.userId ?? '-'} />
			<InfoRow label="Login via" value={account.loginMethod} />
			<InfoRow label="Email" value={email?.label ?? '-'} />
			<InfoRow label="Password" value={`Lihat ${account.passwordLocation}`} />
			<InfoRow label="2FA" value={account.twoFactor ? 'Aktif' : 'Belum aktif'} />
		</dl>
	</section>

	<section class="detail-section">
		<h3>Tags</h3>
		<div class="tag-row">
			{#each account.tags as tag (tag)}
				<span>#{tag}</span>
			{/each}
		</div>
	</section>

	<section class="detail-section">
		<h3>Catatan</h3>
		<p class="note-box">{account.notes}</p>
	</section>

	<div class="detail-actions">
		<button class="secondary">Edit</button>
		<button class="primary" onclick={onExport}>Export MD</button>
	</div>
</aside>
