import { Request, Response, NextFunction } from "express";
import Person from "./people.model";
import PeopleRepository from "./people.repository";
import PeopleService from "./people.service";

class PeopleController {
    private service: PeopleService;

    constructor() {
        this.service = new PeopleService(new PeopleRepository());
    }

    findAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<Person[]>> => {
        try {
            const people: Person[] = await this.service.findAll();

            return res.status(200).json(people);
        } catch (e) {
            next(e);
            return res.sendStatus(500);
        }
    };

    findAllByName = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<Person[]>> => {
        try {
            const nameSearch: string = req.params.name;
            const people: Person[] = await this.service.findAllByName(
                nameSearch,
            );

            return res.status(200).json(people);
        } catch (e) {
            next(e);
            return res.sendStatus(500);
        }
    };

    findPerson = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response<Person>> => {
        try {
            const personId = parseInt(req.params.personId, 10);
            const person: Person = await this.service.findPerson(personId);

            return person
                ? res.status(200).json(person)
                : res.status(404).json({
                      message: `could not find person for id ${personId}`,
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
            const newUser: Person = req.body as Person;
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
    ): Promise<Response<Person>> => {
        try {
            const person: Person = req.body as Person;
            const updatedPerson: Person = await this.service.update(person);

            return res.status(201).json(updatedPerson);
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
            const personId = parseInt(req.params.personId, 10);
            await this.service.delete(personId);

            return res.sendStatus(204);
        } catch (e) {
            next(e);
            return res.sendStatus(500);
        }
    };
}

export default PeopleController;
