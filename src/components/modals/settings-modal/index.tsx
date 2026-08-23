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
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useBoardBlur } from "@/hooks/use-board-blur"
import { useLandingRedirect } from "@/hooks/use-landing-redirect"

export function SettingsModal() {
  const { isOpen, onClose } = useSettingsModal()
  const { blur, setBlur } = useBoardBlur()
  const { enabled: landingRedirectEnabled, setEnabled: setLandingRedirectEnabled } = useLandingRedirect()
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

        <div className="space-y-5 py-1">
          <div className="flex items-center justify-between gap-x-4">
            <div className="space-y-0.5">
              <p className="font-medium text-sm text-foreground">Тема</p>
              <p className="text-xs text-muted-foreground">
                Настройте Notter для комфортной работы
              </p>
            </div>
            <ModeToggle />
          </div>

          <div className="space-y-3 pt-3 border-t border-border/40">
            <div className="flex items-center justify-between gap-x-4">
              <div className="space-y-0.5">
                <p className="font-medium text-sm text-foreground">
                  Размытие фона досок
                </p>
                <p className="text-xs text-muted-foreground">
                  Настройка интенсивности размытия заднего фона
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border/50 min-w-12 text-center tabular-nums shadow-xs">
                {blur}%
              </span>
            </div>
            <div className="pt-1 px-0.5">
              <Slider
                value={blur}
                onValueChange={(val) => {
                  if (typeof val === "number") {
                    setBlur(val)
                  } else if (Array.isArray(val) && val.length > 0) {
                    setBlur(val[0])
                  }
                }}
                min={0}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground select-none pt-1">
                <span>0% (Чёткий)</span>
                <span>50%</span>
                <span>100% (Размытый)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-x-4 pt-3 border-t border-border/40">
            <div className="space-y-0.5">
              <p className="font-medium text-sm text-foreground">
                Редирект на дашборд
              </p>
              <p className="text-xs text-muted-foreground">
                Автоматически перенаправлять с главной страницы на дашборд
              </p>
            </div>
            <Switch
              checked={landingRedirectEnabled}
              onCheckedChange={setLandingRedirectEnabled}
            />
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
