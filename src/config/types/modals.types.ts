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
  isExtended?: boolean;
}


export interface ActionsProps {
  data: CardWithList;
}

export interface ParsedCard {
  title: string;
  order?: number;
  description?: string;
  color?: string | null;
}

export interface ParsedList {
  title: string;
  order?: number;
  color?: string | null;
  cards?: ParsedCard[];
}

export interface ParsedBoardData {
  title: string;
  image?: string;
  lists: ParsedList[];
}

export interface BoardImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}
