export type CardModalStore = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export type OrgModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type MobileSidebarStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type SettingsModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

