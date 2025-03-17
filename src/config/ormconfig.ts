import "reflect-metadata"
import path from 'path'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config();

// ALTER USER postgres WITH PASSWORD '5432';
export default new DataSource({
    type: "postgres",
    host: "localhost",
    password: process.env.DB_PASSWORD,
    port: 5432,
    username: "postgres",
    database: process.env.DB_NAME,
    entities: [
        path.resolve(__dirname, "..", "entities", "*.entity.{ts,js}")
    ],
    migrations: [],
    logging: false,
    synchronize: true
})