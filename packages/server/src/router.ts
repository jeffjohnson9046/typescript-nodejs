import express, { Request, Response } from "express";
import mountMolduleRouters from "./utils/mount-module-routers";

const router = express.Router();
router.get("/health-check", (req: Request, res: Response) => {
    res.send("OK").status(200);
});

mountMolduleRouters(router, __dirname);

export default router;
