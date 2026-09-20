import { CreatePaqueteDto } from './create-paquete.dto';
declare const UpdatePaqueteDto_base: import("@nestjs/common").Type<Partial<Omit<CreatePaqueteDto, "imagenPrincipal" | "imagenes">>>;
export declare class UpdatePaqueteDto extends UpdatePaqueteDto_base {
    activo?: boolean;
    limpiarPrecioAnterior?: boolean;
}
export {};
