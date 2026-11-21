export const DELIVERY_METHODS = {
  COURIER: { code: 'COURIER', name: 'Courier delivery', feeMinor: 5000 },
  POSTAL_SERVICE: { code: 'POSTAL_SERVICE', name: 'Postal service', feeMinor: 3000 },
  PICKUP: { code: 'PICKUP', name: 'Self pickup', feeMinor: 0 },
} as const;

export type DeliveryMethodCode = keyof typeof DELIVERY_METHODS;

export const DELIVERY_METHOD_CODES = Object.keys(
  DELIVERY_METHODS,
) as DeliveryMethodCode[];

export function deliveryFeeOf(code: DeliveryMethodCode): number {
  return DELIVERY_METHODS[code].feeMinor;
}
