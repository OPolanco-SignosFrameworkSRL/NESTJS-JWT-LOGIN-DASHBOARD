export declare class CryptoService {
    calculateSHA256(input: string): string;
    calculateMD5(input: string): string;
    generateSalt(length?: number): string;
    hashWithSalt(input: string, salt: string): string;
    verifyHashWithSalt(input: string, salt: string, hash: string): boolean;
    generateSecureToken(length?: number): string;
    encrypt(text: string, secretKey: string): string;
    decrypt(encryptedText: string, secretKey: string): string;
}
