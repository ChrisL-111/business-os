import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { saleTime, salesInPeriod, summarizeSales } from './analytics';
import type { AnalyticsSale } from './analytics';

const currency = (value: number) => value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function AnalyticsPage({ sales, onViewSales }: { sales: AnalyticsSale[]; onViewSales: () => void }) {
  const [period, setPeriod] = useState('all');
  const filtered = salesInPeriod(sales, period === 'all' ? null : Number(period), Date.now());
  const summary = summarizeSales(filtered);
  const undated = sales.filter(sale => saleTime(sale) === null).length;
  const maximum = Math.max(1, ...summary.months.flatMap(month => [Math.abs(month.revenue), Math.abs(month.profit)]));
  const metrics = [
    ['Sales revenue', currency(summary.revenue), `${summary.orders} orders`],
    ['Gross profit', currency(summary.profit), 'Before operating expenses'],
    ['Gross margin', summary.margin === null ? '—' : `${summary.margin.toFixed(1)}%`, 'Gross profit / revenue'],
    ['Average order', currency(summary.average), `${summary.units} units sold`],
  ];
  return <div className="content">
    <section className="page-head">
      <div><p className="eyebrow">PERFORMANCE</p><h1>Analytics</h1><p className="subhead">Understand your sales, products, and customer relationships.</p></div>
      <label className="analytics-period">Period<select value={period} onChange={event => setPeriod(event.target.value)}><option value="all">All time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label>
    </section>
    <section className="metrics">{metrics.map(([label, value, detail]) => <div className="metric card" key={label}><div className="metric-top">{label}</div><strong>{value}</strong><div className="metric-bottom">{detail}</div></div>)}</section>
    <p className="analytics-note">Based on recorded sales and their original costs. Deleting a sale updates every total.</p>
    {undated > 0 && <p className="analytics-note">{undated} sales have no usable date. They count toward all-time totals but are excluded from period filters and the monthly chart.</p>}
    {filtered.length === 0 ? <section className="card analytics-empty"><h2>{sales.length === 0 ? 'Your sales story starts here.' : 'No sales in this period.'}</h2><p>{sales.length === 0 ? 'Record a sale to see your performance, top products, and customers.' : 'Choose another period or record a new sale.'}</p><button className="primary" onClick={onViewSales}>Go to Sales <ArrowUpRight size={15} /></button></section> : <>
      <section className="card analytics-trend">
        <div className="money-ledger-header"><div><h2>Monthly performance</h2><p>Revenue and gross profit for sales within the selected period. Months with recorded sales are shown.</p></div></div>
        <div className="analytics-legend"><span><i /> Revenue</span><span><i className="profit" /> Gross profit</span></div>
        {summary.months.length === 0 ? <p className="analytics-note">No dated sales to chart.</p> : <div className="analytics-months">{summary.months.map(month => <div className="analytics-month" key={month.key}><strong>{month.label}</strong><div className="analytics-bars"><div><span className="analytics-bar" style={{ width: `${Math.abs(month.revenue) / maximum * 100}%` }} /><span>Revenue {currency(month.revenue)}</span></div><div><span className={`analytics-bar profit ${month.profit < 0 ? 'loss' : ''}`} style={{ width: `${Math.abs(month.profit) / maximum * 100}%` }} /><span>Gross profit {currency(month.profit)}</span></div></div></div>)}</div>}
      </section>
      <div className="analytics-rankings">{(['products', 'customers'] as const).map(group => <section className="card" key={group}>
        <div className="money-ledger-header"><div><h2>Top {group}</h2><p>Ranked by revenue · {summary[group].length} {group} in this period</p></div></div>
        <div className="customer-table-scroll"><table className="customer-data-table"><thead><tr><th scope="col">{group === 'products' ? 'Product' : 'Customer'}</th><th scope="col">Orders</th><th scope="col">Units</th><th scope="col">Revenue</th><th scope="col">Gross profit</th></tr></thead><tbody>{summary[group].slice(0, 10).map(item => <tr key={item.key}><th scope="row">{item.name}</th><td>{item.orders}</td><td>{item.units}</td><td>{currency(item.revenue)}</td><td className={item.profit >= 0 ? 'positive' : 'negative'}>{currency(item.profit)}</td></tr>)}</tbody></table></div>
      </section>)}</div>
      <button className="text-btn analytics-sales-link" onClick={onViewSales}>View and manage source sales <ArrowUpRight size={15} /></button>
    </>}
  </div>;
}
