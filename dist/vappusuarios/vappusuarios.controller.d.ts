import { VappusuariosService } from './vappusuarios.service';
export declare class VappusuariosController {
    private readonly vappusuariosService;
    constructor(vappusuariosService: VappusuariosService);
    findAll(): Promise<any>;
}
