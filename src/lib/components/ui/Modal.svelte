<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		open: boolean;
		title: string;
		onClose: () => void;
		children?: Snippet;
	};

	let { open, title, onClose, children }: Props = $props();

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

{#if open}
	<div class="modal-backdrop" role="presentation" onclick={handleBackdropClick}>
		<dialog class="modal-shell" open aria-labelledby="modal-title">
			<header class="modal-header">
				<h2 id="modal-title">{title}</h2>
				<button class="icon-button" type="button" aria-label="Tutup modal" onclick={onClose}>
					×
				</button>
			</header>

			<div class="modal-body">
				{@render children?.()}
			</div>
		</dialog>
	</div>
{/if}
