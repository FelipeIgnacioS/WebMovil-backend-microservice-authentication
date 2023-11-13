import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';

import{ User, Profile, Token } from './entities';

dotenv.config();

const {
    TYPEORM_HOST,
    TYPEORM_USERNAME,
    TYPEORM_PASSWORD,
    TYPEORM_DATABASE,
    TYPEORM_PORT,
  } = process.env;
  
const dataSource = new DataSource({
    type: 'postgres',
    host: TYPEORM_HOST,
    port: +TYPEORM_PORT,
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    database: TYPEORM_DATABASE,
    logging: true,
    synchronize: false,
    entities: [User, Profile, Token],
})

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            return dataSource.initialize();
        }
    },
];

export default dataSource;