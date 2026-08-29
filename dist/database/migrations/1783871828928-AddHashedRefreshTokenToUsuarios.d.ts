import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddHashedRefreshTokenToUsuarios1783871828928 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
