import Link from 'next/link';
import { ReactNode } from 'react';
import { UserInfo } from '../lib/auth';

type Props = {
  children: ReactNode;
  user: UserInfo | null;
};

export default function Layout({ children, user }: Props) {
  return (
    <div className="container">
      <nav>
        <div>
          <strong>Train Schedule</strong>
        </div>
        <div>
          {user ? <span>{user.email}</span> : <><Link href="/login">Login</Link><Link href="/register">Register</Link></>}
        </div>
      </nav>
      {children}
    </div>
  );
}
