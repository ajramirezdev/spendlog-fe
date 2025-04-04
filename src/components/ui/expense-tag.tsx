import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Utensils,
  Car,
  Film,
  HeartPulse,
  Home,
  Lightbulb,
  GraduationCap,
  ShoppingBag,
  PiggyBank,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";

import type { ExpenseTag } from "@/types/expenseTagTypes";

interface ExpenseTagProps {
  tag: ExpenseTag;
  size?: number;
  padding?: string;
}

const tagIcons: Record<ExpenseTag, React.ElementType> = {
  food: Utensils,
  transportation: Car,
  entertainment: Film,
  health: HeartPulse,
  housing: Home,
  utilities: Lightbulb,
  education: GraduationCap,
  shopping: ShoppingBag,
  savings: PiggyBank,
  investment: TrendingUp,
  other: MoreHorizontal,
};

const tagColors: Record<ExpenseTag, string> = {
  food: "bg-amber-500 dark:bg-amber-600 text-amber-900 dark:text-amber-100",
  transportation:
    "bg-blue-500 dark:bg-blue-600 text-blue-900 dark:text-blue-100",
  entertainment:
    "bg-purple-500 dark:bg-purple-600 text-purple-900 dark:text-purple-100",
  health: "bg-green-500 dark:bg-green-600 text-green-900 dark:text-green-100",
  housing:
    "bg-orange-500 dark:bg-orange-600 text-orange-900 dark:text-orange-100",
  utilities:
    "bg-yellow-500 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100",
  education:
    "bg-indigo-500 dark:bg-indigo-600 text-indigo-900 dark:text-indigo-100",
  shopping: "bg-pink-500 dark:bg-pink-600 text-pink-900 dark:text-pink-100",
  savings: "bg-teal-500 dark:bg-teal-600 text-teal-900 dark:text-teal-100",
  investment: "bg-gray-500 dark:bg-gray-600 text-gray-900 dark:text-gray-100",
  other: "bg-muted text-muted-foreground",
};

export default function Tag({
  tag,
  size = 16,
  padding = "0.5",
}: ExpenseTagProps) {
  const Icon = tagIcons[tag] || MoreHorizontal;
  const bgColor = tagColors[tag] || "bg-muted text-muted-foreground";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={`p-${padding} rounded-full ${bgColor} flex items-center justify-center`}
          >
            <Icon size={size} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">{tag}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
