export declare class CryptoUtil {
    static calculateSHA256(input: string): string;
    static generateUserCode(cedula: string): string;
    static verifyUserCode(cedula: string, hash: string): boolean;
    static generateRandomToken(length?: number): string;
    static generateSalt(length?: number): string;
}
