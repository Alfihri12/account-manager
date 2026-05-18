<script lang="ts">
	type Props = {
		label: string;
		count?: number;
		active?: boolean;
		onSelect?: () => void;
	};

	let { label, count, active = false, onSelect }: Props = $props();
</script>

<button class:active onclick={onSelect}>
	<span>{label}</span>
	{#if count !== undefined}
		<b>{count}</b>
	{/if}
</button>
