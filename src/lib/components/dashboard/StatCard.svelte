<script lang="ts">
	type Props = {
		label: string;
		value: number;
		note: string;
	};

	let { label, value, note }: Props = $props();
</script>

<article>
	<span>{label}</span>
	<strong>{value}</strong>
	<p>{note}</p>
</article>
