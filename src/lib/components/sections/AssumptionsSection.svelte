<script lang="ts">
	const DOC_URL        = 'https://docs.google.com/document/u/0/d/1i3ZIfnpABkf-yJWM0UShhTPgip8_k8j-yWJB0x6rST0/edit';
	const BUDGET_DOC_URL = 'https://docs.google.com/document/d/1MeM3c4Bpq4SlRQCdkguTLkHmehnVHO9yJtk_1Xy8oiA/edit?tab=t.0';
	const YAC_DOC_URL = 'https://docs.google.com/document/d/1LQQJnhGhqaqOoDSRAHQcwiolHqTbhyQO/edit?usp=drive_link';

	const AMENDMENTS_DOC_URL  = 'https://docs.google.com/document/d/1nKRNhcYNOe86K2Jy6HjRXJleh8ke9lLH_AJONEphZWE/edit?tab=t.0';
	const SUBSCRIPTION_DOC_URL = 'https://docs.google.com/document/d/1Izj7bpYGIvpPZkMWxE2nLHKn-NO7ALmj3rjmgCfB09s/edit?tab=t.0';

	const subscription = {
		price: '$1.99 / month',
		annualPerUser: '$23.88',
		positioning: 'A hybrid product combining media access, data platform, betting analytics, fan loyalty, and commerce unlock — not a traditional fan subscription.',
		segments: [
			{ label: 'Core Disc Golf Fans',      desc: 'Exclusive content, merchandise access, ticket priority, collector drops' },
			{ label: 'Betting / Fantasy Users',  desc: 'Advanced player statistics, tournament analytics, betting insights, performance data' },
		],
		growth: [
			{ year: '2026', subscribers: '10,000',  revenue: '$238,800' },
			{ year: '2027', subscribers: '40,000',  revenue: '$955,200' },
			{ year: '2028', subscribers: '100,000', revenue: '$2,388,000' },
			{ year: '2029', subscribers: '200,000', revenue: '$4,776,000' },
			{ year: '2030', subscribers: '350,000', revenue: '$8,358,000' },
			{ year: '2031', subscribers: '500,000', revenue: '$11,940,000' },
		],
		mix2031: [
			{ type: 'Disc Golf Fans',    pct: '60%', users: '300,000' },
			{ type: 'Betting / Fantasy', pct: '40%', users: '200,000' },
		],
		drivers: [
			'Broadcast exposure — each tournament drives new subscriber conversions',
			'Fantasy + betting integration — subscription becomes a utility as betting expands',
			'Merchandise & collector access — early drops, team gear, exclusive releases',
			'Event ecosystem — ticket presales, VIP upgrades, live engagement',
			'International expansion (2030+) — European disc golf markets unlock new subscriber pools',
		],
		comparables: ['ESPN+ (low-cost mass subscription)', 'DraftKings / FanDuel (data-driven engagement)', 'UFC Fight Pass (exclusive content + insider access)', 'Formula 1 TV (direct-to-consumer global platform)'],
		upside: ['Premium betting analytics tiers', 'VIP subscription tiers', 'Real-time player tracking data', 'Digital collectibles / NFTs', 'Fantasy premium tools', 'Insider video + documentary content'],
		valuation: '$11.94M × 6–10x = $71M – $119M enterprise value (2031)',
	};

	const consultationReserves = [
		{ label: 'Gary Santos',                        values: ['$80,000', '$100,000', '$120,000', '$140,000'], note: '+$10,000 expense package each year' },
		{ label: 'SCCG (Tribal Outreach / Marketing)', values: ['$100,000', '$125,000', '$150,000', '$175,000'] },
		{ label: 'Live Production Staff Trainer',      values: ['$10,000',  '$10,000',  '$10,000',  '$10,000'],  note: 'NEW' },
		{ label: 'Total',                              values: ['$200,000', '$245,000', '$290,000', '$335,000'], bold: true },
	];

	const deptBudget = [
		{ label: 'Marketing',          value: '$720,000' },
		{ label: 'Public Relations',   value: '$120,000' },
		{ label: 'Legal',              value: '$50,000'  },
		{ label: 'Advertising',        value: '$50,000'  },
		{ label: 'Tech / App Dev',     value: '$150,000' },
		{ label: 'Total',              value: '$1,090,000', bold: true },
	];

	const warehouseSupplies = [
		{ label: 'Tools / Supplies', value: '$20,000', bold: true },
	];

	const miscExpenses = [
		{ label: 'League Insurance',    value: '$80,000'  },
		{ label: 'Payroll Processing',  value: '$5,000'   },
		{ label: 'Employee Relocation', value: '$20,000'  },
		{ label: 'Employee Insurance',  value: '$60,000'  },
		{ label: 'Additional Savings',  value: '$250,000' },
		{ label: 'DGPT',                value: '$100,000' },
		{ label: 'Influencers',         value: '$240,000', note: 'ULI, Kona, DGW, Foundation' },
		{ label: 'Events',              value: '$200,000' },
		{ label: 'Total',               value: '$955,000', bold: true },
	];

	const years2629 = ['2026', '2027', '2028', '2029'];

	const amendments = {
		date: 'March 2, 2026',
		removals: [
			'Warehouse Worker 1 — removed from 2026 payroll',
			'Warehouse Worker 2 — removed from 2026 payroll',
			'Jim Neely — removed from 2026 payroll',
		],
		payrollChanges: [
			{
				name: 'Oscar Vargas',
				values: [
					{ year: '2026', value: '$3,000' },
					{ year: '2027', value: '$6,000' },
					{ year: '2028', value: '$12,000' },
				],
				note: 'Replaced in 2029 by full-time HR Manager (CA office) at $60K → $64K → $68K (2029–2031)',
			},
			{
				name: 'Robert Feasel',
				values: [
					{ year: '2026', value: '$6,000' },
					{ year: '2027', value: '$12,000' },
					{ year: '2028', value: '$16,000' },
				],
				note: 'Replaced in 2029 by full-time Tech Support Manager (under Dustin, CA office) at $80K → $84K → $88K (2029–2031)',
			},
			{
				name: 'Andrew Panza / CEO',
				values: [
					{ year: '2026', value: '$140,000' },
					{ year: '2027', value: '$140,000' },
				],
				note: '',
			},
			{
				name: 'All Other Executives (Dustin, Tony, Corey, Mark, Gary, Ina)',
				values: [
					{ year: '2026', value: '$90,000' },
					{ year: '2027', value: '$90,000' },
				],
				note: '',
			},
			{
				name: 'President',
				values: [
					{ year: '2026', value: '$100,000' },
				],
				note: '',
			},
			{
				name: 'Logistics Manager (remote) — NEW from 2027',
				values: [
					{ year: '2027', value: '$60,000' },
					{ year: '2028', value: '$65,000' },
					{ year: '2029', value: '$75,000' },
					{ year: '2030', value: '$80,000' },
					{ year: '2031', value: '$85,000' },
				],
				note: '',
			},
		],
		licensing: 'Rename current licensing line to "General League Licensing". Add sub-categories: "Disc License" and "Bag License" — see shared bag and disc documents for year-over-year numbers.',
		productionExpenses: [
			{
				label: 'Lights & Sound',
				values: [
					{ year: '2027', value: '$750,000' },
					{ year: '2028', value: '$800,000' },
					{ year: '2029', value: '$1,000,000' },
					{ year: '2030', value: '$1,100,000' },
					{ year: '2031', value: '$1,200,000' },
				],
			},
			{
				label: 'Executive Production Staff',
				values: [
					{ year: '2026', value: '$60,000' },
					{ year: '2027', value: '$80,000' },
					{ year: '2028', value: '$90,000' },
					{ year: '2029', value: '$150,000' },
					{ year: '2030', value: '$175,000' },
					{ year: '2031', value: '$200,000' },
				],
			},
			{
				label: 'Logistics & Design Consultants',
				values: [
					{ year: '2027', value: '$20,000' },
					{ year: '2028', value: '$25,000' },
					{ year: '2029', value: '$50,000' },
					{ year: '2030', value: '$75,000' },
					{ year: '2031', value: '$100,000' },
				],
			},
		],
		profitAllocation: 'Starting 2029, the three production/tournament expense categories above should equal 20% of profit generated, split: 60% Marketing, 25% Advertising, 15% PR.',
	};

	const yac = {
		date:    'January 6, 2026',
		parties: 'FLI Golf League ("FGL") and Young America Capital, LLC ("YAC")',
		role:    'YAC engaged as exclusive investment banking advisor to facilitate Financing Transactions (private placement of equity/debt/SAFEs) and/or Sale Transactions.',
		fees: [
			{ label: 'Monthly Service Fee',        value: '$6,800 / mo',  note: 'First 4 months — covers admin, due diligence & compliance' },
			{ label: 'Transaction Fee — Equity / SAFE / Convertible', value: '6.0%', note: 'Of gross proceeds; 33% reduction for Company-sourced investors' },
			{ label: 'Transaction Fee — Senior Debt', value: '2.5%',      note: 'Of gross proceeds' },
			{ label: 'Transaction Fee — Sale',     value: '6.0%',         note: 'Of Purchase Price (incl. assumed debt)' },
			{ label: 'Warrants (time incentive)',  value: '2.0%',         note: '7-year warrants if Financing Transaction closes within first 6 months' },
			{ label: 'Commercial Introduction Fee', value: '5.0%',        note: '24-month commission on gross receipts from introduced customers' },
		],
		terms: [
			'Tail period: 18 months post-termination for introduced investors',
			'Late payment interest: 15% per annum',
			'Governing law: New York',
			'Dispute resolution: FINRA mediation / arbitration',
			'YAC acts as independent contractor — not a fiduciary',
		],
	};

	const note = `This was prepared as a visual aid by FGL Executive staff. This document represents the necessary funding schedule for FGL to achieve maximum success in 2027. With these funding levels received on this schedule, FGL will be fully self-sustaining moving into our second season.`;

	// ── Phase 1 ──────────────────────────────────────────────────────────────
	const phase1 = {
		label: 'Phase 1',
		dates: 'April 1, 2026 – September 30, 2026',
		total: '$2,800,000',
		expenses: [
			{ label: 'Executive Staff',                    value: '$1,140,000' },
			{ label: 'Office Staff',                       value: '$286,000' },
			{ label: 'Go Throw (Media Partner)',           value: '$40,000',  note: 'Payments 1 & 2 of 4 quarterly' },
			{ label: 'Marketing',                          value: '$60,000',  note: '$10,000/mo' },
			{ label: 'Public Relations',                   value: '$30,000',  note: 'Build launch campaign' },
			{ label: 'Legal',                              value: '$50,000' },
			{ label: 'Advertising',                        value: '$50,000',  note: 'Build launch campaign' },
			{ label: 'Tech / App Development',             value: '$150,000' },
			{ label: 'San Diego Office',                   value: '$95,000',  note: 'Yearly expenses' },
			{ label: 'Scottsdale Office',                  value: '$48,000',  note: 'Yearly expense' },
			{ label: 'Utilities',                          value: '$48,000',  note: 'Both offices/year' },
			{ label: 'Hardware / Software',                value: '$18,000',  note: 'Both offices' },
			{ label: 'Mobile Data',                        value: '$10,000',  note: 'Staff/office internet & phones' },
			{ label: 'Clothing / Shoes / Apparel',         value: '$18,300',  note: 'Initial sponsored player & marketing order' },
			{ label: 'Documentary / Sizzle Reel',          value: '$100,000', note: 'Initial production' },
			{ label: 'Office Upgrades',                    value: '$5,000',   note: 'Furniture for AZ office' },
			{ label: 'MPO / FPO Sponsored Players',        value: '$300,000', note: 'Per year' },
			{ label: 'Payroll / Insurance / Relocation',   value: '$106,000' },
			{ label: 'State Gaming Licensing',             value: '$100,000', note: 'NEW — Key states' },
			{ label: 'Travel Expenses',                    value: '$60,000',  note: 'Securing league partnerships' },
			{ label: 'Sizzle Reel Development',            value: '$5,000' },
			{ label: 'Misc',                               value: '$80,700' },
		],
		milestones: [
			'FGL and FLI Golf Sports Apparel ready for marketing launch',
			'Sizzle Reel completed and Streaming Partnership secured or in negotiations',
			'Documentary has begun filming',
			'Office setup and staffing complete',
			'Smartboost and in-house marketing team have created all required content for full launch',
			'Neology PR has prepared launch strategy',
			'Professional player content has begun filming for league and brand marketing',
			'FGL website functional and app development has begun',
			'Fanduel / Gaming app partnerships secured',
			'Title Disc Golf Partners secured (Disc & Bag manufacturers)',
			'Letters of intent secured for 1/5 of target sponsors in Tiers 1 & 2',
			'Sales team begin signups for Tiers 3 and 4',
		],
		key: 'Revenue has not begun to be projected because Phase 2 marketing and PR launch will be crucial for securing target pricing and target brands. All major league business initiatives have been secured or are in place at the end of this phase.',
	};

	// ── Phase 2 ──────────────────────────────────────────────────────────────
	const phase2 = {
		label: 'Phase 2',
		dates: 'October 1, 2026 – January 31, 2027',
		total: '$1,473,300',
		expenses: [
			{ label: 'Go Throw (Media Partner)',           value: '$40,000',  note: 'Payments 3 & 4 of 4 quarterly' },
			{ label: 'Marketing',                          value: '$320,000', note: '$80,000/mo — $1,020,000 remaining budget' },
			{ label: 'Public Relations',                   value: '$100,000', note: '$70,000 remaining' },
			{ label: 'Legal',                              value: '$25,000',  note: '$25,000 remaining' },
			{ label: 'Advertising',                        value: '$100,000', note: '$50,000 remaining' },
			{ label: 'Documentary',                        value: '$250,000', note: '$150,000 remaining' },
			{ label: 'Broadcasting Staff',                 value: '$150,000', note: 'NEW — Training costs & logistics' },
			{ label: 'Clothing & Apparel',                 value: '$18,300',  note: 'NEW — First limited drop for stores' },
			{ label: 'Local Outreach',                     value: '$20,000',  note: 'NEW — School/college/athletic programs' },
			{ label: 'Pure Mobile',                        value: '$200,000', note: 'NEW — Deposit to begin production planning' },
			{ label: 'Mini Marketing Event',               value: '$250,000', note: 'NEW' },
		],
		revenue: [
			{ label: 'Tier 1 Sponsors',        value: '$2,250,000', note: '3/6 title sponsors secured' },
			{ label: 'Tier 2 Sponsors',        value: '$1,500,000', note: '3/6 major sponsors secured' },
			{ label: 'Tier 3 Sponsors',        value: '$1,000,000', note: '66% positions filled' },
			{ label: 'Tier 4 Sponsors',        value: '$1,000,000', note: '100% grab bag / player gift baskets sold' },
			{ label: 'Disc License',           value: '$100,000',   note: '+ revenue share on disc sales' },
			{ label: 'Bag License',            value: '$100,000',   note: '+ revenue share on bags' },
			{ label: 'Clothing / Apparel',     value: '$44,600' },
			{ label: 'Pre-sale Tickets 2027',  value: '$100,000',   note: '20% tickets presold for 1st tournament' },
			{ label: 'Website / Fantasy Subs', value: '$250,000',   note: '17% early subscriptions' },
			{ label: 'Total',                  value: '$6,344,600', bold: true },
		],
		milestones: [
			'Market absorption has begun globally for FGL marketing/PR efforts',
			'50% of title and major league sponsors secured',
			'Tier 4 complete',
			'1st successful FLI Golf limited drop completed across the US',
			'Engagement on subscriptions and fantasy players has begun',
			'Announcements made on ALL major disc golf podcasts and platforms',
			'Teams and Partners announced',
			'Broadcasting staff trained and ready for filming',
			'Professional Player marketing has begun on their platforms',
			'FGL has sponsored multiple professional events hosted by Go Throw',
			'1st look of the world\'s first Stadium-Style FLI Golf course revealed',
			'Mini FLO Golf League event at Turf Paradise successfully held',
			'Pure Mobile Productions has finalized production layout and logistics',
		],
	};

	// ── Phase 3 ──────────────────────────────────────────────────────────────
	const phase3 = {
		label: 'Phase 3',
		dates: 'February 1, 2027 – February 1, 2028',
		total: '$9,447,000',
		expenses: [
			{ label: 'Advertising',                value: '$50,000' },
			{ label: 'Documentary',                value: '$150,000', note: 'Filming of 1st season' },
			{ label: 'Public Relations',           value: '$70,000' },
			{ label: 'Marketing',                  value: '$1,020,000', note: '12 months @ $85,000/mo' },
			{ label: 'Pure Mobile Productions',    value: '$1,000,000', note: 'All 6 events' },
			{ label: 'Event Staff',                value: '$60,000',    note: '6 events incl. volunteers' },
			{ label: 'Infrastructure & Seating',   value: '$305,000',   note: '6 events @ $34,000' },
			{ label: 'On-course Branding',         value: '$90,000',    note: '6 events' },
			{ label: 'Entertainment',              value: '$600,000',   note: '6 events — UPDATED' },
			{ label: 'Stage & Audio',              value: '$1,500,000', note: '$250,000 × 6 events' },
			{ label: 'Broadcasting Staff',         value: '$350,000',   note: '5 members × 6 events' },
			{ label: 'Prize Purse',                value: '$4,000,000', note: '6 events' },
			{ label: 'Player Travel & Logistics',  value: '$252,000' },
		],
		revenue: [
			{ label: 'Tier 1 Sponsors (S1)',       value: '$2,250,000', note: '6/6 title sponsors secured' },
			{ label: 'Tier 2 Sponsors (S1)',       value: '$1,500,000', note: '6/6 major sponsors secured' },
			{ label: 'Tier 3 Sponsors (S1)',       value: '$500,000',   note: 'Tier completed for season 1' },
			{ label: 'Tier 1 Presale (S2)',        value: '$3,500,000', note: '3/6 title sponsors for season 2' },
			{ label: 'Tier 2 Presale (S2)',        value: '$1,150,000', note: '3/6 major sponsors for season 2' },
			{ label: 'Tier 3 Presale (S2)',        value: '$1,000,000', note: 'Half sold for season 2' },
			{ label: 'Tier 4 Presale (S2)',        value: '$700,000',   note: 'Half completed for season 2' },
			{ label: '2027 Season Tickets',        value: '$2,900,000', note: '100% tickets sold' },
			{ label: 'Season 2 Ticket Presale',    value: '$660,000',   note: '20% presold' },
			{ label: 'Website / Fantasy Subs',     value: '$1,250,000', note: 'Target subscriptions reached' },
			{ label: 'Clothing / Apparel Drops',   value: '$105,314' },
			{ label: 'Total',                      value: '$15,515,314', bold: true },
		],
	};

	const additionalExpenses = [
		{ label: 'Executive Staff',          value: '$1,197,000' },
		{ label: 'Office Staff',             value: '$300,300' },
		{ label: 'Go Throw Media Partner',   value: '$80,000' },
		{ label: 'Commissions',              value: '$403,000' },
		{ label: 'San Diego Office',         value: '$82,800' },
		{ label: 'Scottsdale Office',        value: '$48,000' },
		{ label: 'Utilities',                value: '$48,000' },
		{ label: 'Player Sponsorships',      value: '$300,000' },
		{ label: 'Travel Expenses',          value: '$60,000' },
		{ label: 'Clothing (4 limited drops)',value: '$73,146' },
		{ label: 'League Insurance',         value: '$80,000' },
		{ label: 'Payroll Fees',             value: '$7,000' },
		{ label: 'Employee Insurance',       value: '$65,000' },
		{ label: 'POS / Processing',         value: '$20,000' },
		{ label: 'Total',                    value: '$2,763,946', bold: true },
	];
