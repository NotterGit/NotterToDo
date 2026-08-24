import { Sidebar } from "@/components/dashboard/navigation/sidebar"

export default function DashboardLayout({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    return (
        <div className="relative isolate min-h-full overflow-hidden">
            <div className="pointer-events-none absolute -left-16 top-16 -z-10 h-64 w-64 rounded-full bg-logo-yellow/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-12 bottom-12 -z-10 h-72 w-72 rounded-full bg-logo-cyan/15 blur-3xl" />

            <div 
                aria-hidden="true"
                className="fixed inset-y-0 left-0 w-[calc(max(0px,50vw-36rem)+17rem)] 2xl:w-[calc(max(0px,50vw-40rem)+17rem)] bg-neutral-100/70 dark:bg-black/25 -z-10 pointer-events-none hidden md:block" 
            />
            <main className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
                <div className="flex gap-x-7">
                    <div className="w-64 shrink-0 hidden md:block pr-4">
                        <Sidebar/>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    )
}