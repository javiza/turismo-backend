import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddContactosAdicionalesAClientes1786500000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
