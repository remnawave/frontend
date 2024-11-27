import { z } from 'zod';
import parsePhoneNumber, { isValidPhoneNumber as baseIsValidPhoneNumber } from 'libphonenumber-js';

export const isValidPhoneNumber = (value: string) => baseIsValidPhoneNumber(value);

export const phoneNumberSchema = z
  .string()
  .trim()
  .refine(isValidPhoneNumber, 'Invalid phone number');

export function formatPhoneNumber(phoneNumber: string) {
  return parsePhoneNumber(phoneNumber)?.formatInternational() ?? phoneNumber;
}
