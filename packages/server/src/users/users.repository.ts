/* eslint-disable class-methods-use-this */
import { QueryResult } from "node-postgres";
import User from "./user.model";
import db from "../db/database";

interface UserIdResult {
    id: number;
}

/**
 * A repository responsible for interacting with user data.
 */
class UserRepository {
    /**
     * Fetch a single {@link User} for the specified id.
     *
     * @param userId {number} The id of the user to fetch
     * @returns {User} A {@link User}
     */
    public async findUser(userId: number): Promise<User> {
        const result: QueryResult = await db.query(
            db.getSql("users.findById"),
            [userId],
        );
        return result.rows[0] as User;
    }

    /**
     * Get all {@link User}s
     *
     * @returns {User[]} all {@link User}s from the database.
     */
    public async findAll(): Promise<User[]> {
        const result: QueryResult = await db.query(db.getSql("users.findAll"));
        return result.rows.map((row) => row as User);
    }

    /**
     * Find all {@link User}s whose first name or last name contains the search string passed in.
     *
     * @param name {string} The search string
     * @returns All {@link User}s whose first name or last name contains the search string.
     */
    public async findAllByName(name: string): Promise<User[]> {
        const result: QueryResult = await db.query(
            db.getSql("users.findUsersByName"),
            [`%${name}%`],
        );
        return result.rows.map((row) => row as User);
    }

    /**
     * Create a new {@link User}
     *
     * @param newUser The {@link User} to create
     * @returns {number} The id of the newly-created {@link User}
     */
    public async create(newUser: User): Promise<number> {
        const result: QueryResult = await db.query(db.getSql("users.create"), [
            newUser.firstName,
            newUser.lastName,
            newUser.age,
        ]);
        return (result.rows[0] as UserIdResult).id;
    }

    /**
     * Update a {@link User} with new values.
     *
     * @param user {User} The {@link User} to update
     * @returns the updated {@link User} record
     */
    public async update(user: User): Promise<User> {
        const result: QueryResult = await db.query(db.getSql("users.update"), [
            user.firstName,
            user.lastName,
            user.age,
            user.id,
        ]);
        return result.rows[0] as User;
    }

    /**
     * Delete a {@link User} from the database.
     *
     * @param userId {number} The identifier of the {@link User} to delete
     * @returns The identifier of the deleted user
     */
    public async delete(userId: number): Promise<number> {
        await db.query(db.getSql("users.delete"), [userId]);
        return userId;
    }
}

export default UserRepository;
