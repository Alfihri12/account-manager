<script lang="ts">
	import NavItem from './NavItem.svelte';

	type NavEntry = {
		id: string;
		label: string;
		count?: number;
	};

	type Props = {
		label: string;
		items: NavEntry[];
		selectedMenu?: string;
		onSelect?: (id: string) => void;
	};

	let { label, items, selectedMenu, onSelect }: Props = $props();
</script>

<nav class="nav-group" aria-label={label}>
	<p class="nav-label">{label}</p>
	{#each items as item (item.id)}
		<NavItem
			label={item.label}
			count={item.count}
			active={selectedMenu === item.id}
			onSelect={() => onSelect?.(item.id)}
		/>
	{/each}
</nav>
