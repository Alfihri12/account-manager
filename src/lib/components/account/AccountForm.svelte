<script lang="ts">
	import type {
		AccountFormData,
		AccountItem,
		Category,
		EmailItem,
		Status
	} from '$lib/types/account';
	import { untrack } from 'svelte';

	type Errors = Partial<Record<keyof AccountFormData, string>>;

	type Props = {
		account?: AccountItem;
		emails: EmailItem[];
		defaultCategory?: Category;
		onSubmit: (data: AccountFormData) => void | Promise<void>;
		onCancel: () => void;
	};

	let { account, emails, defaultCategory = 'game', onSubmit, onCancel }: Props = $props();

	const initial = untrack(() => ({
		name: account?.name ?? '',
		category: account?.category ?? defaultCategory,
		platform: account?.platform ?? '',
		username: account?.username ?? '',
		userId: account?.userId ?? '',
		loginMethod: account?.loginMethod ?? 'Email Password',
		linkedEmailId: account?.linkedEmailId ?? emails[0]?.id ?? 0,
		passwordLocation: account?.passwordLocation ?? '',
		twoFactor: account?.twoFactor ?? false,
		status: account?.status ?? 'active',
		tagsInput: account?.tags.join(', ') ?? '',
		notes: account?.notes ?? ''
	}));

	let name = $state(initial.name);
	let category = $state<Category>(initial.category);
	let platform = $state(initial.platform);
	let username = $state(initial.username);
	let userId = $state(initial.userId);
	let loginMethod = $state(initial.loginMethod);
	let linkedEmailId = $state(initial.linkedEmailId);
	let passwordLocation = $state(initial.passwordLocation);
	let twoFactor = $state(initial.twoFactor);
	let status = $state<Status>(initial.status);
	let tagsInput = $state(initial.tagsInput);
	let notes = $state(initial.notes);
	let errors = $state<Errors>({});

	function validate() {
		const nextErrors: Errors = {};

		if (!name.trim()) nextErrors.name = 'Nama akun wajib diisi.';
		if (!platform.trim()) nextErrors.platform = 'Platform wajib diisi.';
		if (!category) nextErrors.category = 'Kategori wajib dipilih.';
		if (!linkedEmailId) nextErrors.linkedEmailId = 'Email terhubung wajib dipilih.';
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
			name,
			category,
			platform,
			username,
			userId,
			loginMethod,
			linkedEmailId,
			passwordLocation,
			twoFactor,
			status,
			tags: tagsInput
				.split(',')
				.map((tag) => tag.trim())
				.filter(Boolean),
			notes
		});
	}
</script>

<form class="entity-form" onsubmit={handleSubmit}>
	<label>
		<span>Nama akun</span>
		<input bind:value={name} type="text" placeholder="Steam, Discord, GitHub..." />
		{#if errors.name}<small>{errors.name}</small>{/if}
	</label>

	<label>
		<span>Kategori</span>
		<select bind:value={category}>
			<option value="game">Game</option>
			<option value="sosmed">Sosmed</option>
			<option value="dev">Dev</option>
			<option value="freelance">Freelance</option>
			<option value="education">Education</option>
			<option value="other">Other</option>
		</select>
		{#if errors.category}<small>{errors.category}</small>{/if}
	</label>

	<label>
		<span>Platform</span>
		<input bind:value={platform} type="text" placeholder="Steam, Riot, Discord..." />
		{#if errors.platform}<small>{errors.platform}</small>{/if}
	</label>

	<label>
		<span>Username</span>
		<input bind:value={username} type="text" placeholder="username atau handle" />
	</label>

	<label>
		<span>User ID / UID</span>
		<input bind:value={userId} type="text" placeholder="opsional" />
	</label>

	<label>
		<span>Login method</span>
		<input bind:value={loginMethod} type="text" placeholder="Email Password, Google, OAuth..." />
	</label>

	<label>
		<span>Email terhubung</span>
		<select bind:value={linkedEmailId}>
			<option value={0}>Pilih email</option>
			{#each emails as email (email.id)}
				<option value={email.id}>{email.label}</option>
			{/each}
		</select>
		{#if errors.linkedEmailId}<small>{errors.linkedEmailId}</small>{/if}
	</label>

	<label>
		<span>Password location</span>
		<input
			bind:value={passwordLocation}
			type="text"
			placeholder="Bitwarden, Google Password Manager..."
		/>
	</label>

	<label>
		<span>Status</span>
		<select bind:value={status}>
			<option value="active">Aktif</option>
			<option value="need_check">Perlu dicek</option>
			<option value="inactive">Nonaktif</option>
			<option value="lost">Hilang</option>
		</select>
		{#if errors.status}<small>{errors.status}</small>{/if}
	</label>

	<label class="toggle-field">
		<input bind:checked={twoFactor} type="checkbox" />
		<span>2FA aktif</span>
	</label>

	<label class="form-wide">
		<span>Tags</span>
		<input bind:value={tagsInput} type="text" placeholder="gaming, utama, audit" />
	</label>

	<label class="form-wide">
		<span>Catatan</span>
		<textarea bind:value={notes} rows="4" placeholder="Catatan audit atau konteks akun"></textarea>
	</label>

	<div class="form-actions form-wide">
		<button class="secondary" type="button" onclick={onCancel}>Batal</button>
		<button class="primary" type="submit">Simpan</button>
	</div>
</form>
