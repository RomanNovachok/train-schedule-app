export const UserRoles = {
  Admin: 'ADMIN',
  User: 'USER',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
