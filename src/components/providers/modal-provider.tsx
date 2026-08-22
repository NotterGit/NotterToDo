"use client"

import { CardModal } from "@/components/modals/card-modal";
import { OrgModal } from "@/components/modals/org-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import { useEffect, useState } from "react";

export function ModalProvider() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <>
            <CardModal />
            <OrgModal />
            <SettingsModal />
        </>
    )
}