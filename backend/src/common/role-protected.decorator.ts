import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserRole } from './user-roles';
import { JwtAuthGuard } from './jwt-auth.guard';

function formatRoles(roles: UserRole[]) {
  return roles.join(', ');
}

export function RoleProtected(...roles: UserRole[]) {
  const isAdminOnly = roles.length === 1 && roles[0] === 'ADMIN';
  const forbiddenDescription = isAdminOnly
    ? 'Only admins can access this endpoint'
    : `Only users with one of these roles can access this endpoint: ${formatRoles(roles)}`;

  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(...roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token' }),
    ApiForbiddenResponse({ description: forbiddenDescription }),
  );
}
