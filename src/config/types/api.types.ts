export type PremiumLevel = 0 | 1 | 2;

export interface User {
  _id: string;
  username: string;
  mail?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  avatar?: string | null;
  premium: number;
  boards: number;
  publicBoards: number;
}

export interface CreateUserPayload {
  username: string;
  firstname?: string | null;
  lastname?: string | null;
  avatar?: string | null;
  mail?: string | null;
  boards?: number;
  publicBoards?: number;
  created?: string | null;
}

export interface UpdateUserPayload {
  username?: string;
  firstname?: string | null;
  lastname?: string | null;
  avatar?: string | null;
  mail?: string | null;
  boards?: number;
  publicBoards?: number;
}

export interface Org {
  _id: string;
  username: string;
  owner: string;
  name?: string | null;
  members?: string[];
  avatar?: string | null;
  premium: number;
  boards: number;
  publicBoards: number;
}

export interface CreateOrgPayload {
  username: string;
  owner: string;
  name?: string | null;
  members?: string[];
  avatar?: string | null;
  boards?: number;
  publicBoards?: number;
  created?: string | null;
}

export interface UpdateOrgPayload {
  username?: string;
  owner?: string;
  name?: string | null;
  members?: string[];
  avatar?: string | null;
  boards?: number;
  publicBoards?: number;
}

export interface BoardStats {
  boards: number;
  publicBoards: number;
}

export interface S3UploadResponse {
  filename: string;
  key: string;
  url: string;
}

export interface S3DeleteResponse {
  deleted: boolean;
}
