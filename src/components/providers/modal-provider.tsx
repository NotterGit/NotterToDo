"use client"

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CardModal = dynamic(() => import("@/components/modals").then((m) => m.CardModal), { ssr: false });
const OrgModal = dynamic(() => import("@/components/modals").then((m) => m.OrgModal), { ssr: false });
const SettingsModal = dynamic(() => import("@/components/modals").then((m) => m.SettingsModal), { ssr: false });

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