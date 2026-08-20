import { Navbar } from "@/components/dashboard/navigation/navbar"

export default function DashboardLayout({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    return (
        <div className="h-full">
            <Navbar/>
            {children}
        </div>
    )
}