export type AnalyticsSale = {
  id: number;
  productId: number;
  productName: string;
  customer: string;
  quantity: number;
  total: number;
  grossProfit: number;
  date: string;
  createdAt?: string;
};

export function saleTime(sale: AnalyticsSale): number | null {
  // Existing sales use Date.now() IDs and a display-only "Just now" date.
  const time = sale.createdAt ? Date.parse(sale.createdAt) :
    sale.id >= 1_000_000_000_000 ? sale.id :
    /^\d{4}-\d{2}-\d{2}/.test(sale.date) ? Date.parse(sale.date) : NaN;
  return Number.isFinite(time) ? time : null;
}

export function salesInPeriod(sales: AnalyticsSale[], days: number | null, now: number) {
  if (days === null) return sales;
  const start = new Date(now);
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return sales.filter(sale => {
    const time = saleTime(sale);
    return time !== null && time >= start.getTime() && time <= now;
  });
}

type Ranking = { key: string; name: string; orders: number; units: number; revenue: number; profit: number };
export function summarizeSales(sales: AnalyticsSale[]) {
  const products = new Map<string, Ranking>();
  const customers = new Map<string, Ranking>();
  const months = new Map<string, { key: string; label: string; revenue: number; profit: number }>();
  let revenue = 0, profit = 0, units = 0, undated = 0;
  for (const sale of sales) {
    revenue += sale.total;
    profit += sale.grossProfit;
    units += sale.quantity;
    const name = sale.customer.trim().replace(/\s+/g, ' ') || 'Unknown customer';
    for (const [map, key, label] of [
      [products, String(sale.productId), sale.productName],
      [customers, name.toLowerCase(), name],
    ] as const) {
      const item = map.get(key) ?? { key, name: label, orders: 0, units: 0, revenue: 0, profit: 0 };
      item.orders += 1;
      item.units += sale.quantity;
      item.revenue += sale.total;
      item.profit += sale.grossProfit;
      map.set(key, item);
    }
    const time = saleTime(sale);
    if (time === null) { undated += 1; continue; }
    const date = new Date(time);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const month = months.get(key) ?? { key, label: date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }), revenue: 0, profit: 0 };
    month.revenue += sale.total;
    month.profit += sale.grossProfit;
    months.set(key, month);
  }
  const ranked = (map: Map<string, Ranking>) => [...map.values()].sort((a, b) => b.revenue - a.revenue || a.name.localeCompare(b.name));
  return { revenue, profit, units, orders: sales.length, margin: revenue === 0 ? null : profit / revenue * 100,
    average: sales.length === 0 ? 0 : revenue / sales.length, undated,
    products: ranked(products), customers: ranked(customers), months: [...months.values()].sort((a, b) => a.key.localeCompare(b.key)) };
}
