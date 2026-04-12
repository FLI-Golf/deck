<script lang="ts">
	import { expensesForYear, expensesTotalByYear } from '$lib/utils/transform.js';
	import HorizontalBarChart from '$lib/components/charts/HorizontalBarChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import KpiCard from '$lib/components/ui/KpiCard.svelte';
	import NoteTooltip from '$lib/components/ui/NoteTooltip.svelte';
	import DetailLink from '$lib/components/ui/DetailLink.svelte';
	import type { ExpensesSheet, NotesMap } from '$lib/services/sheets.js';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const expYears = ['2026', '2027', '2028', '2029', '2030'];

	// 6-year expense breakdown table (from proforma assumptions sheet)
	const expenseTable = [
		{
			label: 'Advertising',
			values: [100_000, 100_000, 250_000, 300_000, 3_100_000],
			desc: 'Billboards, iHeart Radio, local sports/media outlets, print publications, direct event-market awareness campaigns. Scales significantly in 2030 with international/global broadcast promotion.',
		},
		{
			label: 'Staff Expenses',
			values: [320_098, 894_512, 990_944, 1_449_768, 2_119_285],
			desc: 'Executive & management payroll, department managers, HR, tech support, warehouse workers, social media team, art/design, broadcasting staff training, tribal relations (SCCG), and ER payroll taxes (7.65%).',
		},
		{
			label: 'Department Budgets',
			values: [781_667, 1_475_000, 2_046_500, 7_738_055, 12_555_180],
			desc: 'Smartboost marketing retainer, Neology PR, legal & outside counsel, tech/app development, Deltatrey platform, Brixton trading card costs, and international marketing/PR companies (from 2030).',
		},
		{
			label: 'Buildout Expenses',
			values: [0, 330_000, 70_000, 70_000, 70_000],
			desc: 'AZ course buildout — materials ($250K), tools ($50K), and reserve ($30K) in 2027. Ongoing maintenance budget of $70K/yr from 2028.',
		},
		{
			label: 'Tournament Expenses',
			values: [0, 6_780_000, 7_692_250, 12_190_463, 20_380_925],
			desc: 'On-course branding & print, event staffing, stage & audio production (Pure Mobile), player travel, infrastructure & seating, celebrity/music talent, and prize purses across all 6 annual events.',
		},
		{
			label: 'Documentary Expenses',
			values: [500_000, 575_000, 661_250, 1_322_500, 2_645_000],
			desc: 'Episodes 1–7 (Sunset Series) — Landon Bennetts, Andrew Panza, Rosie Bennetts, video editor, Phoenix field crew (camera operators, production assistants), travel, meals, equipment, and reserves.',
		},
		{
			label: 'Production/Tournament Expenses',
			values: [60_000, 850_000, 915_000, 1_830_000, 3_660_000],
			desc: 'International production — lights & sound ($750K–$3.2M), logistics & design consultants, and executive production staff. Scales with international expansion from 2029.',
		},
		{
			label: 'Overhead Expenses',
			values: [293_000, 1_198_000, 1_343_000, 1_714_500, 2_429_000],
			desc: 'San Diego office ($95K/yr), Pure Mobile production studio (verbal quote — $150K rising to $2M), Scottsdale office ($48K/yr), utilities, and office upgrades.',
		},
		{
			label: 'Internal Tech',
			values: [14_000, 14_000, 14_000, 14_000, 14_000],
			desc: 'Hardware ($10.5K), software ($3K), and internet/phones ($500). Fixed annual budget.',
		},
		{
			label: 'Player sponsorship',
			values: [300_000, 300_000, 300_000, 300_000, 300_000],
			desc: 'MPO and FPO sponsored players — $150,000 each per year. Fixed annual commitment.',
		},
		{
			label: 'Travel & Entertainment',
			values: [60_000, 60_000, 60_000, 60_000, 60_000],
			desc: 'Executive travel for securing league partnerships — flights, hotels, car rental, and miscellaneous. Fixed annual budget.',
		},
		{
			label: 'E-Commerce',
			values: [35_000, 35_000, 35_000, 35_000, 35_000],
			desc: 'Shopping cart inventory — clothing, accessories, bags, and shoes (NEW). Initial order budget per year.',
		},
		{
			label: 'Other Expenses',
			values: [955_000, 955_000, 955_000, 955_000, 955_000],
			desc: 'League insurance ($80K), payroll processing ($5K), employee relocation ($20K), employee insurance ($60K), additional savings reserve ($250K), DGPT ($100K), influencers — ULI, Kona, DGW, Foundation ($240K), and events ($200K).',
		},
	];

	// Map expense category names (after stripping "Total ") to a detail label
	const DETAIL_LINKS: Record<string, string> = {
		'Advertising':                        'Dept budgets',
		'Staff Expenses':                     'Payroll breakdown',
		'Tournament Expenses':                'Event budgets',
		'Documentary Expenses':               'Documentary budget',
		'Production/Tournament Expenses':     'Production budget',
		'Overhead Expenses':                  'Office calendar budget',
		'Internal Tech':                      'Tech budget',
		'Player sponsorship':                 'Player sponsorship',
		'Travel & Entertainment':             'Travel expenses',
		'E-Commerce':                         'E-commerce expenses',
		'Office Upgrades':                    'Office buildout budget',
		'Other Expenses':                     'Misc expenses',
		'Buildout Expenses':                  'AZ course buildout',
		'Department Budgets':                 'Dept budgets',
		'Commsions':                          'Payroll breakdown',
	};

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
		<DetailLink label="View assumptions" on:viewAssumptions={() => dispatch('viewAssumptions')} />
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
		<!-- Per-category notes + detail links -->
		{#if yearPoints.some(p => notes[p.label] || notes['Total ' + p.label] || DETAIL_LINKS[p.label.replace(/^Total /, '')])}
			<ul class="category-notes">
				{#each yearPoints as p}
					{@const shortName = p.label.replace(/^Total /, '')}
					{@const note = notes[p.label] ?? notes['Total ' + p.label]}
					{@const detailLabel = DETAIL_LINKS[shortName]}
					{#if note || detailLabel}
						<li>
							<strong>{shortName}</strong>
							{#if note}<NoteTooltip {note} label={p.label} />{/if}
							{#if detailLabel}<DetailLink label={detailLabel} on:viewAssumptions={() => dispatch('viewAssumptions')} />{/if}
						</li>
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

<!-- Descriptive expense table -->
<h3 class="context-heading">Expense Detail</h3>
<div class="exp-table-wrap">
	<table class="exp-full-table">
		<thead>
			<tr>
				<th class="th-label"></th>
				{#each expYears as y}<th class="th-val">{y}</th>{/each}
			</tr>
		</thead>
		<tbody>
			{#each expenseTable as row}
				<tr>
					<td class="td-label">
						{row.label}
						<p class="td-desc">{row.desc}</p>
					</td>
					{#each row.values as v}
						<td class="td-val">
							{v === 0 ? '—' : v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
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

	.context-heading { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin: 0.25rem 0 0.75rem; }

	.exp-table-wrap { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow-x: auto; margin-bottom: 1.5rem; }

	.exp-full-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }

	.exp-full-table thead th { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; padding: 0.75rem 1rem; text-align: right; border-bottom: 2px solid #f3f4f6; white-space: nowrap; }
	.th-label { text-align: left !important; min-width: 200px; }
	.th-val { min-width: 80px; }

	.exp-full-table tbody tr:hover td { background: #fffbeb; }

	.td-label { padding: 0.65rem 1rem; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
	.td-desc { font-size: 0.74rem; font-weight: 400; color: #6b7280; margin: 0.2rem 0 0; line-height: 1.5; max-width: 380px; }
	.td-val { padding: 0.65rem 1rem; text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; color: #374151; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
	.category-notes { list-style: none; margin: 1rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.35rem; }
	.category-notes li { display: flex; align-items: center; font-size: 0.8rem; color: #6b7280; gap: 0.4rem; }
	.category-notes li strong { color: #374151; font-weight: 500; }
</style>
