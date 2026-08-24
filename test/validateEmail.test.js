import { describe, test, expect } from 'vitest';
import { validateEmail } from '../src/js/validateEmail.js';

describe('validateEmail', () => {
  test('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co')).toBe(true);
  });

  test('should reject invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('missing@')).toBe(false);
    expect(validateEmail('@nodomain.com')).toBe(false);
  });

  test('should handle empty strings', () => {
    expect(validateEmail('')).toBe(false);
  });

  test('should handle null/undefined', () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
  });

  test('should trim whitespace', () => {
    expect(validateEmail('  test@example.com  ')).toBe(true);
  });

  test('should enforce maximum email length (254 chars)', () => {
    const longLocal = 'a'.repeat(255) + '@example.com';
    expect(validateEmail(longLocal)).toBe(false);
    const atLimit = 'a'.repeat(245) + '@test.co';
    expect(validateEmail(atLimit)).toBe(true);
  });
});
