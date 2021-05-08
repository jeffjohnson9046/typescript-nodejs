/* eslint-disable class-methods-use-this */
import { QueryResult } from "node-postgres";
import Person from "./people.model";
import db from "../db/database";
import QueryBuilder from "../db/queryBuilder";

/**
 * An interface to describe the result of a query that just returns an id.  Typically, this will be used when creating
 * a new user.
 */
interface PersonIdResult {
    /**
     * The id of the user that was created.
     */
    id: number;
}

/**
 * A repository responsible for interacting with user data.
 */
class PeopleRepository {
    /**
     * Fetch a single {@link Person} for the specified id.
     *
     * @param personId {number} The id of the user to fetch
     * @returns {Person} A {@link Person}
     */
    public async findPerson(personId: number): Promise<Person> {
        const result: QueryResult = await new QueryBuilder()
            .withSql(db.getSql("people.findById"), personId)
            .execute();

        return result.rows[0] as Person;
    }

    /**
     * Get all {@link Person}s
     *
     * @returns {Person[]} all {@link Person}s from the database.
     */
    public async findAll(): Promise<Person[]> {
        const result: QueryResult = await new QueryBuilder()
            .withSql(db.getSql("people.findAll"))
            .execute();

        return result.rows.map((row) => row as Person);
    }

    /**
     * Find all {@link Person}s whose first name or last name contains the search string passed in.
     *
     * @param name {string} The search string
     * @returns {Person[]} All {@link Person}s whose first name or last name contains the search string.
     */
    public async findAllByName(name: string): Promise<Person[]> {
        const result: QueryResult = await new QueryBuilder()
            .withSql(db.getSql("people.findAllByName"), `%${name}%`)
            .execute();

        return result.rows.map((row) => row as Person);
    }

    /**
     * Create a new {@link Person}
     *
     * @param newPerson The {@link Person} to create
     * @returns {number} The id of the newly-created {@link Person}
     */
    public async create(newPerson: Person): Promise<number> {
        const result: QueryResult = await new QueryBuilder()
            .useTransaction()
            .withSql(
                db.getSql("people.create"),
                newPerson.firstName,
                newPerson.lastName,
                newPerson.age,
            )
            .execute();

        return (result.rows[0] as PersonIdResult).id;
    }

    /**
     * Update a {@link Person} with new values.
     *
     * @param person {Person} The {@link Person} to update
     * @returns {Person} the updated {@link Person} record
     */
    public async update(person: Person): Promise<Person> {
        const result: QueryResult = await new QueryBuilder()
            .useTransaction()
            .withSql(
                db.getSql("people.update"),
                person.id,
                person.firstName,
                person.lastName,
                person.age,
            )
            .execute();

        return result.rows[0] as Person;
    }

    /**
     * Delete a {@link Person} from the database.
     *
     * @param personId {number} The identifier of the {@link Person} to delete
     * @returns {number} The identifier of the deleted user
     */
    public async delete(personId: number): Promise<number> {
        await new QueryBuilder()
            .withSql(db.getSql("people.delete"), personId)
            .execute();

        return personId;
    }
}

export default PeopleRepository;
