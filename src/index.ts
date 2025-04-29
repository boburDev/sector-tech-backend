import bot from "./bot";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import session from "express-session";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import AppDataSource from "./config/ormconfig";
import adminRouter from "./routers/admin";
import userRouter from "./routers/user";
import mobileRouter from "./routers/mobile";
import insertData from "./services";
import errorMiddleware from "./middlewares/errorMiddleware";
import { setupSwagger } from "./config/swagger";
import registerSocketHandlers from "./controllers/sockets";

import "./common/strategy/google.strategy";
import "./common/strategy/facebook.strategy";
import "./common/strategy/linkiden.strategy";
import "./common/strategy/yandex.strategy";

import passport from "passport";
import { PORT } from "./config/env";

dotenv.config(); 


AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Database connection error:", error));

const app = express();
 
app.use(cors({
  origin: '*'
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static(path.join("public")));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);
  registerSocketHandlers(socket, io);
});

app.get('/', async (req: any, res: any, next: any) => {
  try {
    await insertData(req.query);
    res.send('ok')
  } catch (error) {
    next(error)
  }
})

app.use("/", adminRouter);
app.use("/user", userRouter);
app.use("/mobile", mobileRouter);
app.use(errorMiddleware);

setupSwagger(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`User Swagger docs at http://localhost:${PORT}/api-docs`);
  console.log(`Admin Swagger docs at http://localhost:${PORT}/admin-docs`);
  console.log(`Mobile Swagger docs at http://localhost:${PORT}/mobile-docs`);
    
  try {
    bot.launch();
    console.log("Bot ishga tushdi!");
  } catch (error) {
    console.error("❌ Botni ishga tushirishda xatolik:", error);
  }
});
