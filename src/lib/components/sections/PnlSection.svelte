<script lang="ts">
	import { getAllYears, getYearSlice, extractKpisForYear } from '$lib/utils/transform.js';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import HorizontalBarChart from '$lib/components/charts/HorizontalBarChart.svelte';
	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import KpiCard from '$lib/components/ui/KpiCard.svelte';
	import NoteTooltip from '$lib/components/ui/NoteTooltip.svelte';
	import type { ParsedSheet, NotesMap } from '$lib/services/sheets.js';

	export let sheet: ParsedSheet;
	export let notes: NotesMap = {};

	let years = getAllYears(sheet);
	let activeYear = years[0] ?? '';

	$: slice = getYearSlice(sheet, activeYear);
	$: kpis = extractKpisForYear(sheet, activeYear);
	$: hasPnl = kpis.latestSales !== 0 || kpis.latestGrossProfit !== 0 || kpis.latestNetProfit !== 0;

	function fmt(n: number): string {
		if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
		if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
		return `$${n.toLocaleString()}`;
	}
</script>

<div class="year-tabs" role="tablist">
	{#each years as year}
		<button role="tab" class="year-tab" class:active={year === activeYear}
			aria-selected={year === activeYear} on:click={() => (activeYear = year)}>
			{year}
		</button>
	{/each}
</div>

{#if hasPnl}
	<div class="kpi-row">
		<KpiCard label="Sales" value={fmt(kpis.latestSales)} delta={kpis.salesGrowth} deltaLabel="vs prior year">
			{#if notes['Total Revenue']}<NoteTooltip note={notes['Total Revenue']} label="Sales" />{/if}
		</KpiCard>
		<KpiCard label="Gross Profit" value={fmt(kpis.latestGrossProfit)}>
			{#if notes['INCOME']}<NoteTooltip note={notes['INCOME']} label="Income" />{/if}
		</KpiCard>
		<KpiCard label="Net Profit" value={fmt(kpis.latestNetProfit)} />
		{#if slice.pnl['Total expenses']}
			<KpiCard label="Total Expenses" value={fmt(slice.pnl['Total expenses'])}>
				{#if notes['EXPENSES']}<NoteTooltip note={notes['EXPENSES']} label="Expenses" />{/if}
			</KpiCard>
		{/if}
	</div>

	{#if slice.pnlPoints.length > 0}
		<div class="chart-section">
			<BarChart data={slice.pnlPoints} title="P&L Breakdown — {activeYear}" color="#3b82f6" width={820} height={300} />
		</div>
	{/if}
{:else}
	<p class="no-data">P&L data is not available for {activeYear}.</p>
{/if}

{#if slice.productPoints.length > 0}
	<div class="chart-row">
		<div class="chart-section">
			<HorizontalBarChart data={slice.productPoints} title="Revenue by Product — {activeYear}" color="#8b5cf6" width={500} />
		</div>
		<div class="chart-section donut-section">
			<DonutChart data={slice.productPoints.slice(0, 10)} title="Revenue Mix — {activeYear}" size={280} />
		</div>
	</div>
{/if}

<style>
	.year-tabs { display: flex; gap: 0.25rem; border-bottom: 2px solid #e5e7eb; margin-bottom: 1.75rem; }
	.year-tab { padding: 0.5rem 1.1rem; font-size: 0.875rem; font-weight: 500; color: #6b7280; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; cursor: pointer; border-radius: 4px 4px 0 0; transition: color 0.15s, border-color 0.15s; }
	.year-tab:hover { color: #111827; }
	.year-tab.active { color: #2563eb; border-bottom-color: #2563eb; }
	.kpi-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
	.no-data { font-size: 0.875rem; color: #9ca3af; background: #f3f4f6; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1.5rem; }
	.chart-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; overflow-x: auto; }
	.chart-row { display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: flex-start; }
	.chart-row .chart-section { flex: 1; min-width: 300px; margin-bottom: 0; }
	.donut-section { flex: 0 0 auto; }
</style>
