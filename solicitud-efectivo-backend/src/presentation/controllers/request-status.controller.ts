import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestStatusService } from '../../core/domain/services/request-status.service';
import { RequestStatusQueryDto } from '../../core/application/dto/request-status-query.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { SolicitudDesembolsoWebStatusEntity } from '../../infrastructure/database/entities/solicitud-desembolso-web-status.entity';

@ApiTags('Solicitud Status')
@Controller('solicitud-desembolso-web-status')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RequestStatusController {
  constructor(private readonly service: RequestStatusService) {}

  @Get()
  @Roles(1) // Admin
  @ApiOperation({ summary: 'Listar estados con paginación y filtro por descripción' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'descripcion', required: false, type: String, example: 'Pend' })
  @ApiResponse({ status: 200, description: 'Lista paginada', type: [SolicitudDesembolsoWebStatusEntity] })
  async list(@Query() query: RequestStatusQueryDto) {
    return this.service.list(query);
  }
}


