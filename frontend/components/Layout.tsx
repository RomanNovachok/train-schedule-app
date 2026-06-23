import Link from 'next/link';
import { ReactNode } from 'react';
import { UserInfo } from '../lib/auth';

type Props = {
  children: ReactNode;
  user: UserInfo | null;
};

export default function Layout({ children, user }: Props) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/80 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6">
        <nav
          aria-label="Primary navigation"
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <strong className="text-lg text-slate-950 sm:text-xl">Train Schedule</strong>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
            {user ? (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {user.email}
              </span>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-slate-950 px-4 py-1.5 text-white transition hover:bg-slate-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
