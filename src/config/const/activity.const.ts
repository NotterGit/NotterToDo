import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { Plus, Pencil, Trash2, Layout, ListTodo, FileText } from "lucide-react";
import type { ActivityFiltersState } from "@/config/types/components.types";

export const ACTION_BADGE_CONFIG: Record<
  ACTION,
  { label: string; icon: typeof Plus; className: string }
> = {
  [ACTION.CREATE]: {
    label: "Создание",
    icon: Plus,
    className:
      "text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-500/10 border-emerald-500/30",
  },
  [ACTION.UPDATE]: {
    label: "Изменение",
    icon: Pencil,
    className:
      "text-blue-700 dark:text-blue-400 bg-blue-500/15 dark:bg-blue-500/10 border-blue-500/30",
  },
  [ACTION.DELETE]: {
    label: "Удаление",
    icon: Trash2,
    className:
      "text-rose-700 dark:text-rose-400 bg-rose-500/15 dark:bg-rose-500/10 border-rose-500/30",
  },
};

export const ENTITY_BADGE_CONFIG: Record<
  ENTITY_TYPE,
  { label: string; icon: typeof Layout; className: string }
> = {
  [ENTITY_TYPE.BOARD]: {
    label: "Доска",
    icon: Layout,
    className:
      "text-amber-700 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 border-amber-500/30",
  },
  [ENTITY_TYPE.LIST]: {
    label: "Список",
    icon: ListTodo,
    className:
      "text-indigo-700 dark:text-indigo-400 bg-indigo-500/15 dark:bg-indigo-500/10 border-indigo-500/30",
  },
  [ENTITY_TYPE.CARD]: {
    label: "Карточка",
    icon: FileText,
    className:
      "text-cyan-700 dark:text-cyan-400 bg-cyan-500/15 dark:bg-cyan-500/10 border-cyan-500/30",
  },
};

export const ACTIVITY_ENTITY_OPTIONS = [
  { value: "ALL", label: "Все сущности" },
  { value: ENTITY_TYPE.BOARD, label: "Доски" },
  { value: ENTITY_TYPE.LIST, label: "Списки" },
  { value: ENTITY_TYPE.CARD, label: "Карточки" },
];

export const ACTIVITY_ACTION_OPTIONS = [
  { value: "ALL", label: "Все действия" },
  { value: ACTION.CREATE, label: "Создание" },
  { value: ACTION.UPDATE, label: "Изменение" },
  { value: ACTION.DELETE, label: "Удаление" },
];

export const ACTIVITY_DATE_OPTIONS = [
  { value: "ALL", label: "За всё время" },
  { value: "TODAY", label: "Сегодня" },
  { value: "7DAYS", label: "7 дней" },
  { value: "30DAYS", label: "30 дней" },
];

export const INITIAL_ACTIVITY_FILTERS: ActivityFiltersState = {
  search: "",
  entityType: "ALL",
  action: "ALL",
  dateRange: "ALL",
};
