"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExpenseInput, expenseSchema } from "@/schemas/expense.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MultiSelect } from "./ui/multi-select";
import { tagsList } from "@/constants/expenseTags";
import { DatePicker } from "./date-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { useExpenseStore } from "@/stores/useExpenseStore";

export default function AddExpenseForm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tagOptions = useMemo(() => tagsList(), []);
  const { addExpense } = useExpenseStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
  });

  const onSubmit = async (data: ExpenseInput) => {
    await addExpense(data);
    setOpen(false);
    toast("Expense has been created.");
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="outline" size="sm">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Create your new expense profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="flex flex-col gap-2 relative">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input {...register("amount")} type="tel" className="col-span-3" />
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
            <Input {...register("description")} className="col-span-3" />
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

          <DialogFooter>
            <Button
              disabled={isLoading}
              type="submit"
              className="cursor-pointer"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
