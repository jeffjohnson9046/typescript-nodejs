import express, { Request, Response, NextFunction } from "express";
import UsersController from "./users.controller";

const controller = new UsersController();
const router = express.Router();

router.param("userId", (req: Request, res: Response, next: NextFunction) => {
    next();
});

router.route("/").get(controller.findAll).post(controller.create);

router
    .route("/:userId")
    .get(controller.findUser)
    .put(controller.update)
    .delete(controller.delete);

export default router;
