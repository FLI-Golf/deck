# Deck

A SvelteKit presentation app that renders D3 charts from a published Google Sheets CSV.

Google Sheets acts as the editable data source — update the sheet, refresh the app, see the new numbers.

---

## Stack

- SvelteKit + TypeScript
- D3 (scales, axes, line/arc generation)
- Google Sheets published as CSV
- Docker

---

## Architecture

```
Google Sheets (published CSV)
        ↓
src/lib/services/sheets.ts   — fetch + parse CSV
        ↓
src/lib/utils/transform.ts   — shape rows into typed chart data
        ↓
src/lib/components/charts/   — D3 chart components
src/lib/components/ui/       — KPI cards
        ↓
src/routes/+page.svelte      — presentation page
```

Data flows client-side via `onMount`. No backend or database required.

---

## Environment variable

Create a `.env` file in the project root:

```
PUBLIC_GOOGLE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv
```

The sheet must be published: **File → Share → Publish to web → CSV**.

---

## Sheet format

The app expects a header row with `month` and `revenue` columns:

| month | revenue |
|-------|---------|
| Jan   | 10000   |
| Feb   | 15000   |
| Mar   | 18000   |

Rules:
- First row must be headers
- Numeric fields must contain plain numbers (no `$`, no commas)
- No merged cells or decorative rows

---

## Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## Docker

Build and run:

```bash
docker build -t deck .
docker run -p 5173:5173 --env-file .env deck
```

Or with Compose:

```bash
docker compose up --build
```

---

## Project structure

```
src/
  lib/
    components/
      charts/
        LineChart.svelte    — line chart for time-series data
        BarChart.svelte     — bar chart for category comparison
        DonutChart.svelte   — donut chart for composition
      ui/
        KpiCard.svelte      — headline number card with optional delta
    services/
      sheets.ts             — CSV fetch and parse
    utils/
      transform.ts          — typed row shapes and chart-data converters
      types.ts              — shared DataPoint, SeriesData, SheetData types
  routes/
    +page.svelte            — main presentation page
```

---

## Extending

- **Multiple charts**: add more columns to the sheet and use `toSeriesData()` for multi-series line charts
- **Multiple sheets**: add additional CSV URL env vars and fetch them in parallel
- **Auto-refresh**: call `loadSheetData()` on an interval for live dashboards
- **Slide routing**: add `src/routes/slide-[n]/` pages for keyboard-navigable presentation mode
