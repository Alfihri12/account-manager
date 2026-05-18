<script lang="ts">
	type Variant = 'good' | 'warn';

	type Props = {
		variant: Variant;
		label: string;
	};

	let { variant, label }: Props = $props();
</script>

<span class:good={variant === 'good'} class:warn={variant === 'warn'}>
	{label}
</span>
