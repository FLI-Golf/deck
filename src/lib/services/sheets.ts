import { PUBLIC_GOOGLE_SHEET_CSV_URL } from '$env/static/public';

type RawRow = string[];

export interface ParsedSheet {
	/** Year labels from the P&L section, e.g. ["2026","2027",...] */
	years: string[];
	/** P&L metrics keyed by row label, values aligned to years */
	pnl: Record<string, number[]>;
	/** Year labels from the product sales section */
	productYears: string[];
	/** Product revenue keyed by product name, values aligned to productYears */
	products: Record<string, number[]>;
}

/**
 * Fetches and parses the FLI Golf Google Sheet CSV.
 *
 * The sheet uses a sparse layout — no conventional header row. Structure:
 * - Row labels in column B or E depending on section
 * - Year labels in rows where 3+ cells match /^\d{4}$/
 * - Dollar values formatted as "$2,169,100" or "-$1,468,591"
 * - Percentage rows and blank rows interspersed throughout
 *
 * Sections are located by finding year-header rows, then reading downward
 * until two consecutive blank rows or a new year-header row is hit.
 */
export async function loadSheetData(): Promise<ParsedSheet> {
	const url = PUBLIC_GOOGLE_SHEET_CSV_URL;
	if (!url) throw new Error('PUBLIC_GOOGLE_SHEET_CSV_URL is not defined');

	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status} ${res.statusText}`);

	const text = await res.text();
	return parseSheet(text);
}

function parseSheet(text: string): ParsedSheet {
	const rows: RawRow[] = text.trim().split('\n').map(splitCSVLine);

	// Rows where 3+ cells are 4-digit years mark section boundaries
	const yearRowIndices = rows.reduce<number[]>((acc, row, i) => {
		if (row.filter((c) => /^\d{4}$/.test(c.trim())).length >= 3) acc.push(i);
		return acc;
	}, []);

	// P&L: first year-header row; stop before the next year-header row
	const pnlYearIdx = yearRowIndices[0] ?? -1;
	const pnlStopIdx = yearRowIndices[1] ?? rows.length;
	const { years: pnlYears, data: pnl } =
		pnlYearIdx >= 0
			? extractSection(rows, pnlYearIdx, pnlStopIdx)
			: { years: [], data: {} };

	// Products: last year-header row
	const productYearIdx = yearRowIndices[yearRowIndices.length - 1] ?? -1;
	const { years: productYears, data: products } =
		productYearIdx >= 0 && productYearIdx !== pnlYearIdx
			? extractSection(rows, productYearIdx, rows.length)
			: { years: [], data: {} };

	return { years: pnlYears, pnl, productYears, products };
}

/**
 * Reads data rows from yearRowIdx+1 up to (but not including) stopIdx.
 * Skips blank rows and percentage-only rows.
 * Stops early on two consecutive blank rows.
 */
function extractSection(
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
		if (/^\d{4}$/.test(t) && !seen.has(t)) {
			seen.add(t);
			yearCols.push(i);
			years.push(t);
		}
	});

	const data: Record<string, number[]> = {};
	let consecutiveBlanks = 0;

	for (let i = yearRowIdx + 1; i < stopIdx; i++) {
		const row = rows[i];
		const nonEmpty = row.filter((c) => c.trim() !== '');

		if (nonEmpty.length === 0) {
			consecutiveBlanks++;
			// Two consecutive blank rows = end of section
			if (consecutiveBlanks >= 2 && Object.keys(data).length > 0) break;
			continue;
		}

		consecutiveBlanks = 0;

		// Skip percentage-only rows
		if (nonEmpty.every((c) => /^-?\d+(\.\d+)?%$/.test(c.trim()))) continue;

		const label = findLabel(row);
		if (!label) continue;
		// Skip derived percentage rows like "% profit"
		if (label.startsWith('%')) continue;

		const values = yearCols.map((ci) => parseCurrency(row[ci] ?? ''));

		// Skip section-header rows (label only, no numeric data in year columns)
		if (values.every((v) => v === 0) && nonEmpty.length <= 2) continue;

		data[label] = values;
	}

	return { years, data };
}

/** Returns the first cell that looks like a text label (not a number, year, or %). */
function findLabel(row: RawRow): string | null {
	for (const cell of row) {
		const t = cell.trim();
		if (t === '') continue;
		if (/^\d{4}$/.test(t)) continue;
		if (/^-?\d+(\.\d+)?%$/.test(t)) continue;
		if (/^-?\$?[\d,]+(\.\d+)?$/.test(t)) continue;
		return t;
	}
	return null;
}

/** Strips $, commas; handles negative dollar strings like "-$1,234". */
export function parseCurrency(raw: string): number {
	const cleaned = raw.trim().replace('$', '').replace(/,/g, '');
	const n = parseFloat(cleaned);
	return isNaN(n) ? 0 : n;
}

/** Handles quoted CSV fields containing commas. */
function splitCSVLine(line: string): string[] {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === '"') {
			if (inQuotes && line[i + 1] === '"') {
				current += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (ch === ',' && !inQuotes) {
			result.push(current);
			current = '';
		} else {
			current += ch;
		}
	}
	result.push(current);
	return result;
}
