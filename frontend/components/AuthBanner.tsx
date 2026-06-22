import { UserInfo } from '../lib/auth';

type Props = {
  user: UserInfo | null;
  onLogout?: () => void;
};

export default function AuthBanner({ user, onLogout }: Props) {
  const guestMessage = 'Log in to add or edit train records. Only admins can delete records.';
  const userMessage = 'You can add and edit train records. Delete access is available only for admins.';
  const adminMessage = 'Admin access: you can add, edit, and delete train records.';

  if (user) {
    const message = user.role === 'ADMIN' ? adminMessage : user.role === 'USER' ? userMessage : guestMessage;

    return (
      <div className="card header-row" style={{ alignItems: 'center' }}>
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
      </div>
    );
  }

  return (
    <div className="card">
      {guestMessage}
    </div>
  );
}
