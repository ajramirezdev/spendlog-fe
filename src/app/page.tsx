"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";
import { useExpenseStore } from "@/stores/useExpenseStore";

export default function Home() {
  const router = useRouter();
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isLoading, fetchUser, logout } = useUserStore();
  const { fetchExpensesSummary, fetchPaginatedExpenses, paginatedExpenses } =
    useExpenseStore();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchExpensesSummary(user._id);
    }
  }, [user?._id, paginatedExpenses?.totalCount]);

  useEffect(() => {
    if (user?._id) {
      fetchPaginatedExpenses(user._id, currentPage, perPage);
    }
  }, [user?._id, currentPage, perPage, paginatedExpenses?.totalCount]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  const paginate = {
    nextPage: () => {
      setCurrentPage((prev) => prev + 1);
    },
    prevPage: () => {
      setCurrentPage((prev) => prev - 1);
    },
    firstPage: () => {
      setCurrentPage(1);
    },
    lastPage: () => {
      if (paginatedExpenses) setCurrentPage(paginatedExpenses.totalPages);
    },
    setPageSize: (perPage: number) => {
      setPerPage(perPage);
    },
    canNextPage: () => {
      if (!paginatedExpenses) return false;
      return currentPage < paginatedExpenses?.totalPages;
    },
    canPrevPage: () => {
      return currentPage > 1;
    },
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* <AppSidebar variant="inset" /> */}
      <SidebarInset>
        <SiteHeader logout={logout} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {paginatedExpenses && (
                <DataTable data={paginatedExpenses} paginate={paginate} />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
