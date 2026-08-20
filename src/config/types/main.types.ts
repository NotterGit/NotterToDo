import type { Board, Card, List } from "@prisma/client";
import type * as React from "react";

export type ListWithCards = List & { cards: Card[] };
export type CardWithList = Card & { list: List };

export type Organization = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};

export interface BoardIdPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export interface BoardNavProps {
  data: Board;
}

export interface BoardTitleProps {
  data: Board;
}

export interface BoardOptionsProps {
  id: string;
}

export interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

export interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

export interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export interface ListWrapperProps {
  children: React.ReactNode;
}

export interface CardItemProps {
  data: Card;
  index: number;
}

export interface CardFormProps {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}

export interface NavItemProps {
  isExpanded: boolean;
  isActive: boolean;
  organization: Organization;
  onExpand: (id: string) => void;
}

export interface SidebarProps {
  storageKey?: string;
}
