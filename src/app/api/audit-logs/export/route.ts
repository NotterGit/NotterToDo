import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserById } from "@/api/user";
import { getOrgById } from "@/api/org";
import { isDiamondPlan } from "@/config/const/limits.const";
import { generateAuditLogCsv } from "@/lib/audit-log-csv";
import { checkOrgAccess } from "@/lib/org-access";
import { format } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    const { userId, orgId: clerkOrgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasAccess = await checkOrgAccess(orgId, userId, clerkOrgId);
    if (!hasAccess) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const isOrg =
      orgId.startsWith("org_") || Boolean(clerkOrgId && clerkOrgId === orgId);
    const profile = isOrg ? await getOrgById(orgId) : await getUserById(orgId);

    if (!isDiamondPlan(profile?.premium)) {
      return new NextResponse(
        "Экспорт журнала аудита доступен только для тарифа Diamond",
        { status: 403 }
      );
    }

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const csvContent = generateAuditLogCsv(auditLogs);
    const dateStr = format(new Date(), "yyyy-MM-dd");
    const filename = `notter-todo-log-${orgId}-${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[AUDIT_LOG_EXPORT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
