/**
 * 成批輸入格式：國外賽事 \t 比賽日期 \t 賽事名稱 \t 比賽國家 \t 比賽城市
 * 國外賽事：O = 國外 (isDomestic false)，X = 國內 (isDomestic true)，空 = 國內
 * 比賽日期：2026/12/19 或 2026/12/12-13 → 正規化為 YYYY-MM-DD（區間取首日）
 */
export interface BatchEventRow {
  name: string;
  eventDate: string;
  location: string;
  isDomestic: boolean;
}

const HEADER_MARKERS = ['國外賽事', '比賽日期', '賽事名稱', '比賽國家', '比賽城市'];

function normalizeDate(raw: string): string {
  const s = raw.trim();
  if (!s) return '';
  // 2026/12/19 → 2026-12-19
  const slash = s.replace(/\//g, '-');
  // 2026-12-12-13 → 取前 10 字 2026-12-12
  const range = slash.split('-');
  if (range.length >= 3) {
    const y = range[0];
    const m = range[1]?.padStart(2, '0') ?? '01';
    const d = (range[2] ?? '01').padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return slash.slice(0, 10);
}

function parseLine(line: string, colCount: number): string[] {
  const parts = line.split(/\t/);
  if (parts.length >= colCount) return parts.map((p) => p.trim());
  const byComma = line.split(',').map((p) => p.trim());
  if (byComma.length >= colCount) return byComma;
  return parts.map((p) => p.trim());
}

export function parseBatchImport(text: string): BatchEventRow[] {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const colCount = 5;
  let start = 0;
  const firstCells = parseLine(lines[0], colCount);
  const isHeader = HEADER_MARKERS.some((m) => firstCells[0]?.includes(m) || firstCells[1]?.includes(m));
  if (isHeader) start = 1;

  const rows: BatchEventRow[] = [];
  for (let i = start; i < lines.length; i++) {
    const cells = parseLine(lines[i], colCount);
    const [foreign, dateRaw, name, country, city] = cells;
    const col = (foreign ?? '').trim().toUpperCase();
    const isDomestic = col !== 'O';
    const eventDate = normalizeDate(dateRaw ?? '');
    const location = [country, city].filter(Boolean).join(' ').trim() || '—';
    if (!name?.trim()) continue;
    rows.push({
      name: name.trim(),
      eventDate: eventDate || new Date().toISOString().slice(0, 10),
      location,
      isDomestic,
    });
  }
  return rows;
}

export const BATCH_IMPORT_PLACEHOLDER = `國外賽事	比賽日期	賽事名稱	比賽國家	比賽城市
X	2026/12/19	BIXBI CUP (暫定)	台灣	
O	2026/12/12-13	2026 光速盃 R6	台灣`;
