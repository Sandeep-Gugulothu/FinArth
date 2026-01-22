import crypto from 'crypto';

export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return hash === hashedPassword;
};

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};