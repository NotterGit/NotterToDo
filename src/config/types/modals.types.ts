import type { AuditLog } from "@prisma/client";
import type { CardWithList } from "./main.types";

export interface HeaderProps {
  data: CardWithList;
}

export interface DescriptionProps {
  data: CardWithList;
}

export interface ActivityProps {
  items: AuditLog[];
}

export interface ActionsProps {
  data: CardWithList;
}
