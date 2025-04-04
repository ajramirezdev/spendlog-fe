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

export enum ExpenseTags {
  FOOD = "food",
  TRANSPORTATION = "transportation",
  ENTERTAINMENT = "entertainment",
  HEALTH = "health",
  HOUSING = "housing",
  UTILITIES = "utilities",
  EDUCATION = "education",
  SHOPPING = "shopping",
  SAVINGS = "savings",
  INVESTMENT = "investment",
  OTHER = "other",
}

const tagIcons = {
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
} as const;

export const tagsList = () => {
  return Object.values(ExpenseTags).map((tag) => ({
    value: tag,
    label: tag.charAt(0).toUpperCase() + tag.slice(1),
    icon: tagIcons[tag],
  }));
};
