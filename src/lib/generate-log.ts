import { ACTION, AuditLog, ENTITY_TYPE } from "@prisma/client";

const entityNames: Record<ENTITY_TYPE, string> = {
  [ENTITY_TYPE.BOARD]: "доску",
  [ENTITY_TYPE.LIST]: "список",
  [ENTITY_TYPE.CARD]: "карточку",
};

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;
  const entityName = entityNames[entityType] || entityType.toLowerCase();

  switch (action) {
    case ACTION.CREATE:
      return `создал(а) ${entityName} "${entityTitle}"`;
    case ACTION.UPDATE:
      return `обновил(а) ${entityName} "${entityTitle}"`;
    case ACTION.DELETE:
      return `удалил(а) ${entityName} "${entityTitle}"`;
    default:
      return `неизвестное действие с ${entityName} "${entityTitle}"`;
  }
};