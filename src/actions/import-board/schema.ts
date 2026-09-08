import { z } from "zod";

export const CardImportSchema = z.object({
  title: z.string({
    message: "Название карточки обязательно",
  }).min(1, {
    message: "Название карточки не может быть пустым",
  }),
  order: z.number().optional(),
  description: z.string().optional(),
  color: z.string().optional().nullable(),
});

export const ListImportSchema = z.object({
  title: z.string({
    message: "Название списка обязательно",
  }).min(1, {
    message: "Название списка не может быть пустым",
  }),
  order: z.number().optional(),
  color: z.string().optional().nullable(),
  cards: z.array(CardImportSchema).optional(),
});

export const ImportBoard = z.object({
  title: z.string({
    message: "Название доски обязательно",
  }).min(3, {
    message: "Название доски должно содержать минимум 3 символа",
  }),
  image: z.string().optional(),
  lists: z.array(ListImportSchema).optional(),
});
