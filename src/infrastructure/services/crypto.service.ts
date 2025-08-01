import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { ICryptoService } from '../../core/domain/crypto.service.interface';

@Injectable()
export class CryptoService implements ICryptoService {
  calculateSHA256(text: string): string {
    return createHash('sha256').update(text).digest('hex');
  }
} 