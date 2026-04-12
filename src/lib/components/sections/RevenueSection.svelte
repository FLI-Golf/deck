<script lang="ts">
	import { revenueForYear, revenueTotalByYear, revenueProductToSeries } from '$lib/utils/transform.js';
	import HorizontalBarChart from '$lib/components/charts/HorizontalBarChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import KpiCard from '$lib/components/ui/KpiCard.svelte';
	import NoteTooltip from '$lib/components/ui/NoteTooltip.svelte';
	import DetailLink from '$lib/components/ui/DetailLink.svelte';
	import type { RevenueSheet, NotesMap } from '$lib/services/sheets.js';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// ── Revenue context data from funding schedule & subscription docs ────────
	const sponsorTiers = [
		{ tier: 'Tier 1 — Title Sponsors',  slots: 6, phase2: '$2,250,000', phase3s1: '$2,250,000', phase3s2: '$3,500,000', note: '6 slots total' },
		{ tier: 'Tier 2 — Major Sponsors',  slots: 6, phase2: '$1,500,000', phase3s1: '$1,500,000', phase3s2: '$1,150,000', note: '6 slots total' },
		{ tier: 'Tier 3 — Sponsors',        slots: null, phase2: '$1,000,000', phase3s1: '$500,000',   phase3s2: '$1,000,000', note: '' },
		{ tier: 'Tier 4 — Grab Bag / Gifts',slots: null, phase2: '$1,000,000', phase3s1: 'Complete',   phase3s2: '$700,000',   note: '100% sold in Phase 2' },
	];

	const ticketRevenue = [
		{ label: 'Phase 2 — 2027 Presale',   value: '$100,000',   note: '20% tickets presold for 1st tournament' },
		{ label: 'Phase 3 — 2027 Season',    value: '$2,900,000', note: '100% tickets sold for 1st season' },
		{ label: 'Phase 3 — Season 2 Presale', value: '$660,000', note: '20% presold for season 2' },
	];

	const subscriptionGrowth = [
		{ year: '2026', subscribers: '10,000',  revenue: '$238,800' },
		{ year: '2027', subscribers: '40,000',  revenue: '$955,200' },
		{ year: '2028', subscribers: '100,000', revenue: '$2,388,000' },
		{ year: '2029', subscribers: '200,000', revenue: '$4,776,000' },
		{ year: '2030', subscribers: '350,000', revenue: '$8,358,000' },
		{ year: '2031', subscribers: '500,000', revenue: '$11,940,000' },
	];

	const licensingRevenue = [
		{ label: 'Disc License',         value: '$100,000', note: '+ revenue share on disc sales' },
		{ label: 'Bag License',          value: '$100,000', note: '+ revenue share on bags' },
		{ label: 'Clothing / Apparel (Phase 2)', value: '$44,600', note: 'First limited drop' },
		{ label: 'Clothing / Apparel (Phase 3)', value: '$105,314', note: '4 limited drops' },
	];

	// Revenue streams that have corresponding detail in the doc
	const STREAM_LINKS: Record<string, string> = {
		'Ticket Revenue':                  'Event budgets',
		'Food and Beverage Revenue':       'Event budgets',
		'Membership Fees (Website Subscriptions)': 'Dept budgets',
		'FLI Golf Sports Apparel & Accessories':   'E-commerce expenses',
		'FLI Golf League Team Jerseys':            'E-commerce expenses',
		'Fantasy League Fees':             'Dept budgets',
		'Broadcasting/Streaming':          'Dept budgets',
		'General League Licensing':        'Dept budgets',
	};

	export let sheet: RevenueSheet;
	export let notes: NotesMap = {};

	let activeYear = sheet.years[0] ?? '';

	$: yearPoints = revenueForYear(sheet, activeYear);
	$: totalByYear = revenueTotalByYear(sheet);

	// Top products by total across all years for trend line
	$: topProducts = Object.entries(sheet.products)
		.filter(([name]) => name !== 'Column 1')
		.map(([name, vals]) => ({ name, total: vals.reduce((s, v) => s + v, 0) }))
		.sort((a, b) => b.total - a.total)
		.slice(0, 6)
		.map((p) => p.name);

	$: trendSeries = revenueProductToSeries(sheet, topProducts);

	$: yearTotal = yearPoints.reduce((s, p) => s + p.value, 0);
	$: prevYearIdx = sheet.years.indexOf(activeYear) - 1;
	$: prevTotal = prevYearIdx >= 0
		? revenueForYear(sheet, sheet.years[prevYearIdx]).reduce((s, p) => s + p.value, 0)
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
	<KpiCard label="Total Revenue {activeYear}" value={fmt(yearTotal)} delta={growth} deltaLabel="vs prior year">
		{#if notes['Total Revenue']}<NoteTooltip note={notes['Total Revenue']} label="Total Revenue" />{/if}
		<DetailLink label="View assumptions" on:viewAssumptions={() => dispatch('viewAssumptions')} />
	</KpiCard>
	<KpiCard label="Revenue Streams" value={yearPoints.length} />
	{#if yearPoints[0]}
		<KpiCard label="Top Stream" value={yearPoints[0].label}>
			{#if notes[yearPoints[0].label]}
				<NoteTooltip note={notes[yearPoints[0].label]} label={yearPoints[0].label} />
			{/if}
		</KpiCard>
	{/if}
</div>

<!-- Revenue by product for selected year -->
<div class="chart-row">
	<div class="chart-section">
		<h3 class="chart-title">
			Revenue by Product — {activeYear}
			{#if notes['INCOME']}<NoteTooltip note={notes['INCOME']} label="Income" />{/if}
		</h3>
		<HorizontalBarChart data={yearPoints} title="" color="#8b5cf6" width={500} />
		<!-- Per-stream notes + detail links -->
		{#if yearPoints.some(p => notes[p.label] || STREAM_LINKS[p.label])}
			<ul class="stream-notes">
				{#each yearPoints as p}
					{#if notes[p.label] || STREAM_LINKS[p.label]}
						<li>
							<strong>{p.label}</strong>
							{#if notes[p.label]}<NoteTooltip note={notes[p.label]} label={p.label} />{/if}
							{#if STREAM_LINKS[p.label]}<DetailLink label={STREAM_LINKS[p.label]} on:viewAssumptions={() => dispatch('viewAssumptions')} />{/if}
						</li>
					{/if}
				{/each}
			</ul>
		{/if}
	</div>
	<div class="chart-section donut-section">
		<DonutChart data={yearPoints.slice(0, 10)} title="Revenue Mix — {activeYear}" size={280} />
	</div>
</div>

<!-- Total revenue trend -->
<div class="chart-section">
	<BarChart data={totalByYear} title="Total Revenue by Year" color="#3b82f6" width={820} height={280} />
</div>

<!-- Top product trends -->
<div class="chart-section">
	<LineChart series={trendSeries} title="Top 6 Revenue Streams Over Time" width={820} height={320} />
</div>

<!-- Revenue context panels -->
<h3 class="context-heading">Revenue Detail</h3>

<div class="context-grid">

	<!-- Sponsor Tiers -->
	<div class="context-card">
		<h4 class="context-card-title">Sponsor Tiers</h4>
		<table class="ctx-table">
			<thead>
				<tr>
					<th>Tier</th>
					<th>Phase 2</th>
					<th>S1 (Phase 3)</th>
					<th>S2 Presale</th>
				</tr>
			</thead>
			<tbody>
				{#each sponsorTiers as row}
					<tr>
						<td class="ctx-label">{row.tier}{#if row.note} <span class="ctx-note">{row.note}</span>{/if}</td>
						<td class="ctx-val">{row.phase2}</td>
						<td class="ctx-val">{row.phase3s1}</td>
						<td class="ctx-val">{row.phase3s2}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Ticket Revenue -->
	<div class="context-card">
		<h4 class="context-card-title">Ticket Revenue Milestones</h4>
		<table class="ctx-table">
			<tbody>
				{#each ticketRevenue as row}
					<tr>
						<td class="ctx-label">{row.label}</td>
						<td class="ctx-val">{row.value}</td>
						<td class="ctx-note-col">{row.note}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Licensing & Apparel -->
	<div class="context-card">
		<h4 class="context-card-title">Licensing & Apparel</h4>
		<table class="ctx-table">
			<tbody>
				{#each licensingRevenue as row}
					<tr>
						<td class="ctx-label">{row.label}</td>
						<td class="ctx-val">{row.value}</td>
						<td class="ctx-note-col">{row.note}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Subscription Platform -->
	<div class="context-card">
		<h4 class="context-card-title">
			Subscription Platform
			<span class="ctx-badge">$1.99 / mo</span>
		</h4>
		<table class="ctx-table">
			<thead>
				<tr>
					<th>Year</th>
					<th>Subscribers</th>
					<th>Revenue</th>
				</tr>
			</thead>
			<tbody>
				{#each subscriptionGrowth as row}
					<tr>
						<td class="ctx-label">{row.year}</td>
						<td class="ctx-val">{row.subscribers}</td>
						<td class="ctx-val">{row.revenue}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<p class="ctx-footer">2031 enterprise value: <strong>$71M – $119M</strong> at 6–10× multiple</p>
	</div>

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
	.stream-notes { list-style: none; margin: 1rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.35rem; }
	.stream-notes li { display: flex; align-items: center; font-size: 0.8rem; color: #6b7280; gap: 0.4rem; }
	.stream-notes li strong { color: #374151; font-weight: 500; }

	.context-heading {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9ca3af;
		margin: 0.5rem 0 0.75rem;
	}

	.context-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.context-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		overflow-x: auto;
	}

	.context-card-title {
		font-size: 0.88rem;
		font-weight: 600;
		color: #374151;
		margin: 0 0 0.85rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.ctx-badge {
		font-size: 0.7rem;
		font-weight: 600;
		background: #eff6ff;
		color: #2563eb;
		border: 1px solid #bfdbfe;
		border-radius: 4px;
		padding: 0.1rem 0.4rem;
	}

	.ctx-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8rem;
	}

	.ctx-table thead th {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #9ca3af;
		padding: 0 0.5rem 0.4rem;
		text-align: right;
		border-bottom: 1px solid #f3f4f6;
	}

	.ctx-table thead th:first-child { text-align: left; }

	.ctx-table td {
		padding: 0.35rem 0.5rem;
		border-bottom: 1px solid #f9fafb;
		color: #374151;
	}

	.ctx-table tr:last-child td { border-bottom: none; }
	.ctx-table tr:hover td { background: #f9fafb; }

	.ctx-label { text-align: left; color: #111827; }
	.ctx-val { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; min-width: 80px; }
	.ctx-note { font-size: 0.72rem; color: #9ca3af; margin-left: 0.25rem; }
	.ctx-note-col { text-align: left; font-size: 0.72rem; color: #9ca3af; padding-left: 0.5rem; }

	.ctx-footer {
		font-size: 0.75rem;
		color: #6b7280;
		margin: 0.75rem 0 0;
		padding-top: 0.5rem;
		border-top: 1px solid #f3f4f6;
	}
</style>
