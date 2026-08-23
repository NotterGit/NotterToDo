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

export type BoardBlurStore = {
  blur: number;
  setBlur: (blur: number) => void;
};

export type LandingRedirectStore = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
};

export type BoardWrapListsStore = {
  wrapLists: boolean;
  setWrapLists: (wrapLists: boolean) => void;
  toggle: () => void;
};

export type BoardPreviewStore = {
  previewImage: string | null;
  setPreviewImage: (image: string | null) => void;
  resetPreviewImage: () => void;
};

