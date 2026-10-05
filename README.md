# Business OS

First vertical slice of the all-in-one business management app.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Current slice

- Command Center dashboard
- Unified business-health metrics
- Financial performance visualization
- Needs-attention queue
- Recent economic activity
- Navigation shell for Money, Inventory, Sales, Customers, Business Sheet, Analytics and Settings

## Next build

The next step is to replace the demo dashboard data with a real domain model and persistence layer:

Business -> Events -> Economic State -> Decisions

Then add the first real workflow: create a sale, which updates revenue, cash/receivables, inventory, COGS, customer history, and dashboard metrics.
