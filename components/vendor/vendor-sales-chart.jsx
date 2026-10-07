"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { day: "Mon", sales: 420 }, { day: "Tue", sales: 680 },
  { day: "Wed", sales: 540 }, { day: "Thu", sales: 920 },
  { day: "Fri", sales: 760 }, { day: "Sat", sales: 1180 },
  { day: "Sun", sales: 980 },
];

export function VendorSalesChart() {
  return (
    <div className="h-[260px] w-full" aria-label="Weekly sales chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="vendorSalesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value}`} className="text-xs" />
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Sales"]} />
          <Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={2.5} fill="url(#vendorSalesFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
