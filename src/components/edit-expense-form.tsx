"use client";

import { Row, flexRender } from "@tanstack/react-table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TableCell, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { IExpense } from "@/types/expenseTypes";

import { Input } from "@/components/ui/input";
import { ExpenseInput, expenseSchema } from "@/schemas/expense.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MultiSelect } from "./ui/multi-select";
import { tagsList } from "@/constants/expenseTags";
import { DatePicker } from "./date-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useUserStore } from "@/stores/useUserStore";

import { Trash2 } from "lucide-react";

export default function EditExpenseForm({ row }: { row: Row<IExpense> }) {
  const expense = row.original;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tagOptions = useMemo(() => tagsList(), []);
  const { editExpense, deleteExpense } = useExpenseStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense,
  });

  const onSubmit = async (data: ExpenseInput) => {
    await editExpense(data, expense._id);
    setOpen(false);
    toast("Expense has been edited.");
    reset();
  };

  const handleDelete = async () => {
    await deleteExpense(expense._id);
    setOpen(false);
    toast("Expense has been deleted.");
    reset();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) reset(expense);
      }}
    >
      <SheetTrigger asChild>
        <TableRow className="cursor-pointer">
          {row.getVisibleCells().map((cell) => (
            <TableCell
              style={{ width: cell.column.getSize() }}
              className="text-center"
              key={cell.id}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit expense</SheetTitle>
          <SheetDescription>
            Make changes to your expense here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-6 py-4 px-4"
        >
          <div className="flex flex-col gap-2 relative">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              {...register("amount")}
              defaultValue={expense?.amount}
              type="tel"
              className="col-span-3"
            />
            {errors.amount && (
              <p className="text-xs text-destructive absolute -bottom-5">
                * {errors.amount.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 relative">
            <Label htmlFor="description" className="text-right">
              Description
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input
              {...register("description")}
              defaultValue={expense?.description}
              className="col-span-3"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <MultiSelect
                  options={tagOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select tags"
                  variant="inverted"
                  maxCount={3}
                />
              )}
            />
            {errors.tags && (
              <p className="text-xs text-destructive absolute -bottom-5">
                * {errors.tags.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 relative">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date && format(date, "yyyy-MM-dd"));
                  }}
                />
              )}
            />
            {errors.date && (
              <p className="text-xs text-destructive absolute -bottom-5">
                * {errors.date.message}
              </p>
            )}
          </div>

          <Button type="submit" className="cursor-pointer">
            Save changes
          </Button>
          <Button
            onClick={handleDelete}
            type="button"
            variant="destructive"
            className="-mt-4 cursor-pointer"
          >
            Delete <Trash2 />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
