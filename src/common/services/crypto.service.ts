import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  /**
   * Calcula el hash SHA-256 de un string
   */
  calculateSHA256(input: string): string {
    return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
  }

  /**
   * Calcula el hash MD5 de un string
   */
  calculateMD5(input: string): string {
    return crypto.createHash('md5').update(input, 'utf8').digest('hex');
  }

  /**
   * Genera un salt aleatorio
   */
  generateSalt(length: number = 16): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Genera un hash con salt usando SHA-256
   */
  hashWithSalt(input: string, salt: string): string {
    return this.calculateSHA256(input + salt);
  }

  /**
   * Verifica un hash con salt
   */
  verifyHashWithSalt(input: string, salt: string, hash: string): boolean {
    const calculatedHash = this.hashWithSalt(input, salt);
    return calculatedHash === hash;
  }

  /**
   * Genera un token aleatorio seguro
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Encripta un texto usando AES-256-CBC
   */
  encrypt(text: string, secretKey: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Desencripta un texto usando AES-256-CBC
   */
  decrypt(encryptedText: string, secretKey: string): string {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encrypted = textParts.join(':');
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
