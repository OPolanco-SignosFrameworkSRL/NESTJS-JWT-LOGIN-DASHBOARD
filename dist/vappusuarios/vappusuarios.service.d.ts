import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class VappusuariosService implements OnModuleInit, OnModuleDestroy {
    private pool;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    findAll(): Promise<any>;
}
