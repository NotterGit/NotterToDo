import { clerkClient } from "@clerk/nextjs/server"
import { cache } from "react"

export const checkOrgAccess = cache(
  async (
    targetOrgId: string | null | undefined,
    userId: string | null | undefined,
    clerkOrgId?: string | null
  ): Promise<boolean> => {
    if (!userId || !targetOrgId) {
      return false
    }

    if (targetOrgId === userId) {
      return true
    }

    if (clerkOrgId && targetOrgId === clerkOrgId) {
      return true
    }

    if (targetOrgId.startsWith("org_")) {
      try {
        const client = await clerkClient()
        const memberships = await client.users.getOrganizationMembershipList({
          userId,
          limit: 100,
        })
        return memberships.data.some((m) => m.organization.id === targetOrgId)
      } catch (error) {
        console.error("[CHECK_ORG_ACCESS_ERROR]", error)
        return false
      }
    }

    return false
  }
)

export const checkOrgAdmin = cache(
  async (
    targetOrgId: string | null | undefined,
    userId: string | null | undefined,
    orgRole?: string | null,
    clerkOrgId?: string | null
  ): Promise<boolean> => {
    if (!userId || !targetOrgId) {
      return false
    }

    if (targetOrgId === userId) {
      return true
    }

    if (clerkOrgId && targetOrgId === clerkOrgId && orgRole) {
      const isOrgAdmin =
        orgRole === "org:admin" ||
        orgRole === "admin" ||
        (typeof orgRole === "string" && orgRole.includes("admin"))
      if (isOrgAdmin) return true
    }

    if (targetOrgId.startsWith("org_")) {
      try {
        const client = await clerkClient()
        const memberships = await client.users.getOrganizationMembershipList({
          userId,
          limit: 100,
        })
        const membership = memberships.data.find(
          (m) => m.organization.id === targetOrgId
        )
        if (!membership) return false
        const role = membership.role
        return (
          role === "org:admin" ||
          role === "admin" ||
          (typeof role === "string" && role.includes("admin"))
        )
      } catch (error) {
        console.error("[CHECK_ORG_ADMIN_ERROR]", error)
        return false
      }
    }

    return true
  }
)
