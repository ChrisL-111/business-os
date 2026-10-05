import { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { filterSheet, projectBusinessSheet, sheetTotals } from './businessSheet';
import type { SheetTransaction } from './businessSheet';
import type { AnalyticsSale } from './analytics';

const currency = (value: number) => value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function BusinessSheetPage({ sales, transactions, onViewSource }: {
  sales: AnalyticsSale[]; transactions: SheetTransaction[]; onViewSource: (source: 'Sales' | 'Money') => void;
}) {
  const [kind, setKind] = useState('all');
  const [query, setQuery] = useState('');
  const rows = projectBusinessSheet(sales, transactions);
  const filtered = filterSheet(rows, kind, query);
  const totals = sheetTotals(filtered);
  const metrics = [
    ['Income recorded', currency(totals.inflows), 'Sales and other income'],
    ['Expenses recorded', currency(totals.outflows), 'Money expense entries'],
    ['Net recorded amount', currency(totals.net), 'Income minus recorded expenses'],
    ['Events', String(totals.count), 'Linked sales counted once'],
  ];
  return <div className="content">
    <section className="page-head"><div><p className="eyebrow">BUSINESS RECORDS</p><h1>Business Sheet</h1><p className="subhead">Sales, income, and expenses together. Each linked sale appears once.</p></div></section>
    <section className="metrics">{metrics.map(([label, value, detail]) => <div className="metric card" key={label}><div className="metric-top">{label}</div><strong>{value}</strong><div className="metric-bottom">{detail}</div></div>)}</section>
    <p className="sheet-note">Totals reflect your current filters. Net recorded amount is not business profit; inventory costs are shown in sale gross profit.</p>
    <section className="card business-sheet">
      <div className="money-ledger-header sheet-controls">
        <div><h2>Economic events</h2><p>{filtered.length} of {rows.length} events · Edit records in their source module.</p></div>
        <div className="sheet-filters">
          <label className="sheet-kind">Show<select value={kind} onChange={event => setKind(event.target.value)}><option value="all">All events</option><option value="sale">Sales</option><option value="income">Other income</option><option value="expense">Expenses</option></select></label>
          <label className="customer-search"><Search size={16} aria-hidden="true" /><input aria-label="Search business events" placeholder="Search names, products, IDs..." value={query} onChange={event => setQuery(event.target.value)} /></label>
        </div>
      </div>
      <div className="customer-table-scroll"><table className="customer-data-table sheet-data"><thead><tr><th scope="col">Event</th><th scope="col">Customer / vendor</th><th scope="col">Description</th><th scope="col">Date</th><th scope="col">Units</th><th scope="col">Amount</th><th scope="col">Gross profit</th><th scope="col">Source</th></tr></thead>
        <tbody>{filtered.map(row => <tr key={row.key}>
          <th scope="row"><span className={`sheet-badge ${row.kind}`}>{row.kind === 'sale' ? 'Sale' : row.kind === 'income' ? 'Income' : 'Expense'}</span><small>#{row.id}</small></th>
          <td>{row.name}</td><td>{row.detail}{row.orphan && <small className="sheet-warning">Linked sale is missing</small>}</td><td>{row.date}</td><td>{row.units ?? '—'}</td>
          <td className={row.amount >= 0 ? 'positive' : 'negative'}>{currency(row.amount)}</td>
          <td className={row.profit !== null && row.profit < 0 ? 'negative' : ''}>{row.profit === null ? '—' : currency(row.profit)}</td>
          <td><button className="text-btn" onClick={() => onViewSource(row.source)} aria-label={`View ${row.source} for event ${row.id}`}>{row.source}<ArrowUpRight size={13} /></button></td>
        </tr>)}</tbody>
      </table></div>
      {filtered.length === 0 && <div className="ledger-empty">{rows.length === 0 ? 'Record a sale or Money transaction to start your Business Sheet.' : 'No events match these filters.'}{rows.length > 0 && <button className="text-btn sheet-reset" onClick={() => { setKind('all'); setQuery(''); }}>Clear filters</button>}</div>}
    </section>
  </div>;
}
