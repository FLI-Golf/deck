<script lang="ts">
	import { expensesForYear, expensesTotalByYear } from '$lib/utils/transform.js';
	import HorizontalBarChart from '$lib/components/charts/HorizontalBarChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import KpiCard from '$lib/components/ui/KpiCard.svelte';
	import NoteTooltip from '$lib/components/ui/NoteTooltip.svelte';
	import type { ExpensesSheet, NotesMap } from '$lib/services/sheets.js';

	export let sheet: ExpensesSheet;
	export let notes: NotesMap = {};

	let activeYear = sheet.years[0] ?? '';

	$: yearPoints = expensesForYear(sheet, activeYear);
	$: totalByYear = expensesTotalByYear(sheet);

	$: yearTotal = yearPoints.reduce((s, p) => s + p.value, 0);
	$: prevYearIdx = sheet.years.indexOf(activeYear) - 1;
	$: prevTotal = prevYearIdx >= 0
		? expensesForYear(sheet, sheet.years[prevYearIdx]).reduce((s, p) => s + p.value, 0)
		: 0;
	$: growth = prevTotal !== 0 ? ((yearTotal - prevTotal) / Math.abs(prevTotal)) * 100 : undefined;

	function fmt(n: number): string {
		if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
		if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
		return `$${n.toLocaleString()}`;
	}
</script>

<div class="year-tabs" role="tablist">
	{#each sheet.years as year}
		<button role="tab" class="year-tab" class:active={year === activeYear}
			aria-selected={year === activeYear} on:click={() => (activeYear = year)}>
			{year}
		</button>
	{/each}
</div>

<!-- KPIs -->
<div class="kpi-row">
	<KpiCard label="Total Expenses {activeYear}" value={fmt(yearTotal)} delta={growth} deltaLabel="vs prior year">
		{#if notes['EXPENSES']}<NoteTooltip note={notes['EXPENSES']} label="Expenses" />{/if}
	</KpiCard>
	<KpiCard label="Categories" value={yearPoints.length} />
	{#if yearPoints[0]}
		<KpiCard label="Largest Category" value={yearPoints[0].label}>
			{#if notes[yearPoints[0].label] || notes['Total ' + yearPoints[0].label]}
				<NoteTooltip note={notes[yearPoints[0].label] ?? notes['Total ' + yearPoints[0].label]} label={yearPoints[0].label} />
			{/if}
		</KpiCard>
	{/if}
</div>

<!-- Breakdown for selected year -->
<div class="chart-row">
	<div class="chart-section">
		<h3 class="chart-title">
			Expense Categories — {activeYear}
			{#if notes['EXPENSES']}<NoteTooltip note={notes['EXPENSES']} label="Expenses" />{/if}
		</h3>
		<HorizontalBarChart data={yearPoints} title="" color="#f59e0b" width={500} />
		<!-- Per-category notes -->
		{#if yearPoints.some(p => notes[p.label] || notes['Total ' + p.label])}
			<ul class="category-notes">
				{#each yearPoints as p}
					{@const note = notes[p.label] ?? notes['Total ' + p.label]}
					{#if note}
						<li><strong>{p.label.replace(/^Total /, '')}</strong><NoteTooltip {note} label={p.label} /></li>
					{/if}
				{/each}
			</ul>
		{/if}
	</div>
	<div class="chart-section donut-section">
		<DonutChart data={yearPoints.slice(0, 10)} title="Expense Mix — {activeYear}" size={280} />
	</div>
</div>

<!-- Total expenses trend -->
<div class="chart-section">
	<BarChart data={totalByYear} title="Total Expenses by Year" color="#f59e0b" width={820} height={280} />
</div>

<style>
	.year-tabs { display: flex; gap: 0.25rem; border-bottom: 2px solid #e5e7eb; margin-bottom: 1.75rem; }
	.year-tab { padding: 0.5rem 1.1rem; font-size: 0.875rem; font-weight: 500; color: #6b7280; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; cursor: pointer; border-radius: 4px 4px 0 0; transition: color 0.15s, border-color 0.15s; }
	.year-tab:hover { color: #111827; }
	.year-tab.active { color: #2563eb; border-bottom-color: #2563eb; }
	.kpi-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
	.chart-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; overflow-x: auto; }
	.chart-row { display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: flex-start; }
	.chart-row .chart-section { flex: 1; min-width: 300px; margin-bottom: 1.5rem; }
	.donut-section { flex: 0 0 auto; }
	.chart-title { font-size: 0.9rem; font-weight: 600; color: #374151; margin: 0 0 1rem; display: flex; align-items: center; gap: 0.25rem; }
	.category-notes { list-style: none; margin: 1rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.35rem; }
	.category-notes li { display: flex; align-items: center; font-size: 0.8rem; color: #6b7280; gap: 0.1rem; }
	.category-notes li strong { color: #374151; font-weight: 500; }
</style>
