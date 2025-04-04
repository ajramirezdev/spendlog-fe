import { format, parseISO, startOfWeek, endOfWeek } from "date-fns";

export const formatChartDate = (
  value: any,
  period: string,
  formatType: "tick" | "label" = "tick"
): string => {
  if (!value) return String(value);

  try {
    if (period === "daily") {
      const date =
        typeof value === "string" ? new Date(value) : new Date(Number(value));

      // Validate date
      if (isNaN(date.getTime())) return String(value);

      return formatType === "tick"
        ? format(date, "MMM d")
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
    } else if (period === "weekly") {
      const [year, week] = String(value).split("-W").map(Number);

      if (!year || !week) return String(value);

      // Use the first day of the specified week
      const firstDayOfYear = new Date(year, 0, 1);
      const start = startOfWeek(
        new Date(year, 0, firstDayOfYear.getDate() + (week - 1) * 7),
        { weekStartsOn: 1 }
      );

      const end = endOfWeek(start, { weekStartsOn: 1 });

      return formatType === "tick"
        ? `${format(start, "MMM d")} - ${format(end, "MMM d")}`
        : `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
    } else if (period === "monthly") {
      const monthString = String(value);

      if (!/^\d{4}-\d{2}$/.test(monthString)) return monthString;

      const parsedDate = parseISO(`${monthString}-01`);

      return formatType === "tick"
        ? format(parsedDate, "MMM yyyy")
        : format(parsedDate, "MMM yyyy");
    }
    return String(value);
  } catch (error) {
    console.error("Error formatting chart date:", error);
    return String(value);
  }
};
