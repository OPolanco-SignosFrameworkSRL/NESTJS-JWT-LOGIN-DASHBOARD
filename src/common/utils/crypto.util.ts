import * as crypto from 'crypto';
import { APP_CONSTANTS } from '../constants/app.constants';

export class CryptoUtil {
  /**
   * Calcula el hash SHA-256 de un string
   * @param input - String a hashear
   * @returns Hash hexadecimal
   */
  static calculateSHA256(input: string): string {
    return crypto
      .createHash(APP_CONSTANTS.AUTH.HASH_ALGORITHM)
      .update(input, 'utf8')
      .digest('hex');
  }

  /**
   * Genera el hash para el código de usuario
   * @param cedula - Cédula del usuario
   * @returns Hash del código
   */
  static generateUserCode(cedula: string): string {
    const input = cedula + APP_CONSTANTS.AUTH.CLAVE_FIJA;
    return this.calculateSHA256(input);
  }

  /**
   * Verifica si un hash coincide con el esperado
   * @param cedula - Cédula del usuario
   * @param hash - Hash a verificar
   * @returns true si coincide
   */
  static verifyUserCode(cedula: string, hash: string): boolean {
    const expectedHash = this.generateUserCode(cedula);
    return expectedHash === hash;
  }

  /**
   * Genera un token aleatorio
   * @param length - Longitud del token
   * @returns Token aleatorio
   */
  static generateRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Genera un salt aleatorio
   * @param length - Longitud del salt
   * @returns Salt aleatorio
   */
  static generateSalt(length: number = 16): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
