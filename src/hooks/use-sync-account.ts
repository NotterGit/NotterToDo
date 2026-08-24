"use client";

import { useEffect, useRef } from "react";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { setClerkTokenGetter } from "@/api/client";
import { createUser, getUserById, updateUser } from "@/api/user";
import { createOrg, getOrgById, updateOrg } from "@/api/org";
import { getBoardStats } from "@/actions/get-board-stats";

export function useSyncAccount() {
  const { getToken } = useAuth();
  const { user, isLoaded: isLoadedUser, isSignedIn } = useUser();
  const { organization, isLoaded: isLoadedOrg } = useOrganization();
  const queryClient = useQueryClient();

  const lastSyncHashRef = useRef<string | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  useEffect(() => {
    setClerkTokenGetter(getToken);
    return () => {
      setClerkTokenGetter(null);
    };
  }, [getToken]);

  useEffect(() => {
    if (!isSignedIn || !isLoadedUser || !user) {
      return;
    }

    const isOrg = Boolean(organization && isLoadedOrg);
    const entityId = isOrg ? organization!.id : user.id;

    const sync = async () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;

      try {
        const stats = await getBoardStats({ orgId: entityId });
        const boardsCount = stats?.boards ?? 0;
        const publicBoardsCount = stats?.publicBoards ?? 0;

        if (isOrg && organization) {
          let members: string[] = [user.id];
          let ownerId = user.id;

          try {
            const memberships = await organization.getMemberships();
            members = memberships.data.flatMap((m) => {
              const uId = m.publicUserData?.userId;
              return uId ? [uId] : [];
            });
            const adminMember = memberships.data.find(
              (m) => m.role === "org:admin" || m.role === "admin"
            );
            if (adminMember?.publicUserData?.userId) {
              ownerId = adminMember.publicUserData.userId;
            }
          } catch {
          }

          const orgPayload = {
            username: organization.slug || organization.id,
            name: organization.name || null,
            owner: ownerId,
            members,
            avatar: organization.imageUrl || null,
            boards: boardsCount,
            publicBoards: publicBoardsCount,
          };

          const hash = `org:${organization.id}:${JSON.stringify(orgPayload)}`;
          if (lastSyncHashRef.current === hash) {
            isSyncingRef.current = false;
            return;
          }

          const existingOrg = await getOrgById(organization.id);
          if (!existingOrg) {
            await createOrg(organization.id, {
              ...orgPayload,
              created: organization.createdAt
                ? new Date(organization.createdAt).toISOString()
                : null,
            });
          } else {
            await updateOrg(organization.id, orgPayload);
          }

          lastSyncHashRef.current = hash;
          queryClient.invalidateQueries({
            queryKey: ["account-profile", organization.id, true],
          });
        } else {
          const userPayload = {
            username: user.username || user.id,
            firstname: user.firstName || null,
            lastname: user.lastName || null,
            avatar: user.imageUrl || null,
            mail: user.emailAddresses?.[0]?.emailAddress || null,
            boards: boardsCount,
            publicBoards: publicBoardsCount,
          };

          const hash = `user:${user.id}:${JSON.stringify(userPayload)}`;
          if (lastSyncHashRef.current === hash) {
            isSyncingRef.current = false;
            return;
          }

          const existingUser = await getUserById(user.id);
          if (!existingUser) {
            await createUser(user.id, {
              ...userPayload,
              created: user.createdAt
                ? new Date(user.createdAt).toISOString()
                : null,
            });
          } else {
            await updateUser(user.id, userPayload);
          }

          lastSyncHashRef.current = hash;
          queryClient.invalidateQueries({
            queryKey: ["account-profile", user.id, false],
          });
        }
      } catch (error) {
        console.error("[ACCOUNT_SYNC_ERROR]", error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    sync();
  }, [
    isSignedIn,
    isLoadedUser,
    user,
    organization,
    isLoadedOrg,
    queryClient,
  ]);
}
