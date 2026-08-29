import { CreateOfertaDto } from './create-oferta.dto';
declare const UpdateOfertaDto_base: import("@nestjs/common").Type<Partial<Omit<CreateOfertaDto, "imagenPrincipal" | "imagenes">>>;
export declare class UpdateOfertaDto extends UpdateOfertaDto_base {
    activa?: boolean;
}
export {};
