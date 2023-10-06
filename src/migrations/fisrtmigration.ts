import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateUsersAndTokens1633497845723 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear la tabla 'users'
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                new TableColumn({
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                }),
                new TableColumn({
                    name: 'first_name',
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'email',
                    type: 'varchar',
                    isUnique: true
                }),
                new TableColumn({
                    name: 'password_hash',
                    type: 'varchar'
                }),
            ]
        }));

        // Crear la tabla 'password_resets'
        await queryRunner.createTable(new Table({
            name: 'password_resets',
            columns: [
                new TableColumn({
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                }),
                new TableColumn({
                    name: 'token',
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'expires_at',
                    type: 'timestamp'
                }),
                new TableColumn({
                    name: 'user_id',
                    type: 'int'
                }),
            ]
        }));

        // Crear la tabla 'tokens'
        await queryRunner.createTable(new Table({
            name: 'tokens',
            columns: [
                new TableColumn({
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                }),
                new TableColumn({
                    name: 'token',
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'type',
                    type: 'varchar'
                }),
                new TableColumn({
                    name: 'expires_at',
                    type: 'timestamp'
                }),
                new TableColumn({
                    name: 'user_id',
                    type: 'int'
                }),
            ]
        }));

        const userForeignKey = new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE'
        });
        
        await queryRunner.createForeignKey('password_resets', userForeignKey);
        await queryRunner.createForeignKey('tokens', userForeignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('password_resets');
        await queryRunner.dropTable('tokens');
        await queryRunner.dropTable('users');
    }
}
