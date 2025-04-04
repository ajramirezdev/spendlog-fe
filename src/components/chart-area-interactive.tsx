"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useUserStore } from "@/stores/useUserStore";
import { formatChartDate } from "@/helpers/expense.helper";

export const description = "An interactive area chart";

const chartConfig = {
  totalAmount: {
    label: "Expenses",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [period, setPeriod] = useState("daily");
  const { user } = useUserStore();
  const { expensesByPeriod, fetchExpensesByPeriod, paginatedExpenses } =
    useExpenseStore();

  useEffect(() => {
    if (user?._id) {
      fetchExpensesByPeriod(user._id, period);
    }
  }, [period, user?._id, paginatedExpenses?.totalCount]);

  useEffect(() => {
    if (isMobile) {
      setPeriod("daily");
    }
  }, [isMobile]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Monitor your spending habits.
          </span>
          {/* <span className="@[540px]/card:hidden">Last 3 months</span> */}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={period}
            onValueChange={setPeriod}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem className="cursor-pointer" value="monthly">
              Monthly
            </ToggleGroupItem>
            <ToggleGroupItem className="cursor-pointer" value="weekly">
              Weekly
            </ToggleGroupItem>
            <ToggleGroupItem className="cursor-pointer" value="daily">
              Daily
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="monthly" className="rounded-lg">
                Monthly
              </SelectItem>
              <SelectItem value="weekly" className="rounded-lg">
                Weekly
              </SelectItem>
              <SelectItem value="daily" className="rounded-lg">
                Daily
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={expensesByPeriod ?? []}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={
                period === "weekly"
                  ? "_id.week"
                  : period === "monthly"
                  ? "_id.month"
                  : "_id.day"
              }
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatChartDate(value, period, "tick")}
            />

            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  className="w-[175px]"
                  nameKey="totalAmount"
                  labelFormatter={(value) =>
                    formatChartDate(value, period, "label")
                  }
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey="totalAmount"
              fill="var(--color-chart-2)"
              type="natural"
              stroke="var(--color-chart-2)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
