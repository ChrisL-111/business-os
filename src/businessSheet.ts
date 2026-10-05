import type { AnalyticsSale } from './analytics';

export type SheetTransaction = {
  id: number; name: string; detail: string; date: string; amount: number;
  sourceType?: 'sale'; sourceId?: number;
};
export type SheetRow = {
  key: string; id: number; kind: 'sale' | 'income' | 'expense';
  name: string; detail: string; date: string; amount: number;
  units: number | null; profit: number | null; source: 'Sales' | 'Money'; orphan: boolean;
};

// Only explicit source links identify duplicates. Similar names/amounts are separate events.
export function projectBusinessSheet(sales: AnalyticsSale[], transactions: SheetTransaction[]): SheetRow[] {
  const saleIds = new Set(sales.map(sale => sale.id));
  const rows: SheetRow[] = sales.map(sale => ({
    key: `sale-${sale.id}`, id: sale.id, kind: 'sale', name: sale.customer,
    detail: `${sale.quantity} × ${sale.productName}`, date: sale.date,
    amount: sale.total, units: sale.quantity, profit: sale.grossProfit, source: 'Sales', orphan: false,
  }));
  for (const transaction of transactions) {
    if (transaction.sourceType === 'sale' && transaction.sourceId !== undefined && saleIds.has(transaction.sourceId)) continue;
    rows.push({ key: `money-${transaction.id}`, id: transaction.id,
      kind: transaction.amount < 0 ? 'expense' : 'income', name: transaction.name,
      detail: transaction.detail, date: transaction.date, amount: transaction.amount,
      units: null, profit: null, source: transaction.sourceType === 'sale' ? 'Sales' : 'Money',
      orphan: transaction.sourceType === 'sale',
    });
  }
  return rows.sort((a, b) => b.id - a.id || a.key.localeCompare(b.key));
}

export function filterSheet(rows: SheetRow[], kind: string, query: string): SheetRow[] {
  const search = query.trim().toLowerCase();
  return rows.filter(row => (kind === 'all' || row.kind === kind) &&
    `${row.name} ${row.detail} ${row.date} ${row.id} ${row.source}`.toLowerCase().includes(search));
}

export function sheetTotals(rows: SheetRow[]) {
  const inflows = rows.reduce((sum, row) => sum + Math.max(0, row.amount), 0);
  const outflows = rows.reduce((sum, row) => sum + Math.max(0, -row.amount), 0);
  return { inflows, outflows, net: inflows - outflows, count: rows.length };
}
