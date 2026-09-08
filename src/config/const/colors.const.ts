export interface BoardColor {
  id: string;
  name: string;
  swatch: string;
  list: {
    bg: string;
    bar: string;
  };
  card: {
    bg: string;
    hoverBorder: string;
    bar: string;
    badge: string;
  };
}

export const ITEM_COLORS: BoardColor[] = [
  {
    id: "slate",
    name: "Серый",
    swatch: "bg-slate-500",
    list: {
      bg: "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800",
      bar: "bg-slate-500",
    },
    card: {
      bg: "bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 dark:text-neutral-100",
      hoverBorder: "hover:border-slate-400 dark:hover:border-slate-500",
      bar: "bg-slate-500",
      badge: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    },
  },
  {
    id: "red",
    name: "Красный",
    swatch: "bg-red-500",
    list: {
      bg: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900",
      bar: "bg-red-500",
    },
    card: {
      bg: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 dark:text-neutral-100",
      hoverBorder: "hover:border-red-400 dark:hover:border-red-500",
      bar: "bg-red-500",
      badge: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    },
  },
  {
    id: "orange",
    name: "Оранжевый",
    swatch: "bg-orange-500",
    list: {
      bg: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-900",
      bar: "bg-orange-500",
    },
    card: {
      bg: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-900 dark:text-neutral-100",
      hoverBorder: "hover:border-orange-400 dark:hover:border-orange-500",
      bar: "bg-orange-500",
      badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    },
  },
  {
    id: "amber",
    name: "Янтарный",
    swatch: "bg-amber-500",
    list: {
      bg: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900",
      bar: "bg-amber-500",
    },
    card: {
      bg: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900 dark:text-neutral-100",
      hoverBorder: "hover:border-amber-400 dark:hover:border-amber-500",
      bar: "bg-amber-500",
      badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    },
  },
  {
    id: "yellow",
    name: "Желтый",
    swatch: "bg-yellow-400",
    list: {
      bg: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900",
      bar: "bg-yellow-400",
    },
    card: {
      bg: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900 dark:text-neutral-100",
      hoverBorder: "hover:border-yellow-400 dark:hover:border-yellow-500",
      bar: "bg-yellow-400",
      badge: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    },
  },
  {
    id: "green",
    name: "Зеленый",
    swatch: "bg-green-500",
    list: {
      bg: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900",
      bar: "bg-green-500",
    },
    card: {
      bg: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900 dark:text-neutral-100",
      hoverBorder: "hover:border-green-400 dark:hover:border-green-500",
      bar: "bg-green-500",
      badge: "bg-green-500/15 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    },
  },
  {
    id: "emerald",
    name: "Изумрудный",
    swatch: "bg-emerald-500",
    list: {
      bg: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900",
      bar: "bg-emerald-500",
    },
    card: {
      bg: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900 dark:text-neutral-100",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-500",
      bar: "bg-emerald-500",
      badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    },
  },
  {
    id: "teal",
    name: "Бирюзовый",
    swatch: "bg-teal-500",
    list: {
      bg: "bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-900",
      bar: "bg-teal-500",
    },
    card: {
      bg: "bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-900 dark:text-neutral-100",
      hoverBorder: "hover:border-teal-400 dark:hover:border-teal-500",
      bar: "bg-teal-500",
      badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    },
  },
  {
    id: "cyan",
    name: "Голубой",
    swatch: "bg-cyan-500",
    list: {
      bg: "bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-900",
      bar: "bg-cyan-500",
    },
    card: {
      bg: "bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-900 dark:text-neutral-100",
      hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-500",
      bar: "bg-cyan-500",
      badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    },
  },
  {
    id: "blue",
    name: "Синий",
    swatch: "bg-blue-500",
    list: {
      bg: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900",
      bar: "bg-blue-500",
    },
    card: {
      bg: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900 dark:text-neutral-100",
      hoverBorder: "hover:border-blue-400 dark:hover:border-blue-500",
      bar: "bg-blue-500",
      badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    },
  },
  {
    id: "indigo",
    name: "Индиго",
    swatch: "bg-indigo-500",
    list: {
      bg: "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-900",
      bar: "bg-indigo-500",
    },
    card: {
      bg: "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-900 dark:text-neutral-100",
      hoverBorder: "hover:border-indigo-400 dark:hover:border-indigo-500",
      bar: "bg-indigo-500",
      badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    },
  },
  {
    id: "purple",
    name: "Фиолетовый",
    swatch: "bg-purple-500",
    list: {
      bg: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-900",
      bar: "bg-purple-500",
    },
    card: {
      bg: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-900 dark:text-neutral-100",
      hoverBorder: "hover:border-purple-400 dark:hover:border-purple-500",
      bar: "bg-purple-500",
      badge: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    },
  },
  {
    id: "pink",
    name: "Розовый",
    swatch: "bg-pink-500",
    list: {
      bg: "bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-900",
      bar: "bg-pink-500",
    },
    card: {
      bg: "bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-900 dark:text-neutral-100",
      hoverBorder: "hover:border-pink-400 dark:hover:border-pink-500",
      bar: "bg-pink-500",
      badge: "bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800",
    },
  },
  {
    id: "rose",
    name: "Малиновый",
    swatch: "bg-rose-500",
    list: {
      bg: "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900",
      bar: "bg-rose-500",
    },
    card: {
      bg: "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900 dark:text-neutral-100",
      hoverBorder: "hover:border-rose-400 dark:hover:border-rose-500",
      bar: "bg-rose-500",
      badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    },
  },
];

export function getItemColor(colorId?: string | null): BoardColor | undefined {
  if (!colorId) return undefined;
  return ITEM_COLORS.find((c) => c.id === colorId);
}
