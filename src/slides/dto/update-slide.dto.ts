import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateSlideDto } from './create-slide.dto';

// El tipo y la referencia no se editan una vez creado el slide: si el
// admin se equivocó de servicio, es más simple borrar el slide y crear
// uno nuevo apuntando al correcto (evita casos raros de "slide de
// destino que ahora apunta a una noticia").
export class UpdateSlideDto extends PartialType(
  OmitType(CreateSlideDto, ['tipo', 'referenciaId'] as const),
) {}
