/**
 * Cryptographic security utilities for SLAKE CMS Admin Panel
 * Uses standard Web Crypto API (SubtleCrypto)
 */

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:slake_secure_cms_salt`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(
  attempt: string,
  salt: string,
  storedHash: string
): Promise<boolean> {
  // If storedHash is legacy plain-text (e.g. initial '1234')
  if (storedHash === attempt) {
    return true;
  }
  const attemptHash = await hashPassword(attempt, salt || 'default_salt_slake');
  return attemptHash === storedHash;
}

export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

export function validatePasswordStrength(password: string): {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong';
  isValid: boolean;
  message: string;
} {
  if (!password || password.length < 4) {
    return {
      score: 0,
      label: 'Very Weak',
      isValid: false,
      message: 'Password must be at least 4 characters long.',
    };
  }

  let score = 1;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  score = Math.min(score, 4);

  const labels: Array<'Very Weak' | 'Weak' | 'Medium' | 'Strong'> = [
    'Very Weak',
    'Weak',
    'Medium',
    'Strong',
    'Strong',
  ];

  return {
    score,
    label: labels[score],
    isValid: password.length >= 4,
    message:
      score < 2
        ? 'Consider adding letters, numbers, or symbols.'
        : 'Good secure password.',
  };
}
