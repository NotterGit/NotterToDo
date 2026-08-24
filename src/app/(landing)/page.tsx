import { About } from "@/components/landing/about";
import { Heading } from "@/components/landing/heading";
import { Premium } from "@/components/landing/premium";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-full w-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-12 pb-16 text-center md:gap-y-20">
        <div className="relative isolate mx-auto w-full max-w-6xl">
          <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-logo-yellow opacity-30 blur-3xl dark:bg-logo-light-yellow" />
          <div className="pointer-events-none absolute -bottom-36 -left-24 -z-10 h-96 w-96 rounded-full bg-logo-cyan opacity-20 blur-3xl" />
          <Heading />
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <About />
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <Premium />
        </div>
      </div>
    </div>
  );
}