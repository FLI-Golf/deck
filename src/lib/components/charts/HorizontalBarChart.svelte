<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { DataPoint } from '$lib/utils/types.js';

	export let data: DataPoint[] = [];
	export let title: string = '';
	export let color: string = '#3b82f6';
	export let width: number = 560;
	/** Height is derived from the number of bars — no need to set manually. */

	const BAR_HEIGHT = 28;
	const margin = { top: 16, right: 80, bottom: 24, left: 180 };

	$: innerWidth = width - margin.left - margin.right;
	$: innerHeight = data.length * BAR_HEIGHT;
	$: height = innerHeight + margin.top + margin.bottom;

	let svgEl: SVGSVGElement;

	$: if (svgEl && data.length > 0) draw();

	function draw() {
		d3.select(svgEl).selectAll('*').remove();

		const x = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value) ?? 1])
			.nice()
			.range([0, innerWidth]);

		const y = d3
			.scaleBand()
			.domain(data.map((d) => d.label))
			.range([0, innerHeight])
			.padding(0.25);

		const g = d3
			.select(svgEl)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Grid lines
		g.append('g')
			.call(d3.axisTop(x).ticks(4).tickSize(-innerHeight).tickFormat(() => ''))
			.call((g) => g.select('.domain').remove())
			.call((g) => g.selectAll('line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'));

		// X axis (top)
		g.append('g')
			.call(
				d3.axisTop(x).ticks(4).tickFormat((d) => {
					const n = +d;
					if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
					if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
					return `$${n}`;
				})
			)
			.call((g) => g.select('.domain').remove())
			.call((g) =>
				g.selectAll('text').attr('fill', '#6b7280').attr('font-size', '11px')
			);

		// Y axis (labels)
		g.append('g')
			.call(d3.axisLeft(y).tickSize(0))
			.call((g) => g.select('.domain').remove())
			.call((g) =>
				g
					.selectAll('text')
					.attr('fill', '#374151')
					.attr('font-size', '12px')
					.attr('dx', '-0.5em')
					.attr('text-anchor', 'end')
			);

		// Bars
		g.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('y', (d) => y(d.label) ?? 0)
			.attr('x', 0)
			.attr('height', y.bandwidth())
			.attr('width', (d) => x(d.value))
			.attr('fill', color)
			.attr('rx', 3);

		// Value labels
		g.selectAll('.val-label')
			.data(data)
			.join('text')
			.attr('class', 'val-label')
			.attr('x', (d) => x(d.value) + 6)
			.attr('y', (d) => (y(d.label) ?? 0) + y.bandwidth() / 2)
			.attr('dy', '0.35em')
			.attr('font-size', '11px')
			.attr('fill', '#6b7280')
			.text((d) => {
				if (d.value >= 1_000_000) return `$${(d.value / 1_000_000).toFixed(1)}M`;
				if (d.value >= 1_000) return `$${(d.value / 1_000).toFixed(0)}K`;
				return `$${d.value}`;
			});
	}

	onMount(() => {
		if (data.length > 0) draw();
	});
</script>

<div class="chart-wrap">
	{#if title}
		<h3 class="chart-title">{title}</h3>
	{/if}
	<svg bind:this={svgEl} {width} {height} />
</div>

<style>
	.chart-wrap {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.chart-title {
		font-size: 1rem;
		font-weight: 600;
		color: #111827;
		margin: 0 0 0.75rem 0;
	}
</style>
