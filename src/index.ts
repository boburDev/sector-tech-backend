import express, { Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import AppDataSource from "./config/ormconfig";
import adminRouter from './routers/admin/index';
import userRouter from './routers/user/index';
import cors from 'cors';
import 'dotenv/config';
import { setupSwagger } from './config/swagger';

dotenv.config();

const PORT = Number(process.env.PORT);
console.log(PORT);


AppDataSource.initialize().then(() => { }).catch((error) => console.log(error));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join('public')));


app.get('/', (_, res: Response) => { res.send('ok'); });
app.use('/', adminRouter);
app.use('/user', userRouter);

setupSwagger(app); // Initialize Swagger

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
