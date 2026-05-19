<script lang="ts">
	import { useToastStore } from '$lib/stores/toast-store.svelte';

	const toastStore = useToastStore();
</script>

{#if toastStore.toasts.length > 0}
	<div class="toast-stack" aria-live="polite" aria-label="Notifikasi">
		{#each toastStore.toasts as toast (toast.id)}
			<button
				class="toast"
				class:success={toast.variant === 'success'}
				class:error={toast.variant === 'error'}
				type="button"
				onclick={() => toastStore.dismiss(toast.id)}
			>
				{toast.message}
			</button>
		{/each}
	</div>
{/if}
