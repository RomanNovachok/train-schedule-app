import { UserInfo } from '../lib/auth';
import { UserRoles } from '../lib/user-roles';

type Props = {
  user: UserInfo | null;
  onLogout?: () => void;
};

export default function AuthBanner({ user, onLogout }: Props) {
  const guestMessage = 'Log in to add or edit train records. Only admins can delete records.';
  const userMessage = 'You can add and edit train records. Delete access is available only for admins.';
  const adminMessage = 'Admin access: you can add, edit, and delete train records.';
  const messages = {
    [UserRoles.Admin]: adminMessage,
    [UserRoles.User]: userMessage,
  } as const;

  if (user) {
    const message = messages[user.role] || guestMessage;

    return (
      <section
        className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between"
        aria-label="Authentication status"
      >
        <div>
          <div className="text-sm text-slate-600">
            Logged in as <strong className="text-slate-950">{user.email}</strong> ({user.role})
          </div>
          <div className="mt-2 text-sm leading-6 text-slate-700">{message}</div>
        </div>
        {onLogout && (
          <button
            className="inline-flex items-center justify-center rounded-2xl bg-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
      </section>
    );
  }

  return (
    <section
      className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 text-sm leading-6 text-slate-700 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
      aria-label="Authentication status"
    >
      {guestMessage}
    </section>
  );
}
