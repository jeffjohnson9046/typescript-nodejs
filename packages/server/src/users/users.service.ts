import User from "./user.model";
import UserRepository from "./users.repository";

class UserService {
    constructor(private repository: UserRepository) {
        this.repository = repository;
    }

    public async findUser(userId: number): Promise<User> {
        return this.repository.findUser(userId);
    }

    public async findAll(): Promise<User[]> {
        return this.repository.findAll();
    }

    public async findAllByName(name: string): Promise<User[]> {
        return this.repository.findAllByName(name);
    }

    public async create(newUser: User): Promise<number> {
        return this.repository.create(newUser);
    }

    public async update(user: User): Promise<User> {
        return this.repository.update(user);
    }

    public async delete(userId: number): Promise<number> {
        return this.repository.delete(userId);
    }
}

export default UserService;
