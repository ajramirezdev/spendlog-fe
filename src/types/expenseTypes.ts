import { ExpenseTags } from "@/constants/expenseTags";

interface IExpense {
  _id: string;
  amount: number;
  tags: ExpenseTags[];
  date: string;
  description?: string;
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IPaginatedExpense {
  expenses: IExpense[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

interface ExpenseSummary {
  totalExpenses: number;
  monthlyExpenses: TimePeriodExpense;
  weeklyExpenses: TimePeriodExpense;
  dailyExpenses: TimePeriodExpense;
}

interface TimePeriodExpense {
  amount: number;
  difference: number;
  percentage: string;
}

export type { IExpense, ExpenseSummary, TimePeriodExpense, IPaginatedExpense };
