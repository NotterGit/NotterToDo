import { Get, Post, Put } from "./client";
import { API } from "@/config/routing/api.route";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "@/config/types/api.types";

export const getUserById = async (_id: string): Promise<User | null> => {
  return Get<User>(API.BACKEND.USERS.BY_ID(_id));
};

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  return Get<User>(API.BACKEND.USERS.BY_USERNAME(username));
};

export const createUser = async (
  _id: string,
  payload: CreateUserPayload
): Promise<User | null> => {
  return Post<User>(API.BACKEND.USERS.ADD(_id), payload);
};

export const updateUser = async (
  _id: string,
  payload: UpdateUserPayload
): Promise<boolean> => {
  const result = await Put<{ updated: boolean }>(
    API.BACKEND.USERS.UPDATE(_id),
    payload
  );
  return Boolean(result?.updated);
};
