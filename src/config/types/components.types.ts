import type { AuditLog } from "@prisma/client";
import type * as React from "react";

export interface FormInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
}

export interface FormTextareaProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  onBlur?: () => void;
  onClick: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  defaultValue?: string;
}

export interface FormPopoverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export interface BgCollection {
  name: string;
  folder: string;
  images: string[];
}

export interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
  defaultValue?: string;
  onChange?: (image: string) => void;
}

export interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary" | "transparent";
}

export interface FormErrorsProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export interface HintProps {
  children: React.ReactNode;
  description?: string;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
}

export interface ActivityItemProps {
  data: AuditLog;
  extended?: boolean;
}

export interface ActivityFiltersState {
  search: string;
  entityType: string;
  action: string;
  dateRange: string;
}


