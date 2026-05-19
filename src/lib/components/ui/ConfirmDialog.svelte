<script lang="ts">
	import Modal from './Modal.svelte';

	type Props = {
		open: boolean;
		title: string;
		message: string;
		confirmLabel?: string;
		onCancel: () => void;
		onConfirm: () => void;
	};

	let { open, title, message, confirmLabel = 'Hapus', onCancel, onConfirm }: Props = $props();
</script>

<Modal {open} {title} onClose={onCancel}>
	<div class="confirm-dialog">
		<p>{message}</p>

		<div class="form-actions">
			<button class="secondary" type="button" onclick={onCancel}>Batal</button>
			<button class="danger" type="button" onclick={onConfirm}>{confirmLabel}</button>
		</div>
	</div>
</Modal>
