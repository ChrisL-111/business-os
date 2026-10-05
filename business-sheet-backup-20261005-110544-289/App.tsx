import AnalyticsPage from "./AnalyticsPage";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, WalletCards, Package, ShoppingCart, Users,
  Table2, BarChart3, Settings, Search, Bell, Plus, ArrowUpRight,
  ArrowDownRight, MoreHorizontal, ChevronDown, CircleAlert, Sparkles
} from "lucide-react";

type NavItem = { label: string; icon: React.ElementType };

const nav: NavItem[] = [
  { label: "Command Center", icon: LayoutDashboard },
  { label: "Money", icon: WalletCards },
  { label: "Inventory", icon: Package },
  { label: "Sales", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Business Sheet", icon: Table2 },
  { label: "Analytics", icon: BarChart3 },
];

type Transaction = {
  id: number;
  name: string;
  detail: string;
  date: string;
  amount: number;
  positive: boolean;

  sourceType?: "sale";
  sourceId?: number;
};

type Product = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  cost: number;
  price: number;
  reorderLevel: number;
};

type Sale = {
  id: number;
  productId: number;
  productName: string;
  customer: string;
  quantity: number;
  pricePerUnit: number;
  costPerUnit: number;
  total: number;
  grossProfit: number;
  date: string;
  createdAt?: string;
};

const initialTransactions: Transaction[] = [
  {
    id: 1,
    name: "Acme Industries",
    detail: "Invoice #1048",
    date: "Today, 4:12 PM",
    amount: 12400,
    positive: true,
  },
  {
    id: 2,
    name: "Northstar Materials",
    detail: "Inventory purchase",
    date: "Today, 1:46 PM",
    amount: -4820,
    positive: false,
  },
  {
    id: 3,
    name: "Ridgeway Market",
    detail: "Invoice #1047",
    date: "Yesterday",
    amount: 3275,
    positive: true,
  },
  {
    id: 4,
    name: "Summit Logistics",
    detail: "Shipping",
    date: "Yesterday",
    amount: -690,
    positive: false,
  },
];

const initialProducts: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 14",
    sku: "MBP-14",
    quantity: 12,
    cost: 1500,
    price: 2000,
    reorderLevel: 5,
  },
  {
    id: 2,
    name: "iPhone 17",
    sku: "IP17-01",
    quantity: 4,
    cost: 700,
    price: 1000,
    reorderLevel: 5,
  },
  {
    id: 3,
    name: "AirPods Pro",
    sku: "APP-03",
    quantity: 0,
    cost: 150,
    price: 250,
    reorderLevel: 8,
  },
];

const initialSales: Sale[] = [];

function loadTransactions(): Transaction[] {
  const savedTransactions = localStorage.getItem("business-os-transactions");

  if (!savedTransactions) {
    return initialTransactions;
  }

  try {
    return JSON.parse(savedTransactions) as Transaction[];
  } catch {
    return initialTransactions;
  }
}

function loadProducts(): Product[] {
  const savedProducts = localStorage.getItem(
    "business-os-products"
  );

  if (!savedProducts) {
    return initialProducts;
  }

  try {
    return JSON.parse(savedProducts) as Product[];
  } catch {
    return initialProducts;
  }
}

function loadSales(): Sale[] {
  const savedSales = localStorage.getItem("business-os-sales");

  if (!savedSales) {
    return initialSales;
  }

  try {
    return JSON.parse(savedSales) as Sale[];
  } catch {
    return initialSales;
  }
}

function money(n: number) {
  return `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString()}`;
}

