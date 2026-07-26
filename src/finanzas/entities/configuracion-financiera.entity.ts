import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

import { numericTransformer } from '../../common/transformers/numeric.transformer';

/**
 * Fila única (id siempre = 1) con la configuración financiera editable
 * del panel admin. Por ahora solo el % de impuesto (IVA), que vive en
 * base de datos (y no en variable de entorno) para que un
 * SUPER_ADMIN/ADMIN lo pueda actualizar desde el panel cuando cambie la
 * normativa chilena, sin necesitar redeploy. Ver migración
 * CreateConfiguracionFinanciera.
 */
@Entity('configuracion_financiera')
export class ConfiguracionFinanciera {
  @PrimaryColumn({ default: 1 })
  id!: number;

  @Column('numeric', {
    name: 'porcentaje_impuesto',
    precision: 5,
    scale: 2,
    transformer: numericTransformer,
  })
  porcentajeImpuesto!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
