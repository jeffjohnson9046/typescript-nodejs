import express from "express";
import UsersController from "./users.controller";

const controller = new UsersController();
const router = express.Router();

router.route("/").get(controller.findAll).post(controller.create);

router
    .route("/:userId")
    .get(controller.findUser)
    .put(controller.update)
    .delete(controller.delete);

export default router;
