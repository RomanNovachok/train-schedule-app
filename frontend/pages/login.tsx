import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { login } from '../lib/api';
import { storeToken, decodeUser, UserInfo } from '../lib/auth';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(email, password);
      storeToken(response.accessToken);
      const currentUser = decodeUser(response.accessToken);
      setUser(currentUser);
      router.push('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user}>
      <div className="mx-auto max-w-md pt-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_14px_38px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-slate-950">Login</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Sign in to manage train records and keep the schedule up to date.
            </p>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                className={inputClass}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-blue-600 transition hover:text-blue-700">
              Register
            </Link>
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Or{' '}
            <Link href="/" className="font-semibold text-slate-700 transition hover:text-slate-950">
              continue as guest
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
