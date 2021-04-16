import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import router from "./src/router";

const PORT = process.env.PORT || 3000;

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}`);
});
