export type DomainErrorKind =
  | 'conflict'
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  | 'validation'
  | 'unprocessable';

export abstract class DomainError extends Error {
  abstract readonly kind: DomainErrorKind;
  abstract readonly code: string;
}
