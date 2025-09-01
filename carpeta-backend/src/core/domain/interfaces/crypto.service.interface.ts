/**
 * Interfaz del servicio de criptografía
 * Define los contratos para operaciones criptográficas
 */
export interface ICryptoService {
  /**
   * Calcula el hash SHA-256 de una cadena de texto
   */
  calculateSHA256(text: string): string;

  /**
   * Genera un token aleatorio seguro
   */
  generateSecureToken(length?: number): string;

  /**
   * Compara una contraseña con su hash
   */
  comparePassword(password: string, hash: string): boolean;

  /**
   * Encripta datos sensibles
   */
  encrypt(data: string): string;

  /**
   * Desencripta datos sensibles
   */
  decrypt(encryptedData: string): string;
}
