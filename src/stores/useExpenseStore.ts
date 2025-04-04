import { create } from "zustand";
import {
  ExpenseSummary,
  IExpense,
  IPaginatedExpense,
} from "@/types/expenseTypes";
import { ExpenseInput } from "@/schemas/expense.schema";

interface ExpenseState {
  paginatedExpenses: IPaginatedExpense | null;
  expensesByPeriod: IExpense[] | null;
  summary: ExpenseSummary | null;
  isLoading: boolean;
  fetchExpensesSummary: (userId: string) => Promise<void>;
  fetchExpensesByPeriod: (userId: string, period: string) => Promise<void>;
  fetchPaginatedExpenses: (
    userId: string,
    page: number,
    limit: number
  ) => Promise<void>;
  addExpense: (data: ExpenseInput) => Promise<void>;
  editExpense: (data: ExpenseInput, expenseId?: string) => Promise<void>;
  deleteExpense: (expenseId?: string) => Promise<void>;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export const useExpenseStore = create<ExpenseState>((set) => ({
  paginatedExpenses: null,
  expensesByPeriod: null,
  summary: null,
  isLoading: true,
  fetchExpensesSummary: async (userId) => {
    try {
      set({ isLoading: true });
      const res = await fetch(
        `${BACKEND_URL}/api/expenses/summary/user/${userId}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }

      const summary = await res.json();
      set({ summary, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch expense summary:", error);
      set({ summary: null, isLoading: false });
    }
  },
  fetchExpensesByPeriod: async (userId, period) => {
    set({ expensesByPeriod: null });
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/expenses/user/${userId}/${period}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }

      const expensesByPeriod: IExpense[] = await res.json();
      set({ expensesByPeriod });
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      set({ expensesByPeriod: null });
    }
  },
  fetchPaginatedExpenses: async (userId, page = 1, limit = 10) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/expenses/user/${userId}?page=${page}&limit=${limit}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }

      const paginatedExpenses = await res.json();
      set({ paginatedExpenses });
    } catch (error) {
      console.error("Failed to fetch user expenses:", error);
      set({ paginatedExpenses: null });
    }
  },
  addExpense: async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const newExpense: IExpense = await response.json();

      set((state) => {
        const currentPaginatedExpenses = state.paginatedExpenses;

        // If paginatedExpenses is null, initialize it with default values
        if (!currentPaginatedExpenses) {
          return {
            paginatedExpenses: {
              expenses: [newExpense],
              totalCount: 1,
              totalPages: 1,
              currentPage: 1,
              perPage: 10, // Default value; adjust as needed
            },
          };
        }

        const { perPage, expenses, totalCount } = currentPaginatedExpenses;

        // Add new expense and limit the array length to `perPage`
        const updatedExpenses = [newExpense, ...expenses].slice(0, perPage);

        return {
          paginatedExpenses: {
            ...currentPaginatedExpenses,
            expenses: updatedExpenses,
            totalCount: totalCount + 1,
            totalPages: Math.ceil((totalCount + 1) / perPage),
          },
        };
      });
    } catch (error: any) {
      console.error("Failed to add user expense:", error);
    }
  },
  editExpense: async (data, expenseId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/${expenseId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update expense");
      }

      const updatedExpense: IExpense = await response.json();

      set((state) => {
        const currentPaginatedExpenses = state.paginatedExpenses;

        if (!currentPaginatedExpenses) return state;

        return {
          paginatedExpenses: {
            ...currentPaginatedExpenses,
            expenses: currentPaginatedExpenses.expenses.map((expense) =>
              expense._id === updatedExpense._id ? updatedExpense : expense
            ),
          },
        };
      });
    } catch (error: any) {
      console.error("Failed to update expense:", error);
    }
  },
  deleteExpense: async (expenseId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/${expenseId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      set((state) => {
        const currentPaginatedExpenses = state.paginatedExpenses;

        if (!currentPaginatedExpenses) return state;

        return {
          paginatedExpenses: {
            ...currentPaginatedExpenses,
            expenses: currentPaginatedExpenses.expenses.filter(
              (expense) => expense._id !== expenseId
            ),
            totalCount: Math.max(0, currentPaginatedExpenses.totalCount - 1),
          },
        };
      });
    } catch (error: any) {
      console.error("Failed to delete expense:", error);
    }
  },
}));