</script>

<div class="assumptions">

	<div class="page-header">
		<div>
			<h2>Funding Schedule</h2>
			<p class="tagline">FGL Investment Phases — 2026–2028</p>
		</div>
		<a class="source-link" href={DOC_URL} target="_blank" rel="noopener noreferrer">
			View source document
			<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
				<path d="M2 9L9 2M9 2H4.5M9 2V6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</a>
	</div>

	<p class="doc-note">{note}</p>

	<!-- Summary bar -->
	<div class="summary-bar">
		<div class="summary-item">
			<span class="summary-label">Phase 1</span>
			<span class="summary-value">$2,800,000</span>
		</div>
		<div class="summary-sep">+</div>
		<div class="summary-item">
			<span class="summary-label">Phase 2</span>
			<span class="summary-value">$1,473,300</span>
		</div>
		<div class="summary-sep">+</div>
		<div class="summary-item">
			<span class="summary-label">Phase 3</span>
			<span class="summary-value">$9,447,000</span>
		</div>
		<div class="summary-sep">=</div>
		<div class="summary-item total">
			<span class="summary-label">Total Investment</span>
			<span class="summary-value">$13,720,300</span>
		</div>
		<div class="summary-sep">→</div>
		<div class="summary-item revenue">
			<span class="summary-label">Projected Revenue</span>
			<span class="summary-value">$21,859,914</span>
		</div>
	</div>

	<!-- Phase 1 -->
	<div class="phase-block">
		<div class="phase-header p1">
			<div class="phase-label">Phase 1</div>
			<div class="phase-dates">{phase1.dates}</div>
			<div class="phase-total">{phase1.total} needed</div>
		</div>
		<div class="phase-body">
			<div class="phase-col">
				<h4 class="col-heading">Expenses</h4>
				<table>
					<tbody>
						{#each phase1.expenses as row}
							<tr>
								<td class="col-label">{row.label}</td>
								<td class="col-val">{row.value}</td>
								<td class="col-note">{row.note ?? ''}</td>
							</tr>
						{/each}
						<tr class="total-row">
							<td class="col-label">Total</td>
							<td class="col-val">{phase1.total}</td>
							<td class="col-note"></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="phase-col">
				<h4 class="col-heading">Milestones</h4>
				<ol class="milestones">
					{#each phase1.milestones as m}
						<li>{m}</li>
					{/each}
				</ol>
				{#if phase1.key}
					<p class="phase-key"><strong>Key:</strong> {phase1.key}</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Phase 2 -->
	<div class="phase-block">
		<div class="phase-header p2">
			<div class="phase-label">Phase 2 — Marketing & PR Launch</div>
			<div class="phase-dates">{phase2.dates}</div>
			<div class="phase-total">{phase2.total} needed</div>
		</div>
		<div class="phase-body">
			<div class="phase-col">
				<h4 class="col-heading">Expenses</h4>
				<table>
					<tbody>
						{#each phase2.expenses as row}
							<tr>
								<td class="col-label">{row.label}</td>
								<td class="col-val">{row.value}</td>
								<td class="col-note">{row.note ?? ''}</td>
							</tr>
						{/each}
						<tr class="total-row">
							<td class="col-label">Total</td>
							<td class="col-val">{phase2.total}</td>
							<td class="col-note"></td>
						</tr>
					</tbody>
				</table>

				<h4 class="col-heading" style="margin-top:1.5rem">Projected Revenue</h4>
				<table>
					<tbody>
						{#each phase2.revenue as row}
							<tr class:total-row={row.bold}>
								<td class="col-label">{row.label}</td>
								<td class="col-val">{row.value}</td>
								<td class="col-note">{row.note ?? ''}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="phase-col">
				<h4 class="col-heading">Milestones</h4>
				<ol class="milestones">
					{#each phase2.milestones as m}
						<li>{m}</li>
					{/each}
				</ol>
			</div>
		</div>
	</div>

	<!-- Phase 3 -->
	<div class="phase-block">
		<div class="phase-header p3">
			<div class="phase-label">Phase 3 — 2027 Season Launch</div>
			<div class="phase-dates">{phase3.dates}</div>
			<div class="phase-total">{phase3.total} needed</div>
		</div>
		<div class="phase-body">
			<div class="phase-col">
				<h4 class="col-heading">Expenses</h4>
				<table>
					<tbody>
						{#each phase3.expenses as row}
							<tr>
								<td class="col-label">{row.label}</td>
								<td class="col-val">{row.value}</td>
								<td class="col-note">{row.note ?? ''}</td>
							</tr>
						{/each}
						<tr class="total-row">
							<td class="col-label">Total</td>
							<td class="col-val">{phase3.total}</td>
							<td class="col-note"></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="phase-col">
				<h4 class="col-heading">Projected Revenue</h4>
				<table>
					<tbody>
						{#each phase3.revenue as row}
							<tr class:total-row={row.bold}>
								<td class="col-label">{row.label}</td>
								<td class="col-val">{row.value}</td>
								<td class="col-note">{row.note ?? ''}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Additional 2027 expenses -->
	<div class="phase-block">
		<div class="phase-header additional">
			<div class="phase-label">Additional 2027 Expenses</div>
			<div class="phase-dates">Covered by FGL — excluded from funding ask</div>
			<div class="phase-total">$2,763,946</div>
		</div>
		<div class="phase-body">
			<div class="phase-col">
				<table>
					<tbody>
						{#each additionalExpenses as row}
							<tr class:total-row={row.bold}>
								<td class="col-label">{row.label}</td>
								<td class="col-val">{row.value}</td>
								<td class="col-note"></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="phase-col">
				<div class="final-summary">
					<div class="fs-row">
						<span>Phase 1–3 Revenue Total</span>
						<strong>$21,859,914</strong>
					</div>
					<div class="fs-row deduct">
						<span>Additional 2027 Expenses</span>
						<strong>− $2,763,946</strong>
					</div>
					<div class="fs-row result">
						<span>Revenue Remaining → Season 2</span>
						<strong>$19,095,968</strong>
					</div>
					<div class="fs-row invest">
						<span>Total Investments Received</span>
						<strong>$12,370,300</strong>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Consultation Reserves, Dept Budget, Warehouse, Misc -->
	<h3 class="group-heading" style="margin-top:2rem">Additional Budgets</h3>
	<div class="phase-block">
		<div class="phase-header additional">
			<div class="phase-label">Consultation Reserves, Department Budget & Miscellaneous</div>
			<div class="phase-dates">"Where Disc Golf Takes Flight"</div>
			<a class="source-link" href={BUDGET_DOC_URL} target="_blank" rel="noopener noreferrer">
				View document
				<svg width="10" height="10" viewBox="0 0 11 11" fill="none" aria-hidden="true">
					<path d="M2 9L9 2M9 2H4.5M9 2V6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</a>
		</div>
		<div class="phase-body">
			<div class="phase-col">
				<h4 class="col-heading">Consultation Reserves — 2026–2029</h4>
				<table>
					<thead>
						<tr>
							<th class="col-label"></th>
							{#each years2629 as y}<th class="col-val">{y}</th>{/each}
							<th class="col-note"></th>
						</tr>
					</thead>
					<tbody>
						{#each consultationReserves as row}
							<tr class:total-row={row.bold}>
								<td class="col-label">{row.label}</td>
								{#each row.values as v}<td class="col-val">{v}</td>{/each}
								<td class="col-note">{row.note ?? ''}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<h4 class="col-heading" style="margin-top:1.5rem">Department Budget</h4>
				<table>
					<tbody>
						{#each deptBudget as row}
							<tr class:total-row={row.bold}>
								<td class="col-label">{row.label}</td>
								<td class="col-val">{row.value}</td>
								<td class="col-note"></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="phase-col">
				<h4 class="col-heading">Miscellaneous Expenses</h4>
				<table>
					<tbody>
						{#each miscExpenses as row}
							<tr class:total-row={row.bold}>
								<td class="col-label">{row.label}</td>
								<td class="col-val">{row.value}</td>
								<td class="col-note">{row.note ?? ''}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<h4 class="col-heading" style="margin-top:1.5rem">Warehouse Supplies</h4>
				<table>
					<tbody>
						{#each warehouseSupplies as row}
							<tr class:total-row={row.bold}>
								<td class="col-label">{row.label}</td>
								<td class="col-val">{row.value}</td>
								<td class="col-note"></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Subscription Platform -->
	<h3 class="group-heading" style="margin-top:2rem">Subscription Platform</h3>
	<div class="phase-block">
		<div class="phase-header sub">
			<div class="phase-label">Premium Subscription Platform Model</div>
			<div class="phase-dates">Fiscal Years 2026–2031 · {subscription.price}</div>
			<a class="source-link-sub" href={SUBSCRIPTION_DOC_URL} target="_blank" rel="noopener noreferrer">
				View document
				<svg width="10" height="10" viewBox="0 0 11 11" fill="none" aria-hidden="true">
					<path d="M2 9L9 2M9 2H4.5M9 2V6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</a>
		</div>
		<div class="phase-body">
			<div class="phase-col">
				<p class="yac-role">{subscription.positioning}</p>

				<h4 class="col-heading" style="margin-top:1rem">Subscriber & Revenue Projections</h4>
				<table>
					<thead>
						<tr>
							<th class="col-label">Year</th>
							<th class="col-val">Subscribers</th>
							<th class="col-val">Revenue</th>
						</tr>
					</thead>
					<tbody>
						{#each subscription.growth as row}
							<tr>
								<td class="col-label">{row.year}</td>
								<td class="col-val">{row.subscribers}</td>
								<td class="col-val">{row.revenue}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<h4 class="col-heading" style="margin-top:1.25rem">2031 Subscriber Mix</h4>
				<table>
					<tbody>
						{#each subscription.mix2031 as row}
							<tr>
								<td class="col-label">{row.type}</td>
								<td class="col-val">{row.pct}</td>
								<td class="col-val">{row.users}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div class="phase-key" style="margin-top:1rem">
					<strong>Enterprise Value (2031):</strong> {subscription.valuation}
				</div>
			</div>
			<div class="phase-col">
				<h4 class="col-heading">Target Segments</h4>
				{#each subscription.segments as s}
					<div class="amend-person">
						<div class="amend-name">{s.label}</div>
						<div class="amend-note" style="font-style:normal">{s.desc}</div>
					</div>
				{/each}

				<h4 class="col-heading" style="margin-top:1.25rem">Growth Drivers</h4>
				<ul class="milestones">
					{#each subscription.drivers as d}
						<li>{d}</li>
					{/each}
				</ul>

				<h4 class="col-heading" style="margin-top:1.25rem">Comparable Models</h4>
				<ul class="milestones">
					{#each subscription.comparables as c}
						<li>{c}</li>
					{/each}
				</ul>

				<h4 class="col-heading" style="margin-top:1.25rem">Long-term Upside (not in base model)</h4>
				<ul class="milestones">
					{#each subscription.upside as u}
						<li>{u}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<!-- Financial Amendments -->
	<h3 class="group-heading" style="margin-top:2rem">Financial Amendments</h3>
	<div class="phase-block">
		<div class="phase-header amend">
			<div class="phase-label">Payroll & Line Item Changes</div>
			<div class="phase-dates">{amendments.date}</div>
			<a class="source-link-amend" href={AMENDMENTS_DOC_URL} target="_blank" rel="noopener noreferrer">
				View document
				<svg width="10" height="10" viewBox="0 0 11 11" fill="none" aria-hidden="true">
					<path d="M2 9L9 2M9 2H4.5M9 2V6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</a>
		</div>
		<div class="phase-body">
			<div class="phase-col">
				<h4 class="col-heading">Payroll Removals (2026)</h4>
				<ul class="milestones" style="margin-bottom:1.25rem">
					{#each amendments.removals as r}
						<li>{r}</li>
					{/each}
				</ul>

				<h4 class="col-heading">Updated Payroll Figures</h4>
				{#each amendments.payrollChanges as person}
					<div class="amend-person">
						<div class="amend-name">{person.name}</div>
						<div class="amend-values">
							{#each person.values as v}
								<span class="amend-chip"><span class="amend-year">{v.year}</span>{v.value}</span>
							{/each}
						</div>
						{#if person.note}
							<div class="amend-note">{person.note}</div>
						{/if}
					</div>
				{/each}
			</div>
			<div class="phase-col">
				<h4 class="col-heading">Licensing Structure</h4>
				<p class="yac-role" style="margin-bottom:1.25rem">{amendments.licensing}</p>

				<h4 class="col-heading">New Production / Tournament Expenses</h4>
				{#each amendments.productionExpenses as item}
					<div class="amend-person">
						<div class="amend-name">{item.label}</div>
						<div class="amend-values">
							{#each item.values as v}
								<span class="amend-chip"><span class="amend-year">{v.year}</span>{v.value}</span>
							{/each}
						</div>
					</div>
				{/each}

				<div class="phase-key" style="margin-top:1rem">
					<strong>2029+ Profit Allocation:</strong> {amendments.profitAllocation}
				</div>
			</div>
		</div>
	</div>

	<!-- YAC Investment Banking Agreement -->
	<h3 class="group-heading" style="margin-top:2rem">Investment Banking</h3>
	<div class="phase-block">
		<div class="phase-header yac">
			<div class="phase-label">Young America Capital, LLC — Engagement Agreement</div>
			<div class="phase-dates">{yac.date}</div>
			<a class="source-link-sm" href={YAC_DOC_URL} target="_blank" rel="noopener noreferrer">
				View agreement
				<svg width="10" height="10" viewBox="0 0 11 11" fill="none" aria-hidden="true">
					<path d="M2 9L9 2M9 2H4.5M9 2V6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</a>
		</div>
		<div class="phase-body">
			<div class="phase-col">
				<p class="yac-role">{yac.role}</p>
				<h4 class="col-heading" style="margin-top:1rem">Fee Structure</h4>
				<table>
					<tbody>
						{#each yac.fees as row}
							<tr>
								<td class="col-label">{row.label}</td>
								<td class="col-val">{row.value}</td>
								<td class="col-note">{row.note ?? ''}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="phase-col">
				<h4 class="col-heading">Key Terms</h4>
				<ul class="milestones">
					{#each yac.terms as t}
						<li>{t}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

</div>

<style>
	.assumptions { padding-bottom: 3rem; }

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	h2 { font-size: 1.35rem; font-weight: 700; margin: 0 0 0.2rem; color: #111827; }
	.tagline { font-size: 0.85rem; color: #6b7280; margin: 0; font-style: italic; }

	.source-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.78rem;
		font-weight: 500;
		color: #2563eb;
		text-decoration: none;
		padding: 0.4rem 0.75rem;
		border: 1px solid #bfdbfe;
		border-radius: 6px;
		background: #eff6ff;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.source-link:hover { background: #dbeafe; }

	.source-link-sm {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #ea580c;
		text-decoration: none;
		padding: 0.3rem 0.6rem;
		border: 1px solid #fed7aa;
		border-radius: 5px;
		background: #fff7ed;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.source-link-sm:hover { background: #ffedd5; }

	.source-link-sub {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #0369a1;
		text-decoration: none;
		padding: 0.3rem 0.6rem;
		border: 1px solid #bae6fd;
		border-radius: 5px;
		background: #f0f9ff;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.source-link-sub:hover { background: #e0f2fe; }

	.source-link-amend {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #92400e;
		text-decoration: none;
		padding: 0.3rem 0.6rem;
		border: 1px solid #fde68a;
		border-radius: 5px;
		background: #fefce8;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.source-link-amend:hover { background: #fef9c3; }

	.amend-person {
		margin-bottom: 0.85rem;
	}
	.amend-name {
		font-size: 0.82rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 0.3rem;
	}
	.amend-values {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-bottom: 0.25rem;
	}
	.amend-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		background: #f3f4f6;
		border-radius: 5px;
		padding: 0.2rem 0.5rem;
		color: #374151;
		font-variant-numeric: tabular-nums;
	}
	.amend-year {
		font-size: 0.68rem;
		font-weight: 600;
		color: #9ca3af;
		text-transform: uppercase;
	}
	.amend-note {
		font-size: 0.74rem;
		color: #6b7280;
		font-style: italic;
	}

	.yac-role {
		font-size: 0.82rem;
		color: #6b7280;
		line-height: 1.6;
		margin: 0 0 0.5rem;
	}

	.group-heading {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9ca3af;
		margin: 2rem 0 0.75rem;
	}

	.doc-note {
		font-size: 0.82rem;
		color: #6b7280;
		background: #f9fafb;
		border-left: 3px solid #e5e7eb;
		padding: 0.75rem 1rem;
		border-radius: 0 6px 6px 0;
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	/* Summary bar */
	.summary-bar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 1rem 1.5rem;
		margin-bottom: 1.75rem;
	}
	.summary-item { display: flex; flex-direction: column; gap: 0.15rem; }
	.summary-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; }
	.summary-value { font-size: 1.1rem; font-weight: 700; color: #111827; }
	.summary-item.total .summary-value { color: #2563eb; }
	.summary-item.revenue .summary-value { color: #16a34a; }
	.summary-sep { font-size: 1.1rem; color: #d1d5db; font-weight: 300; }

	/* Phase blocks */
	.phase-block {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		margin-bottom: 1.5rem;
		overflow: hidden;
	}

	.phase-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 1.5rem;
		flex-wrap: wrap;
	}
	.p1 { background: #eff6ff; border-bottom: 1px solid #bfdbfe; }
	.p2 { background: #f0fdf4; border-bottom: 1px solid #bbf7d0; }
	.p3 { background: #fdf4ff; border-bottom: 1px solid #e9d5ff; }
	.additional { background: #fafafa; border-bottom: 1px solid #e5e7eb; }
	.yac   { background: #fff7ed; border-bottom: 1px solid #fed7aa; }
	.amend { background: #fefce8; border-bottom: 1px solid #fde68a; }
	.sub   { background: #f0f9ff; border-bottom: 1px solid #bae6fd; }

	.phase-label { font-size: 0.95rem; font-weight: 700; color: #111827; }
	.phase-dates { font-size: 0.8rem; color: #6b7280; flex: 1; }
	.phase-total { font-size: 0.9rem; font-weight: 700; color: #2563eb; white-space: nowrap; }
	.p2 .phase-total { color: #16a34a; }
	.p3 .phase-total { color: #7c3aed; }

	.phase-body {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
	}

	.phase-col {
		padding: 1.25rem 1.5rem;
	}
	.phase-col + .phase-col {
		border-left: 1px solid #f3f4f6;
	}

	.col-heading {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #9ca3af;
		margin: 0 0 0.75rem;
	}

	table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }

	td {
		padding: 0.35rem 0.5rem;
		color: #374151;
		border-bottom: 1px solid #f9fafb;
	}
	tr:last-child td { border-bottom: none; }
	tr:hover td { background: #f9fafb; }

	.col-label { text-align: left; color: #111827; }
	.col-val { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; min-width: 90px; }
	.col-note { text-align: left; color: #9ca3af; font-size: 0.74rem; padding-left: 0.75rem; }

	.total-row td { font-weight: 600; color: #111827; border-top: 1px solid #e5e7eb; }

	/* Milestones */
	.milestones {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.milestones li { font-size: 0.82rem; color: #374151; line-height: 1.5; }

	.phase-key {
		font-size: 0.78rem;
		color: #6b7280;
		background: #f9fafb;
		border-radius: 6px;
		padding: 0.6rem 0.75rem;
		margin: 1rem 0 0;
		line-height: 1.5;
	}

	/* Final summary box */
	.final-summary {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 0.5rem 0;
	}
	.fs-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
		color: #374151;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		background: #f9fafb;
	}
	.fs-row.deduct { color: #dc2626; }
	.fs-row.result { background: #f0fdf4; color: #15803d; font-weight: 600; }
	.fs-row.invest { background: #eff6ff; color: #1d4ed8; font-weight: 600; }

	@media (max-width: 700px) {
		.phase-body { grid-template-columns: 1fr; }
		.phase-col + .phase-col { border-left: none; border-top: 1px solid #f3f4f6; }
		.summary-bar { gap: 0.5rem; }
	}
</style>
