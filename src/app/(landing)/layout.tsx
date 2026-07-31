import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default function Layout({
  children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col bg-slate-100">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-6 px-4">
            {children}
        </main>
        <Footer />
    </div>
  );
}