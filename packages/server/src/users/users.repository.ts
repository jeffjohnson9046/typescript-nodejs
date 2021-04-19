/* eslint-disable class-methods-use-this */
import { QueryResult } from "node-postgres";
import User from "./user.model";
import db from "../db/database";
import QueryBuilder from "../db/queryBuilder";

/**
 * An interface to describe the result of a query that just returns an id.  Typically, this will be used when creating
 * a new user.
 */
interface UserIdResult {
    /**
     * The id of the user that was created.
     */
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
        const result: QueryResult = await new QueryBuilder()
            .withSql(db.getSql("users.findById"), userId)
            .execute();

        return result.rows[0] as User;
    }

    /**
     * Get all {@link User}s
     *
     * @returns {User[]} all {@link User}s from the database.
     */
    public async findAll(): Promise<User[]> {
        const result: QueryResult = await new QueryBuilder()
            .withSql(db.getSql("users.findAll"))
            .execute();

        return result.rows.map((row) => row as User);
    }

    /**
     * Find all {@link User}s whose first name or last name contains the search string passed in.
     *
     * @param name {string} The search string
     * @returns All {@link User}s whose first name or last name contains the search string.
     */
    public async findAllByName(name: string): Promise<User[]> {
        const result: QueryResult = await new QueryBuilder()
            .withSql(db.getSql("users.findUsersByName"), `%${name}%`)
            .execute();

        return result.rows.map((row) => row as User);
    }

    /**
     * Create a new {@link User}
     *
     * @param newUser The {@link User} to create
     * @returns {number} The id of the newly-created {@link User}
     */
    public async create(newUser: User): Promise<number> {
        const result: QueryResult = await new QueryBuilder()
            .useTransaction()
            .withSql(
                db.getSql("users.create"),
                newUser.firstName,
                newUser.lastName,
                newUser.age,
            )
            .execute();

        return (result.rows[0] as UserIdResult).id;
    }

    /**
     * Update a {@link User} with new values.
     *
     * @param user {User} The {@link User} to update
     * @returns the updated {@link User} record
     */
    public async update(user: User): Promise<User> {
        const result: QueryResult = await new QueryBuilder()
            .useTransaction()
            .withSql(
                db.getSql("users.update"),
                user.firstName,
                user.lastName,
                user.age,
                user.id,
            )
            .execute();

        return result.rows[0] as User;
    }

    /**
     * Delete a {@link User} from the database.
     *
     * @param userId {number} The identifier of the {@link User} to delete
     * @returns The identifier of the deleted user
     */
    public async delete(userId: number): Promise<number> {
        await new QueryBuilder()
            .withSql(db.getSql("users.delete"), userId)
            .execute();

        return userId;
    }
}

export default UserRepository;
