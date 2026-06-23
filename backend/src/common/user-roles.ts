import { Role } from '@prisma/client';

export const UserRoles = {
  Admin: Role.ADMIN,
  User: Role.USER,
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
