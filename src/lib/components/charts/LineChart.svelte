<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { SeriesData } from '$lib/utils/types.js';

	export let series: SeriesData[] = [];
	export let title: string = '';
	export let width: number = 600;
	export let height: number = 320;

	const margin = { top: 24, right: 24, bottom: 48, left: 56 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const colors = d3.schemeTableau10;

	let svgEl: SVGSVGElement;

	$: if (svgEl && series.length > 0) draw();

	function draw() {
		d3.select(svgEl).selectAll('*').remove();

		const allPoints = series.flatMap((s) => s.points);
		const labels = series[0]?.points.map((p) => p.label) ?? [];

		const x = d3.scalePoint().domain(labels).range([0, innerWidth]).padding(0.1);
		const y = d3
			.scaleLinear()
			.domain([0, d3.max(allPoints, (p) => p.value) ?? 1])
			.nice()
			.range([innerHeight, 0]);

		const g = d3
			.select(svgEl)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Grid lines
		g.append('g')
			.attr('class', 'grid')
			.call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ''))
			.call((g) => g.select('.domain').remove())
			.call((g) => g.selectAll('line').attr('stroke', '#e5e7eb').attr('stroke-dasharray', '3,3'));

		// Axes
		g.append('g')
			.attr('transform', `translate(0,${innerHeight})`)
			.call(d3.axisBottom(x).tickSize(0))
			.call((g) => g.select('.domain').attr('stroke', '#d1d5db'))
			.call((g) =>
				g
					.selectAll('text')
					.attr('dy', '1.2em')
					.attr('fill', '#6b7280')
					.attr('font-size', '11px')
			);

		g.append('g')
			.call(d3.axisLeft(y).ticks(5))
			.call((g) => g.select('.domain').remove())
			.call((g) =>
				g
					.selectAll('text')
					.attr('fill', '#6b7280')
					.attr('font-size', '11px')
			);

		// Lines
		const line = d3
			.line<{ label: string; value: number }>()
			.x((p) => x(p.label) ?? 0)
			.y((p) => y(p.value))
			.curve(d3.curveMonotoneX);

		series.forEach((s, i) => {
			g.append('path')
				.datum(s.points)
				.attr('fill', 'none')
				.attr('stroke', colors[i % colors.length])
				.attr('stroke-width', 2.5)
				.attr('d', line);

			// Dots
			g.selectAll(`.dot-${i}`)
				.data(s.points)
				.join('circle')
				.attr('cx', (p) => x(p.label) ?? 0)
				.attr('cy', (p) => y(p.value))
				.attr('r', 3.5)
				.attr('fill', colors[i % colors.length]);
		});
	}

	onMount(() => {
		if (series.length > 0) draw();
	});
</script>

<div class="chart-wrap">
	{#if title}
		<h3 class="chart-title">{title}</h3>
	{/if}
	<svg bind:this={svgEl} {width} {height} />
	{#if series.length > 1}
		<div class="legend">
			{#each series as s, i}
				<span class="legend-item">
					<span class="legend-dot" style="background:{colors[i % colors.length]}" />
					{s.name}
				</span>
			{/each}
		</div>
	{/if}
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
		margin: 0 0 0.5rem 0;
	}
	.legend {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
		flex-wrap: wrap;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.8rem;
		color: #6b7280;
	}
	.legend-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		display: inline-block;
	}
</style>
