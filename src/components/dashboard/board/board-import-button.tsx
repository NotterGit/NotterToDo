"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { useAccountProfile } from "@/hooks/use-account-profile";
import { isDiamondPlan } from "@/config/const/limits.const";
import { BoardImportModal } from "@/components/modals/board-import-modal";
import { Upload } from "lucide-react";

interface BoardImportButtonProps {
  orgId: string;
}

export function BoardImportButton({ orgId }: BoardImportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isOrg = orgId.startsWith("org_");
  const { data: profile, isLoading: isProfileLoading } = useAccountProfile(
    orgId,
    isOrg
  );
  const hasDiamond = isDiamondPlan(profile?.premium);

  const button = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsOpen(true)}
      disabled={isProfileLoading || !hasDiamond}
      className="h-8 rounded-xl text-xs border-border/60 hover:bg-muted/60 transition-all font-medium disabled:opacity-50"
    >
      <Upload className="h-3.5 w-3.5 mr-1 text-yellow-500" />
      <span>Импорт доски</span>
    </Button>
  );

  return (
    <>
      <BoardImportModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      {!hasDiamond && !isProfileLoading ? (
        <Hint
          side="left"
          sideOffset={6}
          description="Импорт доступен только на тарифе Diamond"
        >
          <span className="inline-block cursor-not-allowed">{button}</span>
        </Hint>
      ) : (
        button
      )}
    </>
  );
}
