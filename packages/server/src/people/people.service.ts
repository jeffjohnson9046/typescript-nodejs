import Person from "./people.model";
import PeopleRepository from "./people.repository";

class PeopleService {
    constructor(private repository: PeopleRepository) {
        this.repository = repository;
    }

    public async findPerson(personId: number): Promise<Person> {
        return this.repository.findPerson(personId);
    }

    public async findAll(): Promise<Person[]> {
        return this.repository.findAll();
    }

    public async findAllByName(name: string): Promise<Person[]> {
        return this.repository.findAllByName(name);
    }

    public async create(newPerson: Person): Promise<number> {
        return this.repository.create(newPerson);
    }

    public async update(person: Person): Promise<Person> {
        return this.repository.update(person);
    }

    public async delete(personId: number): Promise<number> {
        return this.repository.delete(personId);
    }
}

export default PeopleService;
