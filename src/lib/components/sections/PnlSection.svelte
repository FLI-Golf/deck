<script lang="ts">
	import { getAllYears, getYearSlice, extractKpisForYear } from '$lib/utils/transform.js';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import HorizontalBarChart from '$lib/components/charts/HorizontalBarChart.svelte';
	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import KpiCard from '$lib/components/ui/KpiCard.svelte';
	import NoteTooltip from '$lib/components/ui/NoteTooltip.svelte';
	import DetailLink from '$lib/components/ui/DetailLink.svelte';
	import type { ParsedSheet, NotesMap } from '$lib/services/sheets.js';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Full P&L data from the sheet (all years)
	const pnlTable = [
		{ label: 'Sales',                values: [2_824_000,   21_546_200,  35_370_500,  63_512_250,  114_180_625, 183_721_144], bold: false },
		{ label: 'COGS',                 values: [1_800_000,   11_765_000,  14_760_000,  23_511_018,  38_271_105,  58_751_861],  bold: false, deduct: true },
		{ label: 'Gross Profit',         values: [1_024_000,   9_781_200,   20_610_500,  40_001_233,  75_909_520,  124_969_283], bold: true },
		{ label: 'Gross Margin %',       values: [36.26,       45.40,       58.27,       62.98,       66.48,       68.02],       pct: true },
		{ label: 'Sales & Marketing',    values: [709_167,     3_081_850,   3_841_200,   10_377_700,  19_246_500,  29_021_000],  deduct: true },
		{ label: 'Labor',                values: [804_330,     1_831_182,   2_158_914,   2_946_505,   4_270_206,   6_202_747],   deduct: true },
		{ label: 'General & Admin',      values: [1_299_633,   3_627_576,   4_024_200,   4_758_500,   7_397_000,   11_524_000],  deduct: true },
		{ label: 'Total Expenses',       values: [2_813_129,   8_540_608,   10_024_314,  18_082_705,  30_913_706,  46_747_747],  bold: true, deduct: true },
		{ label: 'Net Profit',           values: [-1_789_129,  1_240_592,   10_586_187,  21_918_528,  44_995_814,  78_221_536],  bold: true },
		{ label: 'Net Margin %',         values: [-63.35,      5.76,        29.93,       34.51,       39.41,       42.58],       pct: true },
	];
	const pnlYears = ['2026', '2027', '2028', '2029', '2030', '2031'];

	const pnlDescriptions: Record<string, string> = {
		'Sales':             'Total projected revenue across all streams — sponsorships, tickets, apparel, licensing, subscriptions, gambling, and broadcasting.',
		'COGS':              'Cost of Goods Sold — prize purses, event production, Pure Mobile Productions, and direct tournament costs.',
		'Gross Profit':      'Revenue remaining after direct event costs. Margin expands from 36% in 2026 to 68% in 2031 as fixed production costs are spread across a growing revenue base.',
		'Sales & Marketing': 'Smartboost retainer, in-house social media team, PR (Neology), advertising, Go Throw media partnership, and local outreach programs.',
		'Labor':             'Executive management, department managers, consultation reserves (Gary Santos, SCCG), and department staff payroll.',
		'General & Admin':   'Office leases (SD, Carlsbad, AZ), utilities, hardware/software, legal, insurance, payroll processing, and miscellaneous overhead.',
		'Total Expenses':    'Sum of Sales & Marketing, Labor, and G&A. Grows at a slower rate than revenue, driving margin expansion.',
		'Net Profit':        '2026 is an investment year (−$1.8M). Profitability begins in 2027 ($1.2M) and scales to $78M by 2031 as the league reaches full operational maturity.',
	};

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
			<DetailLink label="View assumptions" on:viewAssumptions={() => dispatch('viewAssumptions')} />
		</KpiCard>
		<KpiCard label="Gross Profit" value={fmt(kpis.latestGrossProfit)}>
			{#if notes['INCOME']}<NoteTooltip note={notes['INCOME']} label="Income" />{/if}
		</KpiCard>
		<KpiCard label="Net Profit" value={fmt(kpis.latestNetProfit)} />
		{#if slice.pnl['Total expenses']}
			<KpiCard label="Total Expenses" value={fmt(slice.pnl['Total expenses'])}>
				{#if notes['EXPENSES']}<NoteTooltip note={notes['EXPENSES']} label="Expenses" />{/if}
				<DetailLink label="View assumptions" on:viewAssumptions={() => dispatch('viewAssumptions')} />
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

<!-- Full P&L summary table -->
<h3 class="context-heading">6-Year P&L Summary</h3>
<div class="pnl-table-wrap">
	<table class="pnl-full-table">
		<thead>
			<tr>
				<th class="th-label"></th>
				{#each pnlYears as y}<th class="th-val">{y}</th>{/each}
			</tr>
		</thead>
		<tbody>
			{#each pnlTable as row}
				<tr class:bold-row={row.bold} class:pct-row={row.pct} class:deduct-row={row.deduct && !row.bold}>
					<td class="td-label">
						{row.label}
						{#if pnlDescriptions[row.label]}
							<p class="td-desc">{pnlDescriptions[row.label]}</p>
						{/if}
					</td>
					{#each row.values as v, i}
						<td class="td-val" class:negative={v < 0}>
							{#if row.pct}
								{v.toFixed(2)}%
							{:else if v < 0}
								−${Math.abs(v / 1_000_000) >= 1 ? (Math.abs(v) / 1_000_000).toFixed(1) + 'M' : (Math.abs(v) / 1_000).toFixed(0) + 'K'}
							{:else}
								${v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + 'M' : (v / 1_000).toFixed(0) + 'K'}
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.context-heading {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9ca3af;
		margin: 0.25rem 0 0.75rem;
	}

	.pnl-table-wrap {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		overflow-x: auto;
		margin-bottom: 1.5rem;
	}

	.pnl-full-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
	}

	.pnl-full-table thead th {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #9ca3af;
		padding: 0.75rem 1rem;
		text-align: right;
		border-bottom: 2px solid #f3f4f6;
		white-space: nowrap;
	}

	.th-label { text-align: left !important; min-width: 200px; }
	.th-val   { min-width: 90px; }

	.pnl-full-table tbody tr:hover td { background: #f9fafb; }

	.td-label {
		padding: 0.65rem 1rem;
		color: #111827;
		font-weight: 500;
		border-bottom: 1px solid #f3f4f6;
		vertical-align: top;
	}

	.td-desc {
		font-size: 0.74rem;
		font-weight: 400;
		color: #6b7280;
		margin: 0.2rem 0 0;
		line-height: 1.5;
		max-width: 380px;
	}

	.td-val {
		padding: 0.65rem 1rem;
		text-align: right;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		color: #374151;
		border-bottom: 1px solid #f3f4f6;
		vertical-align: top;
	}

	.td-val.negative { color: #dc2626; }

	.bold-row .td-label,
	.bold-row .td-val {
		font-weight: 700;
		color: #111827;
		background: #f9fafb;
		border-top: 1px solid #e5e7eb;
	}

	.pct-row .td-label,
	.pct-row .td-val {
		font-size: 0.75rem;
		color: #6b7280;
		background: #fafafa;
		padding-top: 0.3rem;
		padding-bottom: 0.3rem;
	}

	.deduct-row .td-val { color: #6b7280; }

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
