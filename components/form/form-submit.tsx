"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary"
    | null
    | undefined;
}

export const FormSubmit = ({
  children,
  disabled,
  className,
  variant = "primary",
}: FormSubmitProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      variant={variant}
      className={cn("", className)}
    >
      {children}
    </Button>
  );
};
