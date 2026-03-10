import { PUBLIC_GOOGLE_SHEET_CSV_URL } from '$env/static/public';

type RawRow = string[];

const BASE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT6ciri7chQvKJBCA087T_ajZTVf87JG5gysGvQiz344aCZ4F6-EFhJSawkYMzaMVxNV58dYk-M9xW7';

const SHEET_URLS = {
	pnl:      `${BASE_URL}/pub?gid=913449617&single=true&output=csv`,
	revenue:  `${BASE_URL}/pub?gid=288496811&single=true&output=csv`,
	expenses: `${BASE_URL}/pub?gid=768312552&single=true&output=csv`,
};

// ---------------------------------------------------------------------------
// P&L sheet types (existing)
// ---------------------------------------------------------------------------

export interface ParsedSheet {
	years: string[];
	pnl: Record<string, number[]>;
	productYears: string[];
	products: Record<string, number[]>;
}

// ---------------------------------------------------------------------------
// Revenue sheet types (GID 288496811)
// Row-per-year, column-per-product
// ---------------------------------------------------------------------------

export interface RevenueSheet {
	years: string[];
	/** product name -> values per year */
	products: Record<string, number[]>;
}

// ---------------------------------------------------------------------------
// Expenses sheet types (GID 768312552)
// ---------------------------------------------------------------------------

export interface ExpenseCategory {
	name: string;
	values: number[]; // per year 2026-2031
}

export interface ExpensesSheet {
	years: string[];
	categories: ExpenseCategory[];
	/** raw named totals rows keyed by label */
	totals: Record<string, number[]>;
}

// ---------------------------------------------------------------------------
// Top-level combined type
// ---------------------------------------------------------------------------

export interface AllSheets {
	pnl: ParsedSheet;
	revenue: RevenueSheet;
	expenses: ExpensesSheet;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function loadAllSheets(): Promise<AllSheets> {
	const [pnlText, revenueText, expensesText] = await Promise.all([
		fetchCSV(SHEET_URLS.pnl),
		fetchCSV(SHEET_URLS.revenue),
		fetchCSV(SHEET_URLS.expenses),
	]);

	return {
		pnl:      parsePnlSheet(pnlText),
		revenue:  parseRevenueSheet(revenueText),
		expenses: parseExpensesSheet(expensesText),
	};
}

// Keep backward compat for existing code
export async function loadSheetData(): Promise<ParsedSheet> {
	const text = await fetchCSV(SHEET_URLS.pnl);
	return parsePnlSheet(text);
}

// ---------------------------------------------------------------------------
// P&L parser (existing logic)
// ---------------------------------------------------------------------------

function parsePnlSheet(text: string): ParsedSheet {
	const rows = text.trim().split('\n').map(splitCSVLine);
	const yearRowIndices = rows.reduce<number[]>((acc, row, i) => {
		if (row.filter((c) => /^\d{4}$/.test(c.trim())).length >= 3) acc.push(i);
		return acc;
	}, []);

	const pnlYearIdx = yearRowIndices[0] ?? -1;
	const pnlStopIdx = yearRowIndices[1] ?? rows.length;
	const { years: pnlYears, data: pnl } =
		pnlYearIdx >= 0 ? extractSparseSection(rows, pnlYearIdx, pnlStopIdx) : { years: [], data: {} };

	const productYearIdx = yearRowIndices[yearRowIndices.length - 1] ?? -1;
	const { years: productYears, data: products } =
		productYearIdx >= 0 && productYearIdx !== pnlYearIdx
			? extractSparseSection(rows, productYearIdx, rows.length)
			: { years: [], data: {} };

	return { years: pnlYears, pnl, productYears, products };
}

// ---------------------------------------------------------------------------
// Revenue sheet parser (GID 288496811)
// Clean tabular: first col = Year, remaining cols = products
// ---------------------------------------------------------------------------

function parseRevenueSheet(text: string): RevenueSheet {
	const rows = text.trim().split('\n').map(splitCSVLine);

	// Find the header row: first row where first non-empty cell is "Year"
	let headerIdx = -1;
	for (let i = 0; i < rows.length; i++) {
		const first = rows[i].find((c) => c.trim() !== '');
		if (first?.trim().toLowerCase() === 'year') { headerIdx = i; break; }
	}
	if (headerIdx < 0) return { years: [], products: {} };

	const headers = rows[headerIdx].map((h) => h.trim());
	const productCols = headers.slice(1).filter((h) => h !== '' && h !== 'Column 1');
	const productColIndices = productCols.map((p) => headers.indexOf(p));

	const years: string[] = [];
	const products: Record<string, number[]> = {};
	productCols.forEach((p) => (products[p] = []));

	for (let i = headerIdx + 1; i < rows.length; i++) {
		const row = rows[i];
		const yearCell = row[0]?.trim();
		if (!yearCell || !/^\d{4}$/.test(yearCell)) continue;
		years.push(yearCell);
		productCols.forEach((p, pi) => {
			products[p].push(parseCurrency(row[productColIndices[pi]] ?? ''));
		});
	}

	return { years, products };
}

// ---------------------------------------------------------------------------
// Expenses sheet parser (GID 768312552)
// Sparse layout; extract named "Total *" rows and key expense categories
// ---------------------------------------------------------------------------

function parseExpensesSheet(text: string): ExpensesSheet {
	const rows = text.trim().split('\n').map(splitCSVLine);

	// Find the year header row (col 3 onwards has 2026-2031)
	let yearCols: number[] = [];
	let years: string[] = [];
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		const found: number[] = [];
		const yrs: string[] = [];
		row.forEach((c, ci) => {
			if (/^\d{4}$/.test(c.trim())) { found.push(ci); yrs.push(c.trim()); }
		});
		if (found.length >= 4) { yearCols = found; years = yrs; break; }
	}
	if (years.length === 0) return { years: [], categories: [], totals: {} };

