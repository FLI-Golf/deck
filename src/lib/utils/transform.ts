import type { ParsedSheet } from '../services/sheets.js';
import type { DataPoint, SeriesData } from './types.js';

// ---------------------------------------------------------------------------
// Label helpers
// ---------------------------------------------------------------------------

const LABEL_MAP: Record<string, string> = {
	'Ticket Revenue': 'Tickets',
	'Sponsorships': 'Sponsorships',
	'Bags': 'Bags',
	'Disc': 'Discs',
	'Podcast Subscriptions': 'Podcast Subs',
	'FLI Golf Sports Apparel & Accessories': 'Apparel',
	'FLI Golf League Team Jerseys': 'Jerseys',
	'Fantasy League Fees': 'Fantasy League',
	'Trading Cards': 'Trading Cards',
	'Gambling': 'Gambling',
	'Broadcasting/Streaming': 'Broadcasting',
	'Franchises': 'Franchises',
	'Bag Licensing': 'Bag Licensing',
	'Disc Licensing': 'Disc Licensing',
	'General League Licensing': 'League Licensing',
	'Apparel & Accessories': 'Apparel'
};

export function shortenProductLabel(name: string): string {
	return LABEL_MAP[name.trim()] ?? name;
}

// ---------------------------------------------------------------------------
// Typed shapes
// ---------------------------------------------------------------------------

export interface PnLRow {
	label: string;
	values: number[];
}

export interface ProductRow {
	name: string;
	values: number[];
}

// ---------------------------------------------------------------------------
// P&L transformers
// ---------------------------------------------------------------------------

/**
 * Returns the named P&L metrics as SeriesData for a line or bar chart.
 * Each metric becomes one series; years become the x-axis labels.
 */
export function pnlToSeries(sheet: ParsedSheet, metrics: string[]): SeriesData[] {
	return metrics
		.filter((m) => sheet.pnl[m])
		.map((m) => ({
			name: m,
			points: sheet.years.map((year, i) => ({
				label: year,
				value: sheet.pnl[m][i] ?? 0
			}))
		}));
}

/**
 * Returns a single P&L metric as a flat DataPoint array.
 * Useful for a standalone bar or line chart.
 */
export function pnlMetricToPoints(sheet: ParsedSheet, metric: string): DataPoint[] {
	const values = sheet.pnl[metric];
	if (!values) return [];
	return sheet.years.map((year, i) => ({ label: year, value: values[i] ?? 0 }));
}

// ---------------------------------------------------------------------------
// Product sales transformers
// ---------------------------------------------------------------------------

/**
 * Returns all products as SeriesData for a multi-series chart.
 */
export function productsToSeries(sheet: ParsedSheet): SeriesData[] {
	return Object.entries(sheet.products).map(([name, values]) => ({
		name,
		points: sheet.productYears.map((year, i) => ({ label: year, value: values[i] ?? 0 }))
	}));
}

/**
 * Returns the latest year's product revenue as DataPoint[] for a bar/donut chart.
 * Excludes "Total Revenue" summary row.
 */
export function productBreakdownPoints(sheet: ParsedSheet): DataPoint[] {
	const lastIdx = sheet.productYears.length - 1;
	return Object.entries(sheet.products)
		.filter(([name]) => name !== 'Total Revenue')
		.map(([name, values]) => ({ label: shortenProductLabel(name), value: values[lastIdx] ?? 0 }))
		.filter((p) => p.value > 0)
		.sort((a, b) => b.value - a.value);
}



// ---------------------------------------------------------------------------
// Per-year helpers
// ---------------------------------------------------------------------------

export interface YearSlice {
	year: string;
	pnl: Record<string, number>;
	products: Record<string, number>;
	/** P&L metrics as DataPoints for bar charts */
	pnlPoints: DataPoint[];
	/** Product revenue as DataPoints for bar/donut charts */
	productPoints: DataPoint[];
}

/**
 * Extracts all P&L and product data for a single year.
 */
export function getYearSlice(sheet: ParsedSheet, year: string): YearSlice {
	const pnlIdx = sheet.years.indexOf(year);
	const productIdx = sheet.productYears.indexOf(year);

	const pnl: Record<string, number> = {};
	if (pnlIdx >= 0) {
		for (const [label, values] of Object.entries(sheet.pnl)) {
			pnl[label] = values[pnlIdx] ?? 0;
		}
	}

	const products: Record<string, number> = {};
	if (productIdx >= 0) {
		for (const [name, values] of Object.entries(sheet.products)) {
			products[name] = values[productIdx] ?? 0;
		}
	}

	const pnlPoints: DataPoint[] = Object.entries(pnl)
		.filter(([, v]) => v !== 0)
		.map(([label, value]) => ({ label, value }));

	const productPoints: DataPoint[] = Object.entries(products)
		.filter(([name, v]) => name !== 'Total Revenue' && v > 0)
		.map(([name, value]) => ({ label: shortenProductLabel(name), value }))
		.sort((a, b) => b.value - a.value);

	return { year, pnl, products, pnlPoints, productPoints };
}

/**
 * Returns all available years across both P&L and product sections, deduplicated and sorted.
 */
export function getAllYears(sheet: ParsedSheet): string[] {
	return [...new Set([...sheet.years, ...sheet.productYears])].sort();
}

// ---------------------------------------------------------------------------
// KPI helpers
// ---------------------------------------------------------------------------

export interface KpiSummary {
	latestSales: number;
	latestNetProfit: number;
	latestGrossProfit: number;
	latestYear: string;
	salesGrowth: number | undefined;
}

export function extractKpis(sheet: ParsedSheet): KpiSummary {
	const sales = sheet.pnl['Sales'] ?? [];
	const netProfit = sheet.pnl['Net Profit'] ?? [];
	const grossProfit = sheet.pnl['Gross profit'] ?? [];
	const lastIdx = sheet.years.length - 1;

	const latestSales = sales[lastIdx] ?? 0;
	const prevSales = sales[lastIdx - 1] ?? 0;
	const salesGrowth =
		prevSales !== 0 ? ((latestSales - prevSales) / Math.abs(prevSales)) * 100 : undefined;

	return {
		latestSales,
		latestNetProfit: netProfit[lastIdx] ?? 0,
		latestGrossProfit: grossProfit[lastIdx] ?? 0,
		latestYear: sheet.years[lastIdx] ?? '',
		salesGrowth
	};
}

/**
 * Extracts KPI values for a specific year, with growth delta vs the prior year.
 */
export function extractKpisForYear(sheet: ParsedSheet, year: string): KpiSummary {
	const sales = sheet.pnl['Sales'] ?? [];
	const netProfit = sheet.pnl['Net Profit'] ?? [];
	const grossProfit = sheet.pnl['Gross profit'] ?? [];
	const idx = sheet.years.indexOf(year);
	const prevIdx = idx - 1;

	const latestSales = idx >= 0 ? (sales[idx] ?? 0) : 0;
	const prevSales = prevIdx >= 0 ? (sales[prevIdx] ?? 0) : 0;
	const salesGrowth =
		prevSales !== 0 ? ((latestSales - prevSales) / Math.abs(prevSales)) * 100 : undefined;

	return {
		latestSales,
		latestNetProfit: idx >= 0 ? (netProfit[idx] ?? 0) : 0,
		latestGrossProfit: idx >= 0 ? (grossProfit[idx] ?? 0) : 0,
		latestYear: year,
		salesGrowth
	};
}
