import { DataSource } from "typeorm";
import { User } from "src/infrastructure/database/entities";

export const usersProviders = [
    {
        provide: 'USERS_REPOSITORY',
        useFactory: (connection: DataSource) => connection.getRepository(User),
        inject: ['DATA_SOURCE'],
    },
];