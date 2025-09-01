import { Injectable, BadRequestException, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { CreateDesembolsoDto } from '../dto/create-desembolso.dto';
import { ICashRequestRepository } from '../../domain/repositories/cash-request.repository.interface';
import { IDesembolsoRepository } from '../../domain/repositories/desembolso.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CASH_REQUEST_REPOSITORY } from '../../application/tokens';
import { USER_REPOSITORY } from '../../application/tokens';

@Injectable()
export class CreateDesembolsoUseCase {
  constructor(
    @Inject(CASH_REQUEST_REPOSITORY)
    private readonly cashRequestRepository: ICashRequestRepository,
    @Inject('IDesembolsoRepository')
    private readonly desembolsoRepository: IDesembolsoRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    createDesembolsoDto: CreateDesembolsoDto,
    currentUser: { sub: number; role: string }
  ): Promise<any> {
    // 1. Validar pre-condiciones
    await this.validatePreConditions(createDesembolsoDto, currentUser);

    // 2. Validar campos obligatorios
    this.validateRequiredFields(createDesembolsoDto);

    // 3. Validar monto de desembolso
    await this.validateMontoDesembolso(createDesembolsoDto);

    // 4. Generar número de desembolso único
    const numeroDesembolso = await this.generateNumeroDesembolso();

    // 5. Crear el desembolso
    const desembolso = await this.desembolsoRepository.create({
      ...createDesembolsoDto,
      numero_desembolso: numeroDesembolso,
      registrado_por_id: currentUser.sub,
      estado: 'ACTIVO',
    });

    // 6. Cambiar estado de la solicitud a "Desembolsado" (estado 5)
    await this.cashRequestRepository.updateStatus(
      createDesembolsoDto.solicitud_id,
      5, // DESEMBOLSADO
      currentUser.sub,
      'disburse',
      `Desembolso registrado: ${numeroDesembolso}`,
      new Date()
    );

    return {
      message: 'Desembolso registrado exitosamente',
      desembolso: {
        id: desembolso.id,
        numero_desembolso: desembolso.numero_desembolso,
        solicitud_id: desembolso.solicitud_id,
        monto_desembolso: desembolso.monto_desembolso,
        fecha_registro: desembolso.fecha_registro,
        estado: 'Desembolsado',
      },
    };
  }

  /**
   * Validar pre-condiciones
   */
  private async validatePreConditions(
    createDesembolsoDto: CreateDesembolsoDto,
    currentUser: { sub: number; role: string }
  ): Promise<void> {
    // 1. Verificar que la solicitud existe y está autorizada
    const solicitud = await this.cashRequestRepository.findById(createDesembolsoDto.solicitud_id);
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${createDesembolsoDto.solicitud_id} no encontrada`);
    }

    if (solicitud.solicitud_status !== 3) {
      throw new BadRequestException('Solo se pueden desembolsar solicitudes autorizadas');
    }

    // 2. Verificar que el usuario tiene rol autorizado
               const authorizedRoles = ['Admin', 'Administrator'];
    if (!authorizedRoles.includes(currentUser.role)) {
      throw new ForbiddenException('No tiene permisos para ejecutar desembolsos');
    }

    // 3. Verificar que existen fondos disponibles (aquí podrías agregar lógica adicional)
    // Por ahora solo validamos que el monto no exceda el solicitado
  }

  /**
   * Validar campos obligatorios
   */
  private validateRequiredFields(createDesembolsoDto: CreateDesembolsoDto): void {
    const requiredFields = [
      'solicitud_id',
      'responsable_id',
      'cedula_identidad',
      'division_id',
      'metodo_pago_id',
      'monto_desembolso'
    ];

    for (const field of requiredFields) {
      if (!createDesembolsoDto[field]) {
        throw new BadRequestException(`El campo ${field} es obligatorio`);
      }
    }
  }

  /**
   * Validar monto de desembolso
   */
  private async validateMontoDesembolso(createDesembolsoDto: CreateDesembolsoDto): Promise<void> {
    const solicitud = await this.cashRequestRepository.findById(createDesembolsoDto.solicitud_id);
    
    if (createDesembolsoDto.monto_desembolso > solicitud.monto_solicitado) {
      throw new BadRequestException(
        `El monto de desembolso (${createDesembolsoDto.monto_desembolso}) no puede exceder el monto solicitado (${solicitud.monto_solicitado})`
      );
    }

    // Fórmula: MontoDesembolso === MontoSolicitado (opcional, pero recomendado)
    if (createDesembolsoDto.monto_desembolso !== solicitud.monto_solicitado) {
      console.warn(`⚠️ Desembolso parcial: ${createDesembolsoDto.monto_desembolso} de ${solicitud.monto_solicitado}`);
    }
  }

  /**
   * Generar número de desembolso único
   */
  private async generateNumeroDesembolso(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    
    // Obtener el último número de desembolso del mes
    const lastDesembolso = await this.desembolsoRepository.findLastByMonth(year, month);
    
    let sequence = 1;
    if (lastDesembolso) {
      const lastSequence = parseInt(lastDesembolso.numero_desembolso.split('-')[3]);
      sequence = lastSequence + 1;
    }

    return `DES-${year}${month}-${String(sequence).padStart(3, '0')}`;
  }
}
