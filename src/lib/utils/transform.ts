import type { ParsedSheet, RevenueSheet, ExpensesSheet } from '../services/sheets.js';
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
	'Apparel & Accessories': 'Apparel',
	'Leauge Team Jerseys': 'Jerseys',
	'Sports Apparel': 'Apparel',
	'Bag': 'Bags',
	'Brixton - Trading Cards Rev/Share 60 Brixton 40 FLI Golf': 'Trading Cards',
	'General League Licensing ': 'League Licensing',
	'Fantasy League Fees ': 'Fantasy League',
	'Disc ': 'Discs',
};

export function shortenProductLabel(name: string): string {
	return LABEL_MAP[name.trim()] ?? name.trim();
}

// ---------------------------------------------------------------------------
// P&L transformers
// ---------------------------------------------------------------------------

export interface KpiSummary {
	latestSales: number;
	latestNetProfit: number;
	latestGrossProfit: number;
	latestYear: string;
	salesGrowth: number | undefined;
}

export interface YearSlice {
	year: string;
	pnl: Record<string, number>;
	products: Record<string, number>;
	pnlPoints: DataPoint[];
	productPoints: DataPoint[];
}

export function pnlToSeries(sheet: ParsedSheet, metrics: string[]): SeriesData[] {
	return metrics
		.filter((m) => sheet.pnl[m])
		.map((m) => ({
			name: m,
			points: sheet.years.map((year, i) => ({ label: year, value: sheet.pnl[m][i] ?? 0 }))
		}));
}

export function pnlMetricToPoints(sheet: ParsedSheet, metric: string): DataPoint[] {
	const values = sheet.pnl[metric];
	if (!values) return [];
	return sheet.years.map((year, i) => ({ label: year, value: values[i] ?? 0 }));
}

export function getAllYears(sheet: ParsedSheet): string[] {
	return [...new Set([...sheet.years, ...sheet.productYears])].sort();
}

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

	const PNL_ORDER = ['Sales','COGS','Gross profit','Sales & Marketing','Labor','General & Administrative','Total expenses','Net Profit'];
	const pnlPoints: DataPoint[] = PNL_ORDER
		.filter((m) => pnl[m] !== undefined && pnl[m] !== 0)
		.map((m) => ({ label: m, value: pnl[m] }));

	const productPoints: DataPoint[] = Object.entries(products)
		.filter(([name, v]) => name !== 'Total Revenue' && v > 0)
		.map(([name, value]) => ({ label: shortenProductLabel(name), value }))
		.sort((a, b) => b.value - a.value);

	return { year, pnl, products, pnlPoints, productPoints };
}

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

// ---------------------------------------------------------------------------
// Revenue sheet transformers (GID 288496811)
// ---------------------------------------------------------------------------

/**
 * Returns product revenue for a specific year as sorted DataPoints.
 */
export function revenueForYear(sheet: RevenueSheet, year: string): DataPoint[] {
	const idx = sheet.years.indexOf(year);
	if (idx < 0) return [];
	return Object.entries(sheet.products)
		.filter(([name]) => name !== 'Column 1')
		.map(([name, values]) => ({ label: shortenProductLabel(name), value: values[idx] ?? 0 }))
		.filter((p) => p.value > 0)
		.sort((a, b) => b.value - a.value);
}

/**
 * Returns a named product as a SeriesData across all years.
 */
export function revenueProductToSeries(sheet: RevenueSheet, products: string[]): SeriesData[] {
	return products
		.filter((p) => sheet.products[p])
		.map((p) => ({
			name: shortenProductLabel(p),
			points: sheet.years.map((year, i) => ({ label: year, value: sheet.products[p][i] ?? 0 }))
		}));
}

/**
 * Returns total revenue per year as DataPoints.
 */
export function revenueTotalByYear(sheet: RevenueSheet): DataPoint[] {
	return sheet.years.map((year, i) => ({
		label: year,
		value: Object.entries(sheet.products)
			.filter(([name]) => name !== 'Column 1')
			.reduce((sum, [, vals]) => sum + (vals[i] ?? 0), 0)
	}));
}

// ---------------------------------------------------------------------------
// Expenses sheet transformers (GID 768312552)
// ---------------------------------------------------------------------------

/**
 * Returns expense categories as DataPoints for a specific year.
 */
export function expensesForYear(sheet: ExpensesSheet, year: string): DataPoint[] {
	const idx = sheet.years.indexOf(year);
	if (idx < 0) return [];
	return sheet.categories
		.map((cat) => ({ label: cat.name, value: cat.values[idx] ?? 0 }))
		.filter((p) => p.value > 0)
		.sort((a, b) => b.value - a.value);
}

/**
 * Returns all expense categories as multi-year SeriesData for a line chart.
 */
export function expensesToSeries(sheet: ExpensesSheet): SeriesData[] {
	return sheet.categories
		.filter((cat) => cat.values.some((v) => v > 0))
		.map((cat) => ({
			name: cat.name,
			points: sheet.years.map((year, i) => ({ label: year, value: cat.values[i] ?? 0 }))
		}));
}

/**
 * Total expenses per year across all categories.
 */
export function expensesTotalByYear(sheet: ExpensesSheet): DataPoint[] {
	return sheet.years.map((year, i) => ({
		label: year,
		value: sheet.categories.reduce((sum, cat) => sum + (cat.values[i] ?? 0), 0)
	}));
}
