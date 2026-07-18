import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHashedRefreshTokenToUsuarios1783871828928
  implements MigrationInterface
{
  name = 'AddHashedRefreshTokenToUsuarios1783871828928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "hashedRefreshToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "hashedRefreshToken"`,
    );
  }
}
