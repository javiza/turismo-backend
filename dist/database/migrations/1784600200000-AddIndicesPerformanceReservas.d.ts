import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddIndicesPerformanceReservas1784600200000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
