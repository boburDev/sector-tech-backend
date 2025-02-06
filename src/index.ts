import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import path from 'path';
import AppDataSource from "./config/ormconfig";
import router from './routers';
import cors from 'cors';
import 'dotenv/config';
import swaggerJsDocs from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config()


const PORT = process.env.PORT || 4000

AppDataSource.initialize().then(() => { }).catch((error) => console.log(error))
const app = express()
app.use(cors())
app.use(express.json())

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes*.js'], // files containing annotations as above
};

app.use(express.static(path.join('public')));

app.get('/', (req: Request, res: Response) => { res.send('ok') })
app.use('/', router);



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});