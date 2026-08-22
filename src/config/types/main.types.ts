import type { Board, Card, List } from "@prisma/client";
import type * as React from "react";

export type ListWithCards = List & { cards: Card[] };
export type CardWithList = Card & { list: List; canEdit?: boolean };

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
  isReadOnly?: boolean;
}

export interface BoardTitleProps {
  data: Board;
  isReadOnly?: boolean;
}

export interface BoardOptionsProps {
  id: string;
  initialPublic?: boolean;
  initialImageId?: string;
  data?: Board;
}

export interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
  isReadOnly?: boolean;
}

export interface ListItemProps {
  data: ListWithCards;
  index: number;
  isReadOnly?: boolean;
}

export interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
  isReadOnly?: boolean;
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
  isReadOnly?: boolean;
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
