import { Get, Post, Put } from "./client";
import { API } from "@/config/routing/api.route";
import type {
  CreateOrgPayload,
  Org,
  UpdateOrgPayload,
} from "@/config/types/api.types";

export const getOrgById = async (_id: string): Promise<Org | null> => {
  return Get<Org>(API.BACKEND.ORGS.BY_ID(_id));
};

export const getOrgByUsername = async (
  username: string
): Promise<Org | null> => {
  return Get<Org>(API.BACKEND.ORGS.BY_USERNAME(username));
};

export const createOrg = async (
  _id: string,
  payload: CreateOrgPayload
): Promise<Org | null> => {
  return Post<Org>(API.BACKEND.ORGS.ADD(_id), payload);
};

export const updateOrg = async (
  _id: string,
  payload: UpdateOrgPayload
): Promise<boolean> => {
  const result = await Put<{ updated: boolean }>(
    API.BACKEND.ORGS.UPDATE(_id),
    payload
  );
  return Boolean(result?.updated);
};