	// Collect "Total *" rows and named expense category rows
	const totals: Record<string, number[]> = {};
	const categories: ExpenseCategory[] = [];

	// Category labels we want to surface
	const CATEGORY_LABELS = [
		'Total Advertising',
		'Staff Expenses',
		'Total Tournament Expenses',
		'Total Documentary Expenses',
		'Total Production/Tournament Expenses',
		'Total Overhead Expenses',
		'Total Internal Tech',
		'Total Player sponsorship',
		'Total Travel & Entertainment',
		'Total E-Commerce',
		'Total Office Upgrades',
		'Total Other Expenses',
		'Total Department Budgets',
		'Total Buildout Expenses',
		'Total Commsions',
	];

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		const label = findExpenseLabel(row);
		if (!label) continue;

		const values = yearCols.map((ci) => parseCurrency(row[ci] ?? ''));
		if (values.every((v) => v === 0)) continue;

		if (CATEGORY_LABELS.includes(label)) {
			totals[label] = values;
			categories.push({ name: label.replace(/^Total /, ''), values });
		}
	}

	return { years, categories, totals };
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function extractSparseSection(
	rows: RawRow[],
	yearRowIdx: number,
	stopIdx: number
): { years: string[]; data: Record<string, number[]> } {
	const yearRow = rows[yearRowIdx];
	const seen = new Set<string>();
	const yearCols: number[] = [];
	const years: string[] = [];

	yearRow.forEach((cell, i) => {
		const t = cell.trim();
		if (/^\d{4}$/.test(t) && !seen.has(t)) { seen.add(t); yearCols.push(i); years.push(t); }
	});

	const data: Record<string, number[]> = {};
	let consecutiveBlanks = 0;

	for (let i = yearRowIdx + 1; i < stopIdx; i++) {
		const row = rows[i];
		const nonEmpty = row.filter((c) => c.trim() !== '');
		if (nonEmpty.length === 0) {
			consecutiveBlanks++;
			if (consecutiveBlanks >= 2 && Object.keys(data).length > 0) break;
			continue;
		}
		consecutiveBlanks = 0;
		if (nonEmpty.every((c) => /^-?\d+(\.\d+)?%$/.test(c.trim()))) continue;
		const label = findSparseLabel(row);
		if (!label) continue;
		if (label.startsWith('%')) continue;
		const values = yearCols.map((ci) => parseCurrency(row[ci] ?? ''));
		if (values.every((v) => v === 0) && nonEmpty.length <= 2) continue;
		data[label] = values;
	}

	return { years, data };
}

function findSparseLabel(row: RawRow): string | null {
	for (const cell of row) {
		const t = cell.trim();
		if (!t || /^\d{4}$/.test(t) || /^-?\d+(\.\d+)?%$/.test(t) || /^-?\$?[\d,]+(\.\d+)?$/.test(t)) continue;
		return t;
	}
	return null;
}

function findExpenseLabel(row: RawRow): string | null {
	// Label is in col 0 for most rows
	const t = row[0]?.trim();
	if (t && !/^\d{4}$/.test(t) && !/^-?\d+(\.\d+)?%$/.test(t) && !/^-?\$?[\d,]+(\.\d+)?$/.test(t)) {
		return t;
	}
	return null;
}

export function parseCurrency(raw: string): number {
	const cleaned = raw.trim().replace('$', '').replace(/,/g, '');
	const n = parseFloat(cleaned);
	return isNaN(n) ? 0 : n;
}

async function fetchCSV(url: string): Promise<string> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
	return res.text();
}

function splitCSVLine(line: string): string[] {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === '"') {
			if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
			else inQuotes = !inQuotes;
		} else if (ch === ',' && !inQuotes) {
			result.push(current); current = '';
		} else {
			current += ch;
		}
	}
	result.push(current);
	return result;
}
