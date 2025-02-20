import express from "express";
import dotenv from "dotenv";
import path from "path";
import AppDataSource from "./config/ormconfig";
import adminRouter from "./routers/admin/index";
import userRouter from "./routers/user/index";
import cors from "cors";
import "dotenv/config";
import "./common/strategy/google.strategy";
import "./common/strategy/facebook.strategy";
import "./common/strategy/linkiden.strategy";
import "./common/strategy/yandex.strategy";
import { setupSwagger } from "./config/swagger";
import session from "express-session";
import passport from "passport";

dotenv.config();

const PORT = Number(process.env.PORT) || 3030;

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Database connection error:", error));

const app = express();

app.use(cors());
app.use(express.json());
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

app.use("/", adminRouter);
app.use("/", userRouter);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`User Swagger docs at http://localhost:${PORT}/api-docs`);
  console.log(`Admin Swagger docs at http://localhost:${PORT}/admin-docs`);
});
