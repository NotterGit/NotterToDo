import { ACTION, AuditLog, ENTITY_TYPE } from "@prisma/client";
import { format } from "date-fns";

const actionLabels: Record<ACTION, string> = {
  [ACTION.CREATE]: "Создание",
  [ACTION.UPDATE]: "Обновление",
  [ACTION.DELETE]: "Удаление",
};

const entityTypeLabels: Record<ENTITY_TYPE, string> = {
  [ENTITY_TYPE.BOARD]: "Доска",
  [ENTITY_TYPE.LIST]: "Список",
  [ENTITY_TYPE.CARD]: "Карточка",
};

function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) {
    return "";
  }
  const stringValue = String(field);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function generateAuditLogCsv(logs: AuditLog[]): string {
  const headers = [
    "ID записи",
    "Дата и время",
    "Действие",
    "Тип объекта",
    "Название объекта",
    "ID объекта",
    "Пользователь",
    "ID пользователя",
  ];

  const rows = logs.map((log) => [
    escapeCsvField(log.id),
    escapeCsvField(format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")),
    escapeCsvField(actionLabels[log.action] || log.action),
    escapeCsvField(entityTypeLabels[log.entityType] || log.entityType),
    escapeCsvField(log.entityTitle),
    escapeCsvField(log.entityId),
    escapeCsvField(log.userName),
    escapeCsvField(log.userId),
  ]);

  const csvBody = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\r\n"
  );

  // Prepend UTF-8 BOM for Microsoft Excel / Numbers compatibility
  return "\uFEFF" + csvBody;
}
