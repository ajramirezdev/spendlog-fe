import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionCards() {
  const { summary, isLoading } = useExpenseStore();

  const renderTrendIcon = (difference?: number) => {
    if (typeof difference !== "number") return null;
    return difference > 0 ? (
      <IconTrendingUp className="size-4 text-red-500" />
    ) : (
      <IconTrendingDown className="size-4 text-green-500" />
    );
  };

  const formatPercentage = (value?: string) => {
    const num = parseFloat(value ?? "0");
    return `${num % 1 === 0 ? num : num.toFixed(1)}%`;
  };

  const renderCard = (
    title: string,
    amount?: number,
    difference?: number,
    percentage?: string,
    period?: string
  ) => (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        {isLoading ? (
          <Skeleton className="h-9 w-32" />
        ) : (
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₱{amount?.toLocaleString() ?? "0"}
          </CardTitle>
        )}

        {title !== "Total Expenses" && (
          <CardAction>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-2 py-1"
              >
                {formatPercentage(percentage)}
                {renderTrendIcon(difference)}
              </Badge>
            )}
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {isLoading ? (
          <>
            <Skeleton className="h-5 w-50" />
            <Skeleton className="h-5 w-48" />
          </>
        ) : title !== "Total Expenses" ? (
          <>
            <div className="font-medium flex gap-1">
              ₱{Math.abs(difference ?? 0).toLocaleString()}{" "}
              {difference && difference < 0 ? "less" : "more"} than {period}.{" "}
              {renderTrendIcon(difference)}
            </div>
            <div className="text-muted-foreground">
              {difference && difference < 0
                ? "Great job! Keep it up. Your wallet thanks you."
                : "Easy there, big spender!"}
            </div>
          </>
        ) : (
          <>
            <div className="font-medium flex gap-1">
              Your total expenses are accounted for.
            </div>
            <div className="text-muted-foreground">
              Stay informed about your spending.
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {renderCard("Total Expenses", summary?.totalExpenses)}
      {renderCard(
        "This Month",
        summary?.monthlyExpenses.amount,
        summary?.monthlyExpenses.difference,
        summary?.monthlyExpenses.percentage,
        "last month"
      )}
      {renderCard(
        "This Week",
        summary?.weeklyExpenses.amount,
        summary?.weeklyExpenses.difference,
        summary?.weeklyExpenses.percentage,
        "last week"
      )}
      {renderCard(
        "Today",
        summary?.dailyExpenses.amount,
        summary?.dailyExpenses.difference,
        summary?.dailyExpenses.percentage,
        "yesterday"
      )}
    </div>
  );
}
