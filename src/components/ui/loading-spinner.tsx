import { LoaderCircle, LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

export interface IProps extends LucideProps {
  className?: string;
}

export default function LoadingSpinner({ className, ...props }: IProps) {
  return <LoaderCircle className={cn("animate-spin", className)} {...props} />;
}