export default function App() {
  const [active, setActive] = useState("Command Center");
  const [transactions, setTransactions] =
    useState<Transaction[]>(loadTransactions);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [products, setProducts] =
  useState<Product[]>(loadProducts);
  const [showProductForm, setShowProductForm] =
    useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
  const [sales, setSales] =
  useState<Sale[]>(loadSales);
  const [showSaleForm, setShowSaleForm] =
    useState(false);
  useEffect(() => {
    localStorage.setItem(
      "business-os-transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem(
      "business-os-products",
      JSON.stringify(products)
    );
  }, [products]);
  useEffect(() => {
    localStorage.setItem(
      "business-os-sales",
      JSON.stringify(sales)
    );
  }, [sales]);
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>Business OS</strong>
            <span>Acme Corporation</span>
          </div>
        </div>

        <div className="workspace">
          <span>WORKSPACE</span>
          <button>Acme Corporation <ChevronDown size={15} /></button>
        </div>

        <nav>
          <div className="nav-label">MANAGE</div>
          {nav.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "active" : ""}`}
              onClick={() => setActive(label)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          ))}
          <div className="nav-label reports">SYSTEM</div>
          <button className="nav-item"><Settings size={18} /><span>Settings</span></button>
        </nav>

        <div className="sidebar-bottom">
          <div className="health-dot" />
          <div><strong>All systems healthy</strong><span>Synced just now</span></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="breadcrumbs"><span>Acme Corporation</span><b>/</b><strong>{active}</strong></div>
          <div className="top-actions">
            <div className="search"><Search size={17} /><input placeholder="Search anything..." /><kbd>⌘ K</kbd></div>
            <button className="icon-btn"><Bell size={18} /><i /></button>
            <div className="avatar">CL</div>
          </div>
        </header>

      {active === "Command Center" ? (
        <Dashboard
          transactions={transactions}
          onNewTransaction={() => {
            setEditingTransaction(null);
            setShowTransactionForm(true);
          }}
        />
      ) : active === "Money" ? (
        <MoneyPage
          transactions={transactions}
          onNewTransaction={() => {
            setEditingTransaction(null);
            setShowTransactionForm(true);
          }}
          onEditTransaction={(transaction) => {
            setEditingTransaction(transaction);
            setShowTransactionForm(true);
          }}
          onDeleteTransaction={(id) => {
            setTransactions((current) =>
              current.filter((transaction) => transaction.id !== id)
            );
      
          }}
        />      
      ) : active === "Inventory" ? (
        <InventoryPage
          products={products}
          onAddProduct={() => {
            setEditingProduct(null);
            setShowProductForm(true);
          }}
          onEditProduct={(product) => {
            setEditingProduct(product);
            setShowProductForm(true);
          }}
          onDeleteProduct={(id) => {
            setProducts((current) =>
              current.filter((product) => product.id !== id)
            );
          }}
        />
      ) : active === "Sales" ? (
        <SalesPage
          sales={sales}
          onNewSale={() => setShowSaleForm(true)}
          onDeleteSale={(sale) => {
            // Remove the sale
            setSales((current) =>
              current.filter((item) => item.id !== sale.id)
            );

            // Remove the Money transaction created by this sale
            setTransactions((current) =>
              current.filter(
                (transaction) =>
                  !(
                    transaction.sourceType === "sale" &&
                    transaction.sourceId === sale.id
                  )
              )
            );

            // Return the sold units to inventory
            setProducts((current) =>
              current.map((product) =>
                product.id === sale.productId
                  ? {
                      ...product,
                      quantity:
                        product.quantity + sale.quantity,
                    }
                  : product
              )
            );
          }}
        />
      ) : active === "Customers" ? (
        <CustomersPage sales={sales} onNewSale={() => setShowSaleForm(true)} onViewSales={() => setActive("Sales")} />
      ) : active === "Analytics" ? (
        <AnalyticsPage sales={sales} onViewSales={() => setActive("Sales")} />
      ) : (
        <Placeholder title={active} />
      )}

      {showTransactionForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={() => {
            setShowTransactionForm(false);
            setEditingTransaction(null);
          }}
          onSave={(transaction) => {
            setTransactions((current) => {
              const alreadyExists = current.some(
                (item) => item.id === transaction.id
              );

              if (alreadyExists) {
                return current.map((item) =>
                  item.id === transaction.id
                    ? transaction
                    : item
                );
              }

              return [transaction, ...current];
            });

            setShowTransactionForm(false);
            setEditingTransaction(null);
          }}
        />
      )}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSave={(product) => {
            setProducts((current) => {
              const exists = current.some(
                (item) => item.id === product.id
              );

              if (exists) {
                return current.map((item) =>
                  item.id === product.id ? product : item
                );
              }

              return [product, ...current];
            });

            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
      {showSaleForm && (
        <SaleForm
          products={products}
          onClose={() => setShowSaleForm(false)}
          onSave={(sale) => {
            // 1. Record the sale
            setSales((current) => [sale, ...current]);

            // 2. Reduce inventory
            setProducts((current) =>
              current.map((product) =>
                product.id === sale.productId
                  ? {
                      ...product,
                      quantity: product.quantity - sale.quantity,
                    }
                  : product
              )
            );

            // 3. Create the Money transaction
            const transaction: Transaction = {
              id: Date.now() + 1,
              name: sale.customer,
              detail: `${sale.quantity} × ${sale.productName}`,
              date: sale.date,
              amount: sale.total,
              positive: true,
              sourceType: "sale",
              sourceId: sale.id,
            };

            setTransactions((current) => [
              transaction,
              ...current,
            ]);

            setShowSaleForm(false);
          }}
        />
      )}
      </main>
    </div>
  );
}

  function Dashboard({
  transactions,
  onNewTransaction,
  }: {
  transactions: Transaction[];
  onNewTransaction: () => void;
  }) {
  const revenue = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce(
      (total, transaction) => total + Math.abs(transaction.amount),
      0
    );

  const netCashFlow = revenue - expenses;

  // Starting cash balance for our demo company.
  // Later this will come from the database/company settings.
  const startingCash = 100000;

  const cashPosition = startingCash + netCashFlow;
  return (
    <div className="content">
      <section className="page-head">
        <div>
          <p className="eyebrow">MONDAY, SEPTEMBER 14, 2026</p>
          <h1>Good evening.</h1>
          <p className="subhead">Here’s what’s happening across your business.</p>
        </div>
      <button className="primary" onClick={onNewTransaction}>
        <Plus size={17} />
        New transaction
      </button>
      </section>

      <section className="ai-strip">
        <div className="ai-icon"><Sparkles size={17} /></div>
        <div className="ai-copy">
          <strong>Business insight</strong>
          <span>Revenue is up 8.4% this month, but gross margin has slipped 2.1 points. Inventory costs are the main driver.</span>
        </div>
        <button className="text-btn">Investigate <ArrowUpRight size={15} /></button>
      </section>

      <section className="metrics">
        <Metric
          label="Revenue"
          value={money(revenue)}
          change="+"
          positive={true}
          detail={`${transactions.filter((t) => t.amount > 0).length} income transactions`}
        />

        <Metric
          label="Expenses"
          value={money(expenses)}
          change="-"
          positive={false}
          detail={`${transactions.filter((t) => t.amount < 0).length} expense transactions`}
        />

        <Metric
          label="Net cash flow"
          value={money(netCashFlow)}
          change={netCashFlow >= 0 ? "+" : "-"}
          positive={netCashFlow >= 0}
          detail="revenue minus expenses"
        />

        <Metric
          label="Cash position"
          value={money(cashPosition)}
          change={netCashFlow >= 0 ? "+" : "-"}
          positive={netCashFlow >= 0}
          detail="current estimated cash"
        />
      </section>

      <div className="grid">
        <section className="card chart-card">
          <div className="card-head">
            <div><h2>Financial performance</h2><p>Revenue and expenses over the last 30 days</p></div>
            <button className="select">Last 30 days <ChevronDown size={14} /></button>
          </div>
          <div className="chart">
            <div className="ylabels"><span>$40k</span><span>$30k</span><span>$20k</span><span>$10k</span><span>$0</span></div>
            <div className="plot">
              {[0,1,2,3,4].map(i => <div className="gridline" style={{ top: `${i*25}%` }} key={i} />)}
              <svg viewBox="0 0 700 240" preserveAspectRatio="none">
                <path d="M0 194 C45 185 65 166 105 173 S165 148 205 155 S260 104 305 126 S360 93 405 105 S465 75 505 88 S555 52 600 67 S655 33 700 42" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M0 218 C55 210 75 199 120 204 S175 183 215 192 S270 170 315 180 S375 157 420 169 S470 145 515 157 S575 131 620 143 S665 121 700 128" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" opacity=".45" />
              </svg>
              <div className="xlabels"><span>Aug 16</span><span>Aug 23</span><span>Aug 30</span><span>Sep 6</span><span>Sep 14</span></div>
            </div>
          </div>
          <div className="legend"><span><i className="line" /> Revenue</span><span><i className="dash" /> Expenses</span></div>
        </section>

        <section className="card">
          <div className="card-head"><div><h2>Needs attention</h2><p>Things that may need action</p></div><button className="more"><MoreHorizontal /></button></div>
          <div className="alerts">
            <Alert icon={<CircleAlert />} title="3 products are low on stock" detail="Potential stockout within 14 days" action="Review inventory" />
            <Alert icon={<WalletCards />} title="$18,420 in overdue invoices" detail="7 customers are past due" action="View receivables" />
            <Alert icon={<BarChart3 />} title="Margin dropped 2.1%" detail="Material costs increased this month" action="Analyze margin" />
          </div>
        </section>
      </div>

      <section className="card transactions">
        <div className="card-head">
          <div><h2>Recent activity</h2><p>The latest economic events across your business</p></div>
          <button className="text-btn">View all <ArrowUpRight size={15} /></button>
        </div>
        <div className="table">
          {transactions.map((t) => (
            <div className="tr" key={t.name + t.detail}>
              <div className={`tx-icon ${t.positive ? "in" : "out"}`}>{t.positive ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}</div>
              <div className="tx-name"><strong>{t.name}</strong><span>{t.detail}</span></div>
              <div className="tx-date">{t.date}</div>
              <div className={`amount ${t.positive ? "positive" : "negative"}`}>{money(t.amount)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
function MoneyPage({
  transactions,
  onNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
}: {
  transactions: Transaction[];
  onNewTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: number) => void;
}) {
  const [filter, setFilter] =
    useState<"all" | "income" | "expense">("all");

  const revenue = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce(
      (total, transaction) => total + Math.abs(transaction.amount),
      0
    );
  const netCashFlow = revenue - expenses;

  const startingCash = 100000;
  const cashPosition = startingCash + netCashFlow;

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "income") {
      return transaction.amount > 0;
    }

    if (filter === "expense") {
      return transaction.amount < 0;
    }

    return true;
  });

  return (
    <div className="content">
      <section className="page-head">
        <div>
          <p className="eyebrow">FINANCE</p>
          <h1>Money</h1>
          <p className="subhead">
            Track every dollar moving through your business.
          </p>
        </div>

        <button className="primary" onClick={onNewTransaction}>
          <Plus size={17} />
          New transaction
        </button>
      </section>

      <section className="metrics">
        <Metric
          label="Cash position"
          value={money(cashPosition)}
          change={netCashFlow >= 0 ? "+" : "-"}
          positive={netCashFlow >= 0}
          detail="estimated available cash"
        />

        <Metric
          label="Total income"
          value={money(revenue)}
          change="+"
          positive={true}
          detail={`${transactions.filter((t) => t.amount > 0).length} transactions`}
        />

        <Metric
          label="Total expenses"
          value={money(expenses)}
          change="-"
          positive={false}
          detail={`${transactions.filter((t) => t.amount < 0).length} transactions`}
        />

        <Metric
          label="Net cash flow"
          value={money(netCashFlow)}
          change={netCashFlow >= 0 ? "+" : "-"}
          positive={netCashFlow >= 0}
          detail="income minus expenses"
        />
      </section>

      <section className="card money-ledger">
        <div className="money-ledger-header">
          <div>
            <h2>Transaction ledger</h2>
            <p>
              All recorded income and expenses across your business.
            </p>
          </div>

          <div className="filter-buttons">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={filter === "income" ? "active" : ""}
              onClick={() => setFilter("income")}
            >
              Income
            </button>

            <button
              className={filter === "expense" ? "active" : ""}
              onClick={() => setFilter("expense")}
            >
              Expenses
            </button>
          </div>
        </div>

        <div className="ledger-columns">
          <span>Customer / Vendor</span>
          <span>Description</span>
          <span>Date</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Actions</span>
        </div>

        <div className="ledger-body">
          {filteredTransactions.length === 0 ? (
            <div className="ledger-empty">
              No transactions found.
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                className="ledger-row"
                key={transaction.id}
              >
                <div className="ledger-company">
                  <div
                    className={`tx-icon ${
                      transaction.positive ? "in" : "out"
                    }`}
                  >
                    {transaction.positive ? (
                      <ArrowDownRight size={16} />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                  </div>

                  <strong>{transaction.name}</strong>
                </div>

                <span>{transaction.detail}</span>

                <span>{transaction.date}</span>

                <span>
                  <span
                    className={`transaction-type ${
                      transaction.positive
                        ? "income"
                        : "expense"
                    }`}
                  >
                    {transaction.positive
                      ? "Income"
                      : "Expense"}
                  </span>
                </span>

                <strong
                  className={
                    transaction.positive
                      ? "positive"
                      : "negative"
                  }
                >
                  {money(transaction.amount)}
                </strong>
                <div className="ledger-actions">
                  {transaction.sourceType === "sale" ? (
                    <span className="linked-record">
                      Managed by Sales
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          onEditTransaction(transaction)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete"
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Delete the transaction for ${transaction.name}?`
                          );

                          if (confirmed) {
                            onDeleteTransaction(transaction.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
function InventoryPage({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
}) {
  const inventoryValue = products.reduce(
    (total, product) =>
      total + product.quantity * product.cost,
    0
  );

  const potentialRevenue = products.reduce(
    (total, product) =>
      total + product.quantity * product.price,
    0
  );

  const totalUnits = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const lowStockCount = products.filter(
    (product) =>
      product.quantity <= product.reorderLevel
  ).length;

  return (
    <div className="content">
      <section className="page-head">
        <div>
          <p className="eyebrow">OPERATIONS</p>
          <h1>Inventory</h1>
          <p className="subhead">
            Track products, stock levels, cost, and selling price.
          </p>
        </div>

        <button
          className="primary"
          onClick={onAddProduct}
        >
          <Plus size={17} />
          Add product
        </button>
      </section>

      <section className="metrics">
        <Metric
          label="Inventory value"
          value={money(inventoryValue)}
          change="+"
          positive={true}
          detail="at cost"
        />

        <Metric
          label="Products"
          value={products.length.toString()}
          change="+"
          positive={true}
          detail={`${totalUnits} total units`}
        />

        <Metric
          label="Low stock"
          value={lowStockCount.toString()}
          change={lowStockCount > 0 ? "!" : "✓"}
          positive={lowStockCount === 0}
          detail="products need attention"
          alert={lowStockCount > 0}
        />

        <Metric
          label="Potential revenue"
          value={money(potentialRevenue)}
          change="+"
          positive={true}
          detail="if all stock sells"
        />
      </section>

      <section className="card inventory-table">
        <div className="money-ledger-header">
          <div>
            <h2>Products</h2>
            <p>
              Current inventory across your business.
            </p>
          </div>
        </div>

        <div className="inventory-columns">
          <span>Product</span>
          <span>SKU</span>
          <span>Stock</span>
          <span>Cost</span>
          <span>Price</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {products.map((product) => {
          const outOfStock = product.quantity === 0;

          const lowStock =
            !outOfStock &&
            product.quantity <= product.reorderLevel;

          return (
            <div
              className="inventory-row"
              key={product.id}
            >
              <strong>{product.name}</strong>

              <span>{product.sku}</span>

              <span>{product.quantity}</span>

              <span>{money(product.cost)}</span>

              <span>{money(product.price)}</span>

              <span>
                <span
                  className={`stock-status ${
                    outOfStock
                      ? "out"
                      : lowStock
                      ? "low"
                      : "good"
                  }`}
                >
                  {outOfStock
                    ? "Out of stock"
                    : lowStock
                    ? "Low stock"
                    : "In stock"}
                </span>
              </span>

              <div className="ledger-actions">
                <button
                  onClick={() =>
                    onEditProduct(product)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => {
                    const confirmed =
                      window.confirm(
                        `Delete ${product.name}?`
                      );

                    if (confirmed) {
                      onDeleteProduct(product.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
function SalesPage({
  sales,
  onNewSale,
  onDeleteSale,
}: {
  sales: Sale[];
  onNewSale: () => void;
  onDeleteSale: (sale: Sale) => void;
}) {
  const totalRevenue = sales.reduce(
    (total, sale) => total + sale.total,
    0
  );

  const grossProfit = sales.reduce(
    (total, sale) => total + sale.grossProfit,
    0
  );

  const unitsSold = sales.reduce(
    (total, sale) => total + sale.quantity,
    0
  );

  const averageSale =
    sales.length > 0
      ? totalRevenue / sales.length
      : 0;

  return (
    <div className="content">
      <section className="page-head">
        <div>
          <p className="eyebrow">REVENUE</p>
          <h1>Sales</h1>
          <p className="subhead">
            Track sales and automatically update inventory
            and cash flow.
          </p>
        </div>

        <button
          className="primary"
          onClick={onNewSale}
        >
          <Plus size={17} />
          Record sale
        </button>
      </section>

      <section className="metrics">
        <Metric
          label="Sales revenue"
          value={money(totalRevenue)}
          change="+"
          positive={true}
          detail={`${sales.length} sales`}
        />

        <Metric
          label="Gross profit"
          value={money(grossProfit)}
          change="+"
          positive={grossProfit >= 0}
          detail="before operating expenses"
        />

        <Metric
          label="Units sold"
          value={unitsSold.toString()}
          change="+"
          positive={true}
          detail="across all products"
        />

        <Metric
          label="Average sale"
          value={money(averageSale)}
          change="+"
          positive={true}
          detail="per transaction"
        />
      </section>

      <section className="card sales-table">
        <div className="money-ledger-header">
          <div>
            <h2>Sales history</h2>
            <p>
              Sales recorded across your business.
            </p>
          </div>
        </div>

        <div className="sales-columns">
          <span>Customer</span>
          <span>Product</span>
          <span>Quantity</span>
          <span>Price</span>
          <span>Revenue</span>
          <span>Gross profit</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {sales.length === 0 ? (
          <div className="ledger-empty">
            No sales recorded yet.
          </div>
        ) : (
          sales.map((sale) => (
            <div
              className="sales-row"
              key={sale.id}
            >
              <strong>{sale.customer}</strong>

              <span>{sale.productName}</span>

              <span>{sale.quantity}</span>

              <span>{money(sale.pricePerUnit)}</span>

              <strong className="positive">
                {money(sale.total)}
              </strong>

              <strong
                className={
                  sale.grossProfit >= 0
                    ? "positive"
                    : "negative"
                }
              >
                {money(sale.grossProfit)}
              </strong>

              <span>{sale.date}</span>
              <div className="ledger-actions">
                <button
                  className="delete"
                  onClick={() => {
                    const confirmed = window.confirm(
                      `Delete this sale to ${sale.customer}? Inventory will be restored and the linked Money transaction will be removed.`
                    );

                    if (confirmed) {
                      onDeleteSale(sale);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
type CustomerSummary = {
  key: string;
  name: string;
  orders: number;
  revenue: number;
  grossProfit: number;
  units: number;
  sales: Sale[];
};

// Sales remain the source of truth; customer records are never persisted separately.
function projectCustomers(sales: Sale[]): CustomerSummary[] {
  const customers = new Map<string, CustomerSummary>();
  for (const sale of sales) {
    const name = sale.customer.trim().replace(/\s+/g, " ") || "Unknown customer";
    const key = name.toLowerCase();
    let customer = customers.get(key);
    if (!customer) {
      customer = { key, name, orders: 0, revenue: 0, grossProfit: 0, units: 0, sales: [] };
      customers.set(key, customer);
    }
    customer.orders += 1;
    customer.revenue += sale.total;
    customer.grossProfit += sale.grossProfit;
    customer.units += sale.quantity;
    customer.sales.push(sale);
  }
  return [...customers.values()].sort((a, b) => b.revenue - a.revenue || a.name.localeCompare(b.name));
}

function CustomersPage({ sales, onNewSale, onViewSales }: {
  sales: Sale[];
  onNewSale: () => void;
  onViewSales: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const customers = projectCustomers(sales);
  const filtered = customers.filter(customer => customer.name.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = customers.find(customer => customer.key === selectedKey);
  const revenue = customers.reduce((sum, customer) => sum + customer.revenue, 0);
  const profit = customers.reduce((sum, customer) => sum + customer.grossProfit, 0);
  const units = customers.reduce((sum, customer) => sum + customer.units, 0);

  return (
    <div className="content">
      <section className="page-head">
        <div>
          <p className="eyebrow">RELATIONSHIPS</p>
          <h1>Customers</h1>
          <p className="subhead">Customers and purchase totals update automatically from your sales.</p>
        </div>
        <button className="primary" onClick={onNewSale}><Plus size={17} />Record sale</button>
      </section>
      <section className="metrics">
        <Metric label="Customers" value={customers.length.toString()} change="" positive detail={`${sales.length} orders recorded`} />
        <Metric label="Total revenue" value={money(revenue)} change="" positive={revenue >= 0} detail="from customer purchases" />
        <Metric label="Gross profit" value={money(profit)} change="" positive={profit >= 0} detail="before operating expenses" />
        <Metric label="Units purchased" value={units.toString()} change="" positive detail="across all customers" />
      </section>
      <section className="card customers-table">
        <div className="money-ledger-header customers-header">
          <div><h2>Customer overview</h2><p>Select a customer to see their purchase history.</p></div>
          <label className="customer-search"><Search size={16} aria-hidden="true" /><input aria-label="Search customers" placeholder="Search customers..." value={query} onChange={event => setQuery(event.target.value)} /></label>
        </div>
        <div className="customer-table-scroll">
          <table className="customer-data-table">
            <thead><tr><th scope="col">Customer</th><th scope="col">Orders</th><th scope="col">Revenue</th><th scope="col">Gross profit</th><th scope="col">Units purchased</th></tr></thead>
            <tbody>{filtered.map(customer => (
              <tr key={customer.key} className={selected?.key === customer.key ? "selected" : ""}>
                <th scope="row"><button className="customer-name" onClick={() => setSelectedKey(customer.key)} aria-pressed={selected?.key === customer.key}>{customer.name}</button></th>
                <td>{customer.orders}</td><td>{money(customer.revenue)}</td>
                <td className={customer.grossProfit >= 0 ? "positive" : "negative"}>{money(customer.grossProfit)}</td><td>{customer.units}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="ledger-empty">{customers.length === 0 ? "Record your first sale to see customers and their purchase history here." : "No customers match your search."}</div>}
      </section>
      {selected && (
        <section className="card customer-history" aria-label={`Purchase history for ${selected.name}`}>
          <div className="money-ledger-header customers-header">
            <div><h2>{selected.name}</h2><p>{selected.orders} orders · {money(selected.revenue)} revenue · {money(selected.grossProfit)} gross profit · {selected.units} units purchased</p></div>
            <button className="text-btn" onClick={onViewSales}>Manage in Sales <ArrowUpRight size={15} /></button>
          </div>
          <div className="customer-table-scroll">
            <table className="customer-data-table">
              <caption className="customer-history-caption">Purchase history</caption>
              <thead><tr><th scope="col">Sale</th><th scope="col">Product</th><th scope="col">Quantity</th><th scope="col">Unit price</th><th scope="col">Revenue</th><th scope="col">Gross profit</th><th scope="col">Date</th></tr></thead>
              <tbody>{[...selected.sales].sort((a, b) => b.id - a.id).map(sale => (
                <tr key={sale.id}><th scope="row">#{sale.id}</th><td>{sale.productName}</td><td>{sale.quantity}</td><td>{money(sale.pricePerUnit)}</td><td>{money(sale.total)}</td><td className={sale.grossProfit >= 0 ? "positive" : "negative"}>{money(sale.grossProfit)}</td><td>{sale.date}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function TransactionForm({
  transaction,
  onClose,
  onSave,
}: {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}) {
  const [name, setName] = useState(
    transaction?.name ?? ""
  );

  const [detail, setDetail] = useState(
    transaction?.detail ?? ""
  );

  const [amount, setAmount] = useState(
    transaction
      ? Math.abs(transaction.amount).toString()
      : ""
  );

  const [type, setType] =
    useState<"income" | "expense">(
      transaction
        ? transaction.positive
          ? "income"
          : "expense"
        : "income"
    );
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!name.trim() || !detail.trim() || !numericAmount) {
      return;
    }

  const savedTransaction: Transaction = {
    id: transaction?.id ?? Date.now(),
    name: name.trim(),
    detail: detail.trim(),
    date: transaction?.date ?? "Just now",
    amount:
      type === "income"
        ? numericAmount
        : -Math.abs(numericAmount),
    positive: type === "income",
  };

  onSave(savedTransaction);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">BUSINESS OS</p>
            <h2>
              {transaction ? "Edit transaction" : "New transaction"}
            </h2>

            <p>
              {transaction
                ? "Update this transaction."
                : "Record an economic event in your business."}
            </p>
          </div>

          <button className="icon-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Customer / Vendor
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Industries"
            />
          </label>

          <label>
            Description
            <input
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="e.g. Invoice #1049"
            />
          </label>

          <label>
            Transaction type
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "income" | "expense")
              }
            >
              <option value="income">Income / Sale</option>
              <option value="expense">Expense / Purchase</option>
            </select>
          </label>

          <label>
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary">
              {transaction ? "Save changes" : "Save transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function ProductForm({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [name, setName] = useState(
    product?.name ?? ""
  );

  const [sku, setSku] = useState(
    product?.sku ?? ""
  );

  const [quantity, setQuantity] = useState(
    product?.quantity.toString() ?? ""
  );

  const [cost, setCost] = useState(
    product?.cost.toString() ?? ""
  );

  const [price, setPrice] = useState(
    product?.price.toString() ?? ""
  );

  const [reorderLevel, setReorderLevel] = useState(
    product?.reorderLevel.toString() ?? ""
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !sku.trim()) {
      return;
    }

    const savedProduct: Product = {
      id: product?.id ?? Date.now(),
      name: name.trim(),
      sku: sku.trim(),
      quantity: Number(quantity) || 0,
      cost: Number(cost) || 0,
      price: Number(price) || 0,
      reorderLevel: Number(reorderLevel) || 0,
    };

    onSave(savedProduct);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">INVENTORY</p>

            <h2>
              {product
                ? "Edit product"
                : "Add product"}
            </h2>

            <p>
              {product
                ? "Update product information."
                : "Add a new product to inventory."}
            </p>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Product name
            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. MacBook Pro 14"
            />
          </label>

          <label>
            SKU
            <input
              value={sku}
              onChange={(e) =>
                setSku(e.target.value)
              }
              placeholder="e.g. MBP-14"
            />
          </label>

          <label>
            Quantity
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder="0"
            />
          </label>

          <label>
            Cost per unit
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) =>
                setCost(e.target.value)
              }
              placeholder="0.00"
            />
          </label>

          <label>
            Selling price
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="0.00"
            />
          </label>

          <label>
            Reorder level
            <input
              type="number"
              min="0"
              value={reorderLevel}
              onChange={(e) =>
                setReorderLevel(e.target.value)
              }
              placeholder="5"
            />
          </label>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
            >
              {product
                ? "Save changes"
                : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SaleForm({
  products,
  onClose,
  onSave,
}: {
  products: Product[];
  onClose: () => void;
  onSave: (sale: Sale) => void;
}) {
  const availableProducts = products.filter(
    (product) => product.quantity > 0
  );

  const [productId, setProductId] = useState(
    availableProducts[0]?.id.toString() ?? ""
  );

  const [customer, setCustomer] = useState("");
  const [quantity, setQuantity] = useState("1");

  const selectedProduct = products.find(
    (product) => product.id === Number(productId)
  );

  const numericQuantity = Number(quantity) || 0;

  const total = selectedProduct
    ? selectedProduct.price * numericQuantity
    : 0;

  const estimatedProfit = selectedProduct
    ? (selectedProduct.price - selectedProduct.cost) *
      numericQuantity
    : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !selectedProduct ||
      !customer.trim() ||
      numericQuantity <= 0
    ) {
      return;
    }

    if (numericQuantity > selectedProduct.quantity) {
      alert(
        `Only ${selectedProduct.quantity} units are available.`
      );
      return;
    }

    const sale: Sale = {
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      customer: customer.trim(),
      quantity: numericQuantity,
      pricePerUnit: selectedProduct.price,
      costPerUnit: selectedProduct.cost,
      total,
      grossProfit: estimatedProfit,
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(),
    };

    onSave(sale);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">SALES</p>
            <h2>Record sale</h2>
            <p>
              Sell inventory and record the financial event.
            </p>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {availableProducts.length === 0 ? (
          <div className="sale-no-stock">
            <p>
              There are no products with available inventory.
            </p>

            <button
              className="secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Customer
              <input
                value={customer}
                onChange={(e) =>
                  setCustomer(e.target.value)
                }
                placeholder="e.g. Acme Industries"
                autoFocus
              />
            </label>

            <label>
              Product
              <select
                value={productId}
                onChange={(e) =>
                  setProductId(e.target.value)
                }
              >
                {availableProducts.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} — {product.quantity} available
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                max={selectedProduct?.quantity}
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />
            </label>

            {selectedProduct && (
              <div className="sale-summary">
                <div>
                  <span>Price per unit</span>
                  <strong>
                    {money(selectedProduct.price)}
                  </strong>
                </div>

                <div>
                  <span>Quantity</span>
                  <strong>{numericQuantity}</strong>
                </div>

                <div>
                  <span>Sale total</span>
                  <strong>{money(total)}</strong>
                </div>

                <div>
                  <span>Estimated gross profit</span>
                  <strong>
                    {money(estimatedProfit)}
                  </strong>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary"
              >
                Record sale
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, change, positive, detail, alert = false }: {label:string,value:string,change:string,positive:boolean,detail:string,alert?:boolean}) {
  return <div className="metric card">
    <div className="metric-top"><span>{label}</span>{alert && <span className="mini-alert">● Attention</span>}</div>
    <strong>{value}</strong>
    <div className="metric-bottom"><span className={positive ? "change up" : "change down"}>{positive ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>} {change}</span><span>{detail}</span></div>
  </div>;
}

function Alert({icon,title,detail,action}:{icon:React.ReactNode,title:string,detail:string,action:string}) {
  return <div className="alert">
    <div className="alert-icon">{icon}</div><div className="alert-copy"><strong>{title}</strong><span>{detail}</span><button>{action} <ArrowUpRight size={13}/></button></div>
  </div>;
}

function Placeholder({title}:{title:string}) {
  return <div className="content"><section className="page-head"><div><p className="eyebrow">BUSINESS OS</p><h1>{title}</h1><p className="subhead">This module is next. The command center is the first vertical slice.</p></div><button className="primary"><Plus size={17}/> New</button></section><div className="empty card"><Sparkles size={24}/><h2>We're building this layer next.</h2><p>Navigation is wired so we can add each business system without rebuilding the app shell.</p></div></div>;
}