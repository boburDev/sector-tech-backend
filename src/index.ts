import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import path from 'path';
import AppDataSource from "./config/ormconfig";
import router from './routers';
import cors from 'cors';
import 'dotenv/config';

dotenv.config()


const PORT = process.env.PORT || 4001

AppDataSource.initialize().then(() => { }).catch((error) => console.log(error))
const app = express()
app.use(express.json())
app.use(cors())

app.use(express.static(path.join('public')));

app.get('/', (_, res: Response) => { res.send('ok') })
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});