import "reflect-metadata"
import path from 'path'
import { DataSource } from 'typeorm'
import { DB_PASSWORD, DB_NAME } from './env';

// ALTER USER postgres WITH PASSWORD '5432';
export default new DataSource({
    type: "postgres",
    host: "localhost",
    password: DB_PASSWORD,
    port: 5432,
    username: "postgres",
    database: DB_NAME,
    entities: [
        path.resolve(__dirname, "..", "entities", "*.entity.{ts,js}")
    ],
    migrations: [],
    logging: false,
    synchronize: true
})
