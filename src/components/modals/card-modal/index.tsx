"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./header";
import { Description } from "./description";
import Actions from "./actions";
import { AuditLog } from "@prisma/client";
import { Activity } from "./activity";
import { API } from "@/config/routing/api.route";
import type { CardWithList } from "@/config/types/main.types";
import { useAccountProfile } from "@/hooks/use-account-profile";
import { hasExtendedAuditLog } from "@/config/const/limits.const";

import { getItemColor } from "@/config/const/colors.const";
import { cn } from "@/lib/utils";

export function CardModal() {
    const id = useCardModal((state) => state.id)
    const isOpen = useCardModal((state) => state.isOpen)
    const onClose = useCardModal((state) => state.onClose)

    const { data: cardData } = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(API.CARDS.BY_ID(id!)),
        enabled: !!id,
    })

    const orgId = cardData?.list?.board?.orgId
    const isOrg = orgId?.startsWith("org_") ?? false
    const { data: profile } = useAccountProfile(orgId, isOrg)
    const isExtended = hasExtendedAuditLog(profile?.premium)
    const colorConfig = getItemColor(cardData?.color)

    const { data: auditLogsData } = useQuery<AuditLog[]>({
        queryKey: ["card-logs", id],
        queryFn: () => fetcher(API.CARDS.LOGS(id!)),
        enabled: !!id,
    })

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="max-w-3xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                {colorConfig && (
                    <div className={cn("h-2.5 -mx-6 -mt-6 mb-2 rounded-t-xl shrink-0 transition-colors", colorConfig.card.bar)} />
                )}
                {!cardData ? (
                    <Header.Skeleton/>
                ) : (
                    <Header data={cardData}/>
                )}
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                    <div className={cardData?.canEdit === false ? "col-span-4" : "col-span-3"}>
                        <div className="w-full space-y-6">
                        {!cardData
                            ? <Description.Skeleton />
                            : <Description data={cardData} />
                        }
                        {!auditLogsData
                            ? <Activity.Skeleton />
                            : <Activity items={auditLogsData} isExtended={isExtended} />
                        }
                        </div>
                    </div>
                    {cardData && cardData.canEdit === false ? null : !cardData ? (
                        <Actions.Skeleton/>
                    ) : (
                        <Actions data={cardData}/>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}