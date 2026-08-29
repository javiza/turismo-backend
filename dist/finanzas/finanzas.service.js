"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanzasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reserva_entity_1 = require("../reservas/entities/reserva.entity");
const movimiento_financiero_entity_1 = require("./entities/movimiento-financiero.entity");
const configuracion_financiera_entity_1 = require("./entities/configuracion-financiera.entity");
const roles_enum_1 = require("../common/constants/roles.enum");
const CONFIGURACION_SINGLETON_ID = 1;
const PORCENTAJE_IMPUESTO_DEFAULT = 19;
const TIPOS_PERDIDA = [
    movimiento_financiero_entity_1.TipoMovimientoFinanciero.ROBO,
    movimiento_financiero_entity_1.TipoMovimientoFinanciero.ESTAFA,
    movimiento_financiero_entity_1.TipoMovimientoFinanciero.PERDIDA,
];
let FinanzasService = class FinanzasService {
    reservaRepository;
    movimientoRepository;
    configuracionRepository;
    constructor(reservaRepository, movimientoRepository, configuracionRepository) {
        this.reservaRepository = reservaRepository;
        this.movimientoRepository = movimientoRepository;
        this.configuracionRepository = configuracionRepository;
    }
    async resumen() {
        const filas = await this.reservaRepository
            .createQueryBuilder('reserva')
            .select('reserva.estado', 'estado')
            .addSelect('COALESCE(SUM(reserva.montoTotal), 0)', 'monto')
            .addSelect('COUNT(*)', 'cantidad')
            .addSelect('COALESCE(SUM(reserva.cantidadPersonas), 0)', 'personas')
            .groupBy('reserva.estado')
            .getRawMany();
        const porEstado = (estado) => filas.find((f) => f.estado === estado);
        const confirmadas = porEstado(reserva_entity_1.EstadoReserva.CONFIRMADA);
        const pendientes = porEstado(reserva_entity_1.EstadoReserva.PENDIENTE);
        const canceladas = porEstado(reserva_entity_1.EstadoReserva.CANCELADA);
        const ingresosConfirmados = Number(confirmadas?.monto ?? 0);
        const reservasConfirmadas = Number(confirmadas?.cantidad ?? 0);
        const { ingresosManuales, egresosManuales, perdidasManuales } = await this.totalesMovimientosManuales();
        const gananciasTotales = Number((ingresosConfirmados +
            ingresosManuales -
            egresosManuales -
            perdidasManuales).toFixed(2));
        const gastosTotales = Number((egresosManuales + perdidasManuales).toFixed(2));
        const { porcentajeImpuesto } = await this.obtenerConfiguracion();
        const impuestos = gananciasTotales > 0
            ? Number(((gananciasTotales * porcentajeImpuesto) / 100).toFixed(2))
            : 0;
        const gananciaNeta = Number((gananciasTotales - impuestos).toFixed(2));
        return {
            ingresosConfirmados,
            ingresosPendientes: Number(pendientes?.monto ?? 0),
            ingresosCancelados: Number(canceladas?.monto ?? 0),
            ticketPromedio: reservasConfirmadas > 0
                ? Number((ingresosConfirmados / reservasConfirmadas).toFixed(2))
                : 0,
            totalReservas: filas.reduce((acc, f) => acc + Number(f.cantidad), 0),
            reservasConfirmadas,
            reservasPendientes: Number(pendientes?.cantidad ?? 0),
            reservasCanceladas: Number(canceladas?.cantidad ?? 0),
            personasConfirmadas: Number(confirmadas?.personas ?? 0),
            ingresosManuales,
            egresosManuales,
            perdidasManuales,
            gananciasTotales,
            gastosTotales,
            porcentajeImpuesto,
            impuestos,
            gananciaNeta,
        };
    }
    async obtenerConfiguracion() {
        const existente = await this.configuracionRepository.findOne({
            where: { id: CONFIGURACION_SINGLETON_ID },
        });
        if (existente) {
            return existente;
        }
        const nueva = this.configuracionRepository.create({
            id: CONFIGURACION_SINGLETON_ID,
            porcentajeImpuesto: PORCENTAJE_IMPUESTO_DEFAULT,
        });
        return this.configuracionRepository.save(nueva);
    }
    async actualizarConfiguracion(dto) {
        const configuracion = await this.obtenerConfiguracion();
        configuracion.porcentajeImpuesto = dto.porcentajeImpuesto;
        return this.configuracionRepository.save(configuracion);
    }
    async totalesMovimientosManuales() {
        const filas = await this.movimientoRepository
            .createQueryBuilder('m')
            .select('m.tipo', 'tipo')
            .addSelect('COALESCE(SUM(m.monto), 0)', 'monto')
            .groupBy('m.tipo')
            .getRawMany();
        const monto = (tipo) => Number(filas.find((f) => f.tipo === tipo)?.monto ?? 0);
        return {
            ingresosManuales: monto(movimiento_financiero_entity_1.TipoMovimientoFinanciero.INGRESO_MANUAL),
            egresosManuales: monto(movimiento_financiero_entity_1.TipoMovimientoFinanciero.EGRESO_MANUAL),
            perdidasManuales: TIPOS_PERDIDA.reduce((acc, tipo) => acc + monto(tipo), 0),
        };
    }
    async listarMovimientos(tipo) {
        return this.movimientoRepository.find({
            where: tipo ? { tipo } : {},
            relations: { usuario: true, cliente: true },
            order: { createdAt: 'DESC' },
            take: 200,
        });
    }
    async registrarMovimiento(dto, usuarioId) {
        const categoria = dto.tipo === movimiento_financiero_entity_1.TipoMovimientoFinanciero.EGRESO_MANUAL
            ? (dto.categoria ?? movimiento_financiero_entity_1.CategoriaGasto.OTRO)
            : null;
        const esIngreso = dto.tipo === movimiento_financiero_entity_1.TipoMovimientoFinanciero.INGRESO_MANUAL;
        const movimiento = this.movimientoRepository.create({
            ...dto,
            categoria,
            clienteId: esIngreso ? (dto.clienteId ?? null) : null,
            pagadorNombre: esIngreso ? (dto.pagadorNombre ?? null) : null,
            metodoPago: esIngreso ? (dto.metodoPago ?? null) : null,
            usuarioId,
        });
        const guardado = await this.movimientoRepository.save(movimiento);
        return this.movimientoRepository.findOneOrFail({
            where: { id: guardado.id },
            relations: { usuario: true, cliente: true },
        });
    }
    async gastosPorCategoria() {
        const filas = await this.movimientoRepository
            .createQueryBuilder('m')
            .select('m.categoria', 'categoria')
            .addSelect('COALESCE(SUM(m.monto), 0)', 'total')
            .where('m.tipo = :tipo', {
            tipo: movimiento_financiero_entity_1.TipoMovimientoFinanciero.EGRESO_MANUAL,
        })
            .groupBy('m.categoria')
            .orderBy('total', 'DESC')
            .getRawMany();
        return filas.map((f) => ({
            categoria: f.categoria ?? 'SIN_CATEGORIA',
            total: Number(f.total),
        }));
    }
    async eliminarMovimiento(id, rol) {
        if (rol !== roles_enum_1.Role.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Solo un super administrador puede eliminar movimientos financieros');
        }
        await this.movimientoRepository.delete(id);
    }
    async ingresosMensuales() {
        const filas = await this.reservaRepository
            .createQueryBuilder('reserva')
            .select(`date_trunc('month', reserva.fechaReserva)`, 'mes')
            .addSelect('reserva.estado', 'estado')
            .addSelect('COALESCE(SUM(reserva.montoTotal), 0)', 'monto')
            .where(`reserva.fechaReserva >= now() - interval '12 months'`)
            .groupBy('mes')
            .addGroupBy('reserva.estado')
            .orderBy('mes', 'ASC')
            .getRawMany();
        const porMes = new Map();
        for (const fila of filas) {
            const clave = fila.mes.toISOString().slice(0, 10);
            if (!porMes.has(clave)) {
                porMes.set(clave, {
                    mes: clave,
                    confirmados: 0,
                    pendientes: 0,
                    cancelados: 0,
                });
            }
            const entrada = porMes.get(clave);
            const monto = Number(fila.monto);
            if (fila.estado === reserva_entity_1.EstadoReserva.CONFIRMADA)
                entrada.confirmados = monto;
            else if (fila.estado === reserva_entity_1.EstadoReserva.PENDIENTE)
                entrada.pendientes = monto;
            else if (fila.estado === reserva_entity_1.EstadoReserva.CANCELADA)
                entrada.cancelados = monto;
        }
        return Array.from(porMes.values()).sort((a, b) => a.mes.localeCompare(b.mes));
    }
    async topPaquetes(limite = 5) {
        const filas = await this.reservaRepository
            .createQueryBuilder('reserva')
            .innerJoin('reserva.paquete', 'paquete')
            .select('paquete.id', 'id')
            .addSelect('paquete.nombre', 'nombre')
            .addSelect('COALESCE(SUM(reserva.montoTotal), 0)', 'ingresos')
            .addSelect('COUNT(*)', 'reservas')
            .where('reserva.estado = :estado', { estado: reserva_entity_1.EstadoReserva.CONFIRMADA })
            .groupBy('paquete.id')
            .addGroupBy('paquete.nombre')
            .orderBy('ingresos', 'DESC')
            .limit(limite)
            .getRawMany();
        return filas.map((f) => ({
            id: f.id,
            nombre: f.nombre,
            ingresos: Number(f.ingresos),
            reservas: Number(f.reservas),
        }));
    }
    async topDestinos(limite = 5) {
        const filas = await this.reservaRepository
            .createQueryBuilder('reserva')
            .innerJoin('reserva.paquete', 'paquete')
            .innerJoin('paquete.destino', 'destino')
            .select('destino.id', 'id')
            .addSelect('destino.nombre', 'nombre')
            .addSelect('COALESCE(SUM(reserva.montoTotal), 0)', 'ingresos')
            .addSelect('COUNT(*)', 'reservas')
            .where('reserva.estado = :estado', { estado: reserva_entity_1.EstadoReserva.CONFIRMADA })
            .groupBy('destino.id')
            .addGroupBy('destino.nombre')
            .orderBy('ingresos', 'DESC')
            .limit(limite)
            .getRawMany();
        return filas.map((f) => ({
            id: f.id,
            nombre: f.nombre,
            ingresos: Number(f.ingresos),
            reservas: Number(f.reservas),
        }));
    }
};
exports.FinanzasService = FinanzasService;
exports.FinanzasService = FinanzasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __param(1, (0, typeorm_1.InjectRepository)(movimiento_financiero_entity_1.MovimientoFinanciero)),
    __param(2, (0, typeorm_1.InjectRepository)(configuracion_financiera_entity_1.ConfiguracionFinanciera)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FinanzasService);
//# sourceMappingURL=finanzas.service.js.map