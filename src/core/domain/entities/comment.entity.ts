/**
 * Entidad de dominio Comment
 * Representa un comentario en una solicitud de efectivo en el sistema de negocio
 * Un usuario puede tener solo un comentario por solicitud
 * No depende de frameworks externos
 */
export class Comment {
  constructor(
    public readonly id: number,
    public readonly fechacreado: Date,
    public readonly creadoporid: number,
    public readonly solicitudid: number,
    public readonly creadopor_cedula: string,
    public readonly comentario: string,
  ) {}

  /**
   * Verifica si el comentario pertenece a un usuario específico
   */
  belongsToUser(userId: number): boolean {
    return this.creadoporid === userId;
  }

  /**
   * Verifica si el comentario pertenece a una solicitud específica
   */
  belongsToRequest(requestId: number): boolean {
    return this.solicitudid === requestId;
  }

  /**
   * Verifica si el comentario está vacío (eliminado)
   */
  isEmpty(): boolean {
    return !this.comentario || this.comentario.trim() === '';
  }

  /**
   * Obtiene la fecha de creación formateada
   */
  getFormattedDate(): string {
    return this.fechacreado.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Verifica si el comentario es reciente (últimas 24 horas)
   */
  isRecent(): boolean {
    const now = new Date();
    const diffInHours = (now.getTime() - this.fechacreado.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
  }
}
