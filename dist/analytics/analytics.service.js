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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const analytics_evento_entity_1 = require("./entities/analytics-evento.entity");
let AnalyticsService = class AnalyticsService {
    dataSource;
    eventoRepository;
    constructor(dataSource, eventoRepository) {
        this.dataSource = dataSource;
        this.eventoRepository = eventoRepository;
    }
    async registrarEvento(dto) {
        const evento = this.eventoRepository.create({
            tipoEvento: dto.tipoEvento,
            destino: dto.destinoId ? { id: dto.destinoId } : undefined,
            paquete: dto.paqueteId ? { id: dto.paqueteId } : undefined,
            metadata: dto.metadata,
        });
        await this.eventoRepository.save(evento);
    }
    async dashboard() {
        const [row] = await this.dataSource.query('SELECT dashboard_general()');
        return row.dashboard_general;
    }
    async topDestinos() {
        const rows = await this.dataSource.query('SELECT * FROM top_destinos()');
        return rows.map((r) => ({ ...r, visitas: Number(r.visitas) }));
    }
    async topPaquetes() {
        const rows = await this.dataSource.query('SELECT * FROM top_paquetes()');
        return rows.map((r) => ({ ...r, visitas: Number(r.visitas) }));
    }
    async tendenciaMensual() {
        const rows = await this.dataSource.query('SELECT * FROM tendencia_mensual()');
        return rows.map((r) => ({ mes: r.mes, visitas: Number(r.visitas) }));
    }
    async ventasMensuales() {
        const rows = await this.dataSource.query('SELECT * FROM mv_ventas_mensuales ORDER BY mes ASC');
        return rows.map((r) => ({
            mes: r.mes,
            reservas: Number(r.reservas),
            ingresos: r.ingresos ? Number(r.ingresos) : 0,
        }));
    }
    async refrescarVistas() {
        await this.dataSource.query('REFRESH MATERIALIZED VIEW mv_destinos_populares');
        await this.dataSource.query('REFRESH MATERIALIZED VIEW mv_paquetes_populares');
        await this.dataSource.query('REFRESH MATERIALIZED VIEW mv_ventas_mensuales');
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(analytics_evento_entity_1.AnalyticsEvento)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map