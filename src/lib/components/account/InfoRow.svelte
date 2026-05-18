<script lang="ts">
	type Props = {
		label: string;
		value: string;
	};

	let { label, value }: Props = $props();
</script>

<div>
	<dt>{label}</dt>
	<dd>{value}</dd>
</div>
