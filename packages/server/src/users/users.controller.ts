import { Request, Response, NextFunction } from "express";
import User from "./user.model";
import UserRepository from "./users.repository";
import UserService from "./users.service";

class UsersController {
    private service: UserService;

    constructor() {
        this.service = new UserService(new UserRepository());
    }

    findAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<User[]>> => {
        try {
            const users: User[] = await this.service.findAll();

            return res.status(200).json(users);
        } catch (e) {
            next(e);
            return res.sendStatus(500);
        }
    };

    findAllByName = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<User[]>> => {
        try {
            const nameSearch: string = req.params.name;
            const users: User[] = await this.service.findAllByName(nameSearch);

            return res.status(200).json(users);
        } catch (e) {
            next(e);
            return res.sendStatus(500);
        }
    };

    findUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<User>> => {
        try {
            const userId = parseInt(req.params.userId, 10);
            const user: User = await this.service.findUser(userId);

            return user
                ? res.status(200).json(user)
                : res.status(404).json({
                      message: `could not find user for id ${userId}`,
                  });
        } catch (e) {
            next(e);
            return res.sendStatus(500);
        }
    };

    create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<number>> => {
        try {
            const newUser: User = req.body as User;
            const newUserId = await this.service.create(newUser);

            return res.status(201).json(newUserId);
        } catch (e) {
            next(e);
            return res.sendStatus(500);
        }
    };

    update = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<User>> => {
        try {
            const user: User = req.body as User;
            const updatedUser: User = await this.service.update(user);

            return res.status(201).json(updatedUser);
        } catch (e) {
            next(e);
            return res.sendStatus(500);
        }
    };

    delete = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<void>> => {
        try {
            const userId = parseInt(req.params.userId, 10);
            await this.service.delete(userId);

            return res.sendStatus(204);
        } catch (e) {
            next(e);
            return res.sendStatus(500);
        }
    };
}

export default UsersController;
