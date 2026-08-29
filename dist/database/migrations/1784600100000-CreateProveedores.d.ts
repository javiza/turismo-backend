import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateProveedores1784600100000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
