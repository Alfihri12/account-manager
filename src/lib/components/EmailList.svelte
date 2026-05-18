<script lang="ts">
	import type { EmailItem } from '$lib/types/account';

	type Props = {
		emails: EmailItem[];
		selectedEmail: string;
	};

	let { emails, selectedEmail = $bindable() }: Props = $props();
</script>

<div class="panel email-panel">
	<div class="panel-header">
		<div>
			<h3>Email Induk</h3>
			<p>Relasi email ke akun</p>
		</div>
		<button class="mini-button">+ Email</button>
	</div>

	<div class="list">
		{#each emails as email (email.id)}
			<button
				class="email-card"
				class:selected={selectedEmail === String(email.id)}
				onclick={() => (selectedEmail = String(email.id))}
			>
				<div>
					<strong>{email.label}</strong>
					<p>{email.accountCount} akun · Recovery: {email.recovery}</p>
				</div>
				<span class:good={email.status === 'safe'} class:warn={email.status === 'audit'}>
					{email.status === 'safe' ? 'aman' : 'audit'}
				</span>
			</button>
		{/each}
	</div>
</div>
