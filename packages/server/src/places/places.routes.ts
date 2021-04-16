import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.param("placeId", (req: Request, res: Response, next: NextFunction) => {
    next();
});

router
    .route("/:placeId")
    .get((req: Request, res: Response, next: NextFunction) => {
        const id = req.params.placeId;
        res.send(`response from /places GET, id = ${id}`);
    })
    .post((req: Request, res: Response, next: NextFunction) => {
        res.send("response from /places POST");
    })
    .delete((req: Request, res: Response, next: NextFunction) => {
        res.send("response from /places DELETE");
    });

export default router;
