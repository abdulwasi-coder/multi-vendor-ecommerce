import Link from "next/link";

export function AccountPageShell({ children }) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-4 pt-5 text-[#0f1111]">
      <Link href="/customer" aria-label="Marketly home" className="mb-5 text-[32px] font-bold tracking-tight text-[#111]">
        marketly<span className="text-[#f3a847]">.</span>
      </Link>
      {children}
      <footer className="mt-auto w-full max-w-[1200px] pb-7 pt-10 text-center text-xs text-[#565959]">
        <div className="mb-6 border-t border-[#d5d9d9]" />
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[#007185]">
          <span>Conditions of Use</span>
          <span>Privacy Notice</span>
          <span>Help</span>
          <span>Contact</span>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} Marketly. All rights reserved.</p>
      </footer>
    </main>
  );
}
