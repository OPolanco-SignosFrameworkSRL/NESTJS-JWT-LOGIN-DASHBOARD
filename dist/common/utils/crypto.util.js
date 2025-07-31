"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtil = void 0;
const crypto = require("crypto");
const app_constants_1 = require("../constants/app.constants");
class CryptoUtil {
    static calculateSHA256(input) {
        return crypto
            .createHash(app_constants_1.APP_CONSTANTS.AUTH.HASH_ALGORITHM)
            .update(input, 'utf8')
            .digest('hex');
    }
    static generateUserCode(cedula) {
        const input = cedula + app_constants_1.APP_CONSTANTS.AUTH.CLAVE_FIJA;
        return this.calculateSHA256(input);
    }
    static verifyUserCode(cedula, hash) {
        const expectedHash = this.generateUserCode(cedula);
        return expectedHash === hash;
    }
    static generateRandomToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }
    static generateSalt(length = 16) {
        return crypto.randomBytes(length).toString('hex');
    }
}
exports.CryptoUtil = CryptoUtil;
//# sourceMappingURL=crypto.util.js.map