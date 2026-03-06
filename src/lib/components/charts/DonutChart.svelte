<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { DataPoint } from '$lib/utils/types.js';

	export let data: DataPoint[] = [];
	export let title: string = '';
	export let size: number = 280;

	const colors = d3.schemeTableau10;
	const radius = size / 2;
	const innerRadius = radius * 0.55;

	let svgEl: SVGSVGElement;

	$: if (svgEl && data.length > 0) draw();

	function draw() {
		d3.select(svgEl).selectAll('*').remove();

		const pie = d3
			.pie<DataPoint>()
			.value((d) => d.value)
			.sort(null);

		const arc = d3
			.arc<d3.PieArcDatum<DataPoint>>()
			.innerRadius(innerRadius)
			.outerRadius(radius - 4);

		const g = d3
			.select(svgEl)
			.append('g')
			.attr('transform', `translate(${radius},${radius})`);

		g.selectAll('path')
			.data(pie(data))
			.join('path')
			.attr('d', arc)
			.attr('fill', (_, i) => colors[i % colors.length])
			.attr('stroke', '#fff')
			.attr('stroke-width', 2);

		// Center total
		const total = d3.sum(data, (d) => d.value);
		g.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '-0.2em')
			.attr('font-size', '1.4rem')
			.attr('font-weight', '700')
			.attr('fill', '#111827')
			.text(total.toLocaleString());

		g.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', '1.2em')
			.attr('font-size', '0.75rem')
			.attr('fill', '#6b7280')
			.text('total');
	}

	onMount(() => {
		if (data.length > 0) draw();
	});
</script>

<div class="chart-wrap">
	{#if title}
		<h3 class="chart-title">{title}</h3>
	{/if}
	<div class="donut-row">
		<svg bind:this={svgEl} width={size} height={size} />
		<div class="legend">
			{#each data as item, i}
				<div class="legend-item">
					<span class="legend-dot" style="background:{colors[i % colors.length]}" />
					<span class="legend-label">{item.label}</span>
					<span class="legend-value">{item.value.toLocaleString()}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.chart-wrap {
		display: flex;
		flex-direction: column;
	}
	.chart-title {
		font-size: 1rem;
		font-weight: 600;
		color: #111827;
		margin: 0 0 0.5rem 0;
	}
	.donut-row {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.legend {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: #374151;
	}
	.legend-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.legend-label {
		flex: 1;
	}
	.legend-value {
		font-weight: 600;
		color: #111827;
	}
</style>
