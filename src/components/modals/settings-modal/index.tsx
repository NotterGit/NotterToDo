"use client"

import { useEffect, useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { LogOut, Settings } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSettingsModal } from "@/hooks/use-settings-modal"
import { pages } from "@/config/routing/pages.route"
import { ModeToggle } from "@/components/ui/mode-toggle"

export function SettingsModal() {
  const { isOpen, onClose } = useSettingsModal()
  const { openUserProfile, signOut } = useClerk()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleOpenAccountSettings = () => {
    onClose()
    openUserProfile()
  }

  const handleSignOut = () => {
    onClose()
    signOut({ redirectUrl: pages.ROOT })
  }

  if (!isMounted) {
    return null
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-md w-full p-6 sm:max-w-md gap-5">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-medium tracking-tight">
            Настройки
          </DialogTitle>
        </DialogHeader>

        <div className="h-px bg-border/60 -mx-6" />

        <div className="space-y-4 py-1">
          <div className="flex items-center justify-between gap-x-4">
            <div className="space-y-0.5">
              <p className="font-medium text-sm text-foreground">Тема</p>
              <p className="text-xs text-muted-foreground">
                Настройте Notter для комфортной работы
              </p>
            </div>
            <ModeToggle/>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border/60">
          <Button
            variant="outline"
            onClick={handleOpenAccountSettings}
            className="flex-1 h-10 font-normal border-border bg-neutral-900/10 dark:bg-neutral-900/60 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-foreground"
          >
            <Settings className="h-4 w-4 mr-2 shrink-0" />
            <span>Настройки аккаунта</span>
          </Button>
          <Button
            onClick={handleSignOut}
            className="flex-1 h-10 font-normal bg-[#8b2626] hover:bg-[#a32e2e] dark:bg-[#7f1d1d] dark:hover:bg-[#991b1b] text-white border border-red-800/40 shadow-sm"
          >
            <LogOut className="h-4 w-4 mr-2 shrink-0" />
            <span>Выйти из аккаунта</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
