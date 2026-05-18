<script lang="ts">
	import type { AccountItem, EmailItem } from '$lib/types/account';
	import { getStatusLabel } from '$lib/utils/account';

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
		<span class:good={account.status === 'active'} class:warn={account.status === 'need_check'}>
			{getStatusLabel(account.status)}
		</span>
	</div>

	<div class="detail-title">
		<h2>{account.name}</h2>
		<p>{account.category} · {email?.label ?? 'Email tidak jelas'}</p>
	</div>

	<section class="detail-section">
		<h3>Informasi Akun</h3>
		<dl>
			<div>
				<dt>Platform</dt>
				<dd>{account.platform}</dd>
			</div>
			<div>
				<dt>Username</dt>
				<dd>{account.username}</dd>
			</div>
			<div>
				<dt>User ID</dt>
				<dd>{account.userId ?? '-'}</dd>
			</div>
			<div>
				<dt>Login via</dt>
				<dd>{account.loginMethod}</dd>
			</div>
			<div>
				<dt>Email</dt>
				<dd>{email?.label ?? '-'}</dd>
			</div>
			<div>
				<dt>Password</dt>
				<dd>Lihat {account.passwordLocation}</dd>
			</div>
			<div>
				<dt>2FA</dt>
				<dd>{account.twoFactor ? 'Aktif' : 'Belum aktif'}</dd>
			</div>
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
