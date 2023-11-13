import { DataSource } from "typeorm";
import { Profile } from "../../infrastructure/database/entities/profile.entity";

export const profileProviders = [
    {
        provide: 'PROFILE_REPOSITORY',
        useFactory: (connection: DataSource) => connection.getRepository(Profile),
        inject: ['DATA_SOURCE'],
    },
];