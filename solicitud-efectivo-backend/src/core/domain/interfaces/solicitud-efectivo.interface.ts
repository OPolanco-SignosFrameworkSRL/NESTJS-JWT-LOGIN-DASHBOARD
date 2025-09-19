/**
 * Estados de las solicitudes de efectivo
 */
export enum SolicitudEfectivoStatus {
  PENDIENTE = 1,
  APROBADA = 2,
  AUTORIZADO = 3,
  RECHAZADA = 4,
  DESEMBOLSADO = 5,
  VERIFICADA = 6,
}

/**
 * Tipos de solicitudes de efectivo (basado en datos reales de la BD)
 */
export enum SolicitudEfectivoType {
  SOLICITUD_CHEQUE = 1,           // produccion_flag: 1 (no usar)
  COMPRAS_MATERIALES_ORDENES = 2, // produccion_flag: 0 ✅
  MANTENIMIENTO_VENDEDORES = 3,   // produccion_flag: 0 ✅
  MANTENIMIENTO_REPARACION = 4,  // produccion_flag: 0 ✅
  SOLICITUD_DIETA = 5,           // produccion_flag: 0 ✅
  COMPRA_HERRAMIENTAS = 6,       // produccion_flag: 0 ✅
  COMPRA_SUMINISTROS = 7,        // produccion_flag: 0 ✅
  COMPRA_MATERIALES = 8,         // produccion_flag: 1 (no usar)
  COMPRA_MUESTRA_CLIENTE = 9,    // produccion_flag: 0 ✅
}

/**
 * Divisiones del sistema
 */
export enum Division {
  ADMINISTRACION = 1,
  TI = 2,
  VENTAS = 3,
  PRODUCCION = 4,
}
