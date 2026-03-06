<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { DataPoint } from '$lib/utils/types.js';

	export let data: DataPoint[] = [];
	export let title: string = '';
	export let color: string = '#3b82f6';
	export let width: number = 600;
	export let height: number = 320;

	const margin = { top: 24, right: 24, bottom: 48, left: 56 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	let svgEl: SVGSVGElement;

	$: if (svgEl && data.length > 0) draw();

	function draw() {
		d3.select(svgEl).selectAll('*').remove();

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.label))
			.range([0, innerWidth])
			.padding(0.3);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value) ?? 1])
			.nice()
			.range([innerHeight, 0]);

		const g = d3
			.select(svgEl)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Grid lines
		g.append('g')
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

		// Bars
		g.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('x', (d) => x(d.label) ?? 0)
			.attr('y', (d) => y(d.value))
			.attr('width', x.bandwidth())
			.attr('height', (d) => innerHeight - y(d.value))
			.attr('fill', color)
			.attr('rx', 3);
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
		margin: 0 0 0.5rem 0;
	}
</style>
