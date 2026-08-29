import { CreateDestinoDto } from './create-destino.dto';
declare const UpdateDestinoDto_base: import("@nestjs/common").Type<Partial<Omit<CreateDestinoDto, "imagenPrincipal" | "imagenes">>>;
export declare class UpdateDestinoDto extends UpdateDestinoDto_base {
    activo?: boolean;
}
export {};
