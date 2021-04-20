import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import router from "./src/router";

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

export default app;
