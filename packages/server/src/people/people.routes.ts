import express from "express";
import PeopleController from "./people.controller";

const controller = new PeopleController();
const router = express.Router();

router.route("/").get(controller.findAll).post(controller.create);

router
    .route("/:personId")
    .get(controller.findPerson)
    .put(controller.update)
    .delete(controller.delete);

export default router;
