import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { ICryptoService } from '../../core/domain/crypto.service.interface';

/**
 * Implementación del servicio de criptografía
 * Proporciona funcionalidades de hash y encriptación
 */
@Injectable()
export class CryptoService implements ICryptoService {
  /**
   * Calcula el hash SHA-256 de una cadena de texto
   */
  calculateSHA256(text: string): string {
    return createHash('sha256').update(text).digest('hex');
  }

  /**
   * Genera un token aleatorio seguro
   */
  generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * Compara una contraseña con su hash
   */
  comparePassword(password: string, hash: string): boolean {
    const passwordHash = this.calculateSHA256(password);
    return passwordHash === hash;
  }

  /**
   * Encripta datos sensibles (implementación básica)
   * En producción, usar algoritmos más seguros como AES
   */
  encrypt(data: string): string {
    // Implementación básica - en producción usar algoritmos más seguros
    return Buffer.from(data).toString('base64');
  }

  /**
   * Desencripta datos sensibles (implementación básica)
   */
  decrypt(encryptedData: string): string {
    // Implementación básica - en producción usar algoritmos más seguros
    return Buffer.from(encryptedData, 'base64').toString('utf-8');
  }

  /**
   * Genera un hash seguro para contraseñas con salt
   */
  generatePasswordHash(password: string, salt?: string): { hash: string; salt: string } {
    const generatedSalt = salt || this.generateSecureToken(16);
    const hash = this.calculateSHA256(password + generatedSalt);
    return { hash, salt: generatedSalt };
  }

  /**
   * Verifica una contraseña contra su hash y salt
   */
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const { hash: expectedHash } = this.generatePasswordHash(password, salt);
    return hash === expectedHash;
  }
} 