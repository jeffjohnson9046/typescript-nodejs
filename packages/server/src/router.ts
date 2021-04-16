import express, { Request, Response } from "express";
import mountMolduleRouters from "./utils/mount-module-routers";

const router = express.Router();
router.get("/health-check", (req: Request, res: Response) => {
    res.status(200).send("OK");
});

mountMolduleRouters(router, __dirname);

export default router;
