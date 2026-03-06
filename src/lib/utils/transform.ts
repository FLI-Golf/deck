import type { ParsedSheet } from '../services/sheets.js';
import type { DataPoint, SeriesData } from './types.js';

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
		.map(([name, values]) => ({ label: name, value: values[lastIdx] ?? 0 }))
		.filter((p) => p.value > 0)
		.sort((a, b) => b.value - a.value);
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
