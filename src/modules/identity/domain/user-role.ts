export const USER_ROLES = ['CUSTOMER', 'ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];
