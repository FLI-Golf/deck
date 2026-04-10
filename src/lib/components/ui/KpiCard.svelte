<script lang="ts">
	export let label: string = '';
	export let value: string | number = '';
	export let unit: string = '';
	/** Positive delta shown in green, negative in red, zero/undefined neutral */
	export let delta: number | undefined = undefined;
	export let deltaLabel: string = 'vs prior period';
</script>

<div class="kpi-card">
	<p class="kpi-label">{label}<slot /></p>
	<p class="kpi-value">
		{typeof value === 'number' ? value.toLocaleString() : value}
		{#if unit}<span class="kpi-unit">{unit}</span>{/if}
	</p>
	{#if delta !== undefined}
		<p class="kpi-delta" class:positive={delta > 0} class:negative={delta < 0}>
			{delta > 0 ? '+' : ''}{delta.toFixed(1)}%
			<span class="kpi-delta-label">{deltaLabel}</span>
		</p>
	{/if}
</div>

<style>
	.kpi-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		min-width: 160px;
	}
	.kpi-label {
		font-size: 0.78rem;
		font-weight: 500;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 0.35rem 0;
		display: flex;
		align-items: center;
	}
	.kpi-value {
		font-size: 2rem;
		font-weight: 700;
		color: #111827;
		margin: 0;
		line-height: 1.1;
	}
	.kpi-unit {
		font-size: 1rem;
		font-weight: 400;
		color: #6b7280;
		margin-left: 0.15rem;
	}
	.kpi-delta {
		font-size: 0.8rem;
		margin: 0.4rem 0 0 0;
		color: #6b7280;
	}
	.kpi-delta.positive {
		color: #16a34a;
	}
	.kpi-delta.negative {
		color: #dc2626;
	}
	.kpi-delta-label {
		color: #9ca3af;
		margin-left: 0.25rem;
	}
</style>
