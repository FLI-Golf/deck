<script lang="ts">
	import { onMount } from 'svelte';
	import { loadSheetData } from '$lib/services/sheets.js';
	import {
		pnlToSeries,
		pnlMetricToPoints,
		productBreakdownPoints,
		extractKpis
	} from '$lib/utils/transform.js';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import KpiCard from '$lib/components/ui/KpiCard.svelte';
	import type { DataPoint, SeriesData } from '$lib/utils/types.js';
	import type { ParsedSheet } from '$lib/services/sheets.js';

	let sheet: ParsedSheet | null = null;
	let error = '';
	let loading = true;

	// Derived chart data
	let revenueSeries: SeriesData[] = [];
	let profitSeries: SeriesData[] = [];
	let salesPoints: DataPoint[] = [];
	let productPoints: DataPoint[] = [];
	let kpis = { latestSales: 0, latestNetProfit: 0, latestGrossProfit: 0, latestYear: '', salesGrowth: undefined as number | undefined };

	onMount(async () => {
		try {
			sheet = await loadSheetData();
			revenueSeries = pnlToSeries(sheet, ['Sales', 'Gross profit', 'Net Profit']);
			profitSeries = pnlToSeries(sheet, ['Total expenses', 'Net Profit']);
			salesPoints = pnlMetricToPoints(sheet, 'Sales');
			productPoints = productBreakdownPoints(sheet);
			kpis = extractKpis(sheet);
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
		<p class="subtitle">Financial projections {sheet ? `· ${sheet.years[0]}–${sheet.years[sheet.years.length - 1]}` : ''}</p>
	</header>

	{#if loading}
		<div class="state-message">Loading data…</div>
	{:else if error}
		<div class="error-banner"><strong>Error:</strong> {error}</div>
	{:else if sheet}
		<!-- KPI row -->
		<section class="kpi-row">
			<KpiCard label="Sales {kpis.latestYear}" value={fmt(kpis.latestSales)} delta={kpis.salesGrowth} deltaLabel="vs prior year" />
			<KpiCard label="Gross Profit {kpis.latestYear}" value={fmt(kpis.latestGrossProfit)} />
			<KpiCard label="Net Profit {kpis.latestYear}" value={fmt(kpis.latestNetProfit)} />
		</section>

		<!-- Revenue trend -->
		<section class="chart-section">
			<LineChart series={revenueSeries} title="Revenue, Gross Profit & Net Profit" width={760} height={340} />
		</section>

		<!-- Sales bar + product donut -->
		<div class="chart-row">
			<section class="chart-section">
				<BarChart data={salesPoints} title="Projected Sales by Year" color="#3b82f6" width={420} height={280} />
			</section>
			<section class="chart-section">
				<DonutChart data={productPoints.slice(0, 10)} title="Revenue Mix (latest year)" size={260} />
			</section>
		</div>

		<!-- Expenses vs profit -->
		<section class="chart-section">
			<BarChart data={pnlMetricToPoints(sheet, 'Total expenses')} title="Total Expenses by Year" color="#f59e0b" width={760} height={260} />
		</section>
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
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	header { margin-bottom: 2rem; }

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

	.state-message {
		padding: 3rem;
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

	.kpi-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 2rem;
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
	}

	.chart-row .chart-section {
		flex: 1;
		min-width: 280px;
		margin-bottom: 1.5rem;
	}
</style>
