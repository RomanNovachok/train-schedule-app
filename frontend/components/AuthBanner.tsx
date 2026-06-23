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

  if (user) {
    const message =
      user.role === UserRoles.Admin
        ? adminMessage
        : user.role === UserRoles.User
          ? userMessage
          : guestMessage;

    return (
      <section className="card header-row" style={{ alignItems: 'center' }} aria-label="Authentication status">
        <div>
          <div>
            Logged in as <strong>{user.email}</strong> ({user.role})
          </div>
          <div style={{ marginTop: 6 }}>{message}</div>
        </div>
        {onLogout && (
          <button className="button secondary" onClick={onLogout}>
            Logout
          </button>
        )}
      </section>
    );
  }

  return <section className="card" aria-label="Authentication status">{guestMessage}</section>;
}
