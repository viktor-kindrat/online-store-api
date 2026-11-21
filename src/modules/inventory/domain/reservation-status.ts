export const RESERVATION_STATUSES = ['ACTIVE', 'COMMITTED', 'RELEASED'] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];
