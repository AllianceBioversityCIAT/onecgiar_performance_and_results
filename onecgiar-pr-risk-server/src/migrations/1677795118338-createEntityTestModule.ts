import { MigrationInterface, QueryRunner } from "typeorm";

export class createEntityTestModule1677795118338 implements MigrationInterface {
    name = 'createEntityTestModule1677795118338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`test_module\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`test_module\``);
    }

}
