<script lang="ts">
	import { onMount } from 'svelte';
	import { loadSheetData } from '$lib/services/sheets.js';
	import {
		getAllYears,
		getYearSlice,
		extractKpisForYear
	} from '$lib/utils/transform.js';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import HorizontalBarChart from '$lib/components/charts/HorizontalBarChart.svelte';
	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import KpiCard from '$lib/components/ui/KpiCard.svelte';
	import type { ParsedSheet } from '$lib/services/sheets.js';

	let sheet: ParsedSheet | null = null;
	let error = '';
	let loading = true;
	let years: string[] = [];
	let activeYear = '';

	$: slice = sheet && activeYear ? getYearSlice(sheet, activeYear) : null;
	$: kpis = sheet && activeYear ? extractKpisForYear(sheet, activeYear) : null;

	// True only when the selected year has real P&L data
	$: hasPnl = (kpis?.latestSales ?? 0) !== 0
		|| (kpis?.latestGrossProfit ?? 0) !== 0
		|| (kpis?.latestNetProfit ?? 0) !== 0;

	const PNL_METRICS = [
		'Sales', 'COGS', 'Gross profit',
		'Sales & Marketing', 'Labor', 'General & Administrative',
		'Total expenses', 'Net Profit'
	];

	$: pnlBarPoints = slice
		? PNL_METRICS
				.filter((m) => slice!.pnl[m] !== undefined && slice!.pnl[m] !== 0)
				.map((m) => ({ label: m, value: slice!.pnl[m] }))
		: [];

	onMount(async () => {
		try {
			sheet = await loadSheetData();
			years = getAllYears(sheet);
			activeYear = years[0] ?? '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load data';
		} finally {
			loading = false;
		}
	});

	function fmt(n: number): string {
		if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
		if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
		return `$${n.toLocaleString()}`;
	}
</script>

<svelte:head>
	<title>FLI Golf — Financial Projections</title>
</svelte:head>

<main>
	<header>
		<h1>FLI Golf</h1>
		<p class="subtitle">Financial projections</p>
	</header>

	{#if loading}
		<div class="state-message">Loading data…</div>
	{:else if error}
		<div class="error-banner"><strong>Error:</strong> {error}</div>
	{:else if sheet && slice && kpis}

		<!-- Year tabs -->
		<div class="tabs" role="tablist">
			{#each years as year}
				<button
					role="tab"
					class="tab"
					class:active={year === activeYear}
					aria-selected={year === activeYear}
					on:click={() => (activeYear = year)}
				>
					{year}
				</button>
			{/each}
		</div>

		<!-- P&L section — only shown when data exists for this year -->
		{#if hasPnl}
			<section class="kpi-row">
				<KpiCard
					label="Sales"
					value={fmt(kpis.latestSales)}
					delta={kpis.salesGrowth}
					deltaLabel="vs prior year"
				/>
				<KpiCard label="Gross Profit" value={fmt(kpis.latestGrossProfit)} />
				<KpiCard label="Net Profit" value={fmt(kpis.latestNetProfit)} />
				{#if slice.pnl['Total expenses']}
					<KpiCard label="Total Expenses" value={fmt(slice.pnl['Total expenses'])} />
				{/if}
			</section>

			{#if pnlBarPoints.length > 0}
				<section class="chart-section">
					<BarChart
						data={pnlBarPoints}
						title="P&L Breakdown — {activeYear}"
						color="#3b82f6"
						width={820}
						height={300}
					/>
				</section>
			{/if}
		{:else}
			<div class="no-pnl-notice">
				P&L data is not available for {activeYear}.
			</div>
		{/if}

		<!-- Product section -->
		{#if slice.productPoints.length > 0}
			<div class="chart-row">
				<section class="chart-section">
					<HorizontalBarChart
						data={slice.productPoints}
						title="Revenue by Product — {activeYear}"
						color="#8b5cf6"
						width={520}
					/>
				</section>
				<section class="chart-section donut-section">
					<DonutChart
						data={slice.productPoints.slice(0, 10)}
						title="Revenue Mix — {activeYear}"
						size={280}
					/>
				</section>
			</div>
		{:else}
			<div class="state-message" style="padding: 2rem">
				No product revenue data for {activeYear}.
			</div>
		{/if}

	{/if}
</main>

<style>
	:global(*, *::before, *::after) { box-sizing: border-box; }
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f9fafb;
		color: #111827;
	}

	main {
		max-width: 1060px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	header { margin-bottom: 1.5rem; }

	h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0 0 0.25rem 0;
	}

	.subtitle {
		font-size: 0.9rem;
		color: #6b7280;
		margin: 0;
	}

	.tabs {
		display: flex;
		gap: 0.25rem;
		border-bottom: 2px solid #e5e7eb;
		margin-bottom: 1.75rem;
	}

	.tab {
		padding: 0.6rem 1.25rem;
		font-size: 0.9rem;
		font-weight: 500;
		color: #6b7280;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		cursor: pointer;
		border-radius: 4px 4px 0 0;
		transition: color 0.15s, border-color 0.15s;
	}

	.tab:hover { color: #111827; }

	.tab.active {
		color: #2563eb;
		border-bottom-color: #2563eb;
	}

	.kpi-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.75rem;
	}

	.no-pnl-notice {
		font-size: 0.875rem;
		color: #9ca3af;
		margin-bottom: 1.5rem;
		padding: 0.75rem 1rem;
		background: #f3f4f6;
		border-radius: 8px;
	}

	.chart-section {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		overflow-x: auto;
	}

	.chart-row {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		align-items: flex-start;
	}

	.chart-row .chart-section {
		flex: 1;
		min-width: 300px;
		margin-bottom: 0;
	}

	.donut-section {
		flex: 0 0 auto;
	}

	.state-message {
		text-align: center;
		color: #9ca3af;
		font-size: 0.95rem;
	}

	.error-banner {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #991b1b;
		border-radius: 8px;
		padding: 0.75rem 1rem;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}
</style>
