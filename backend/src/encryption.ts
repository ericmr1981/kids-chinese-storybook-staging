import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

// 从环境变量获取 32 字节加密密钥
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, 'utf-8').length !== KEY_LENGTH) {
  throw new Error('ENCRYPTION_KEY must be exactly 32 characters');
}
const key = Buffer.from(ENCRYPTION_KEY, 'utf-8');

export interface EncryptedData {
  iv: string;
  authTag: string;
  data: string;
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return JSON.stringify({ iv: iv.toString('hex'), authTag: authTag.toString('hex'), data: encrypted });
}

export function decrypt(encryptedJson: string): string {
  const encrypted: EncryptedData = JSON.parse(encryptedJson);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(encrypted.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
  let decrypted = decipher.update(encrypted.data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}