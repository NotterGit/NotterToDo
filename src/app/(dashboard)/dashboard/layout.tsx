import { Sidebar } from "@/components/dashboard/navigation/sidebar"

export default function DashboardLayout({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    return (
        <div className="relative min-h-full">
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