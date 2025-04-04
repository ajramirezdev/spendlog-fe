export const EXPENSE_TAGS = [
  "food",
  "transportation",
  "entertainment",
  "health",
  "housing",
  "utilities",
  "education",
  "shopping",
  "savings",
  "investment",
  "other",
] as const;

export type ExpenseTag = (typeof EXPENSE_TAGS)[number];
