"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive area chart"

export interface RevenueChartPoint {
  date: string
  current: number
  previous: number
}

const chartConfig = {
  current: {
    label: "Current period",
    color: "var(--chart-1)",
  },
  previous: {
    label: "Previous period",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function ChartAreaInteractive({ data = [] }: { data?: RevenueChartPoint[] }) {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Revenue</CardTitle>
          <CardDescription>
            Monthly platform revenue vs the previous period
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {data.length === 0 ? (
          <p className="flex h-62.5 items-center justify-center text-sm text-muted-foreground">
            No revenue data yet.
          </p>
        ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
          debounce={100}
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-current)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-current)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                  formatter={(value, name) => (
                    <>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {currency.format(Number(value))}
                      </span>
                      <span className="text-muted-foreground">
                        {name === "current" ? "Current period" : "Previous period"}
                      </span>
                    </>
                  )}
                />
              }
            />
            <Area
              dataKey="previous"
              type="natural"
              stroke="var(--color-previous)"
              strokeOpacity={0.5}
              strokeWidth={2}
              strokeDasharray="5 4"
              fill="none"
              isAnimationActive={true}
            />
            <Area
              dataKey="current"
              type="natural"
              fill="url(#fillCurrent)"
              stroke="var(--color-current)"
              isAnimationActive={true}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
