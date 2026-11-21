export const PAYMENT_STATUSES = ['PENDING', 'SUCCEEDED', 'FAILED'] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
