<script lang="ts">
	import type { EmailFormData, EmailItem } from '$lib/types/account';
	import { untrack } from 'svelte';

	type Errors = Partial<Record<keyof EmailFormData, string>>;

	type Props = {
		email?: EmailItem;
		onSubmit: (data: EmailFormData) => void | Promise<void>;
		onCancel: () => void;
	};

	let { email, onSubmit, onCancel }: Props = $props();

	const initial = untrack(() => ({
		label: email?.label ?? '',
		address: email?.address ?? '',
		provider: email?.provider ?? 'Gmail',
		purpose: email?.purpose ?? '',
		twoFactor: email?.twoFactor ?? false,
		recovery: email?.recovery ?? '',
		status: email?.status ?? 'safe'
	}));

	let label = $state(initial.label);
	let address = $state(initial.address);
	let provider = $state(initial.provider);
	let purpose = $state(initial.purpose);
	let twoFactor = $state(initial.twoFactor);
	let recovery = $state(initial.recovery);
	let status = $state<EmailFormData['status']>(initial.status);
	let errors = $state<Errors>({});

	function validate() {
		const nextErrors: Errors = {};

		if (!label.trim()) nextErrors.label = 'Label email wajib diisi.';
		if (!address.trim()) nextErrors.address = 'Alamat email wajib diisi.';
		if (!status) nextErrors.status = 'Status wajib dipilih.';

		errors = nextErrors;

		return Object.keys(nextErrors).length === 0;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!validate()) {
			return;
		}

		await onSubmit({
			label,
			address,
			provider,
			purpose,
			twoFactor,
			recovery,
			status
		});
	}
</script>

<form class="entity-form" onsubmit={handleSubmit}>
	<label>
		<span>Label email</span>
		<input bind:value={label} type="text" placeholder="Gmail Gaming" />
		{#if errors.label}<small>{errors.label}</small>{/if}
	</label>

	<label>
		<span>Alamat email</span>
		<input bind:value={address} type="email" placeholder="gaming@example.com" />
		{#if errors.address}<small>{errors.address}</small>{/if}
	</label>

	<label>
		<span>Provider</span>
		<input bind:value={provider} type="text" placeholder="Gmail, Outlook, Proton..." />
	</label>

	<label>
		<span>Purpose</span>
		<input bind:value={purpose} type="text" placeholder="Gaming, development, akun lama..." />
	</label>

	<label>
		<span>Recovery</span>
		<input bind:value={recovery} type="text" placeholder="Gmail utama, nomor HP, belum jelas..." />
	</label>

	<label>
		<span>Status</span>
		<select bind:value={status}>
			<option value="safe">Aman</option>
			<option value="audit">Audit</option>
		</select>
		{#if errors.status}<small>{errors.status}</small>{/if}
	</label>

	<label class="toggle-field form-wide">
		<input bind:checked={twoFactor} type="checkbox" />
		<span>2FA aktif</span>
	</label>

	<div class="form-actions form-wide">
		<button class="secondary" type="button" onclick={onCancel}>Batal</button>
		<button class="primary" type="submit">Simpan</button>
	</div>
</form>
