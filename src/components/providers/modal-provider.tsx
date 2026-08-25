"use client"

import { CardModal, OrgModal, SettingsModal } from "@/components/modals";
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