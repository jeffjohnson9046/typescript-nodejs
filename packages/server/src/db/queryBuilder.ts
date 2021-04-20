import { QueryResult, Pool, PoolClient } from "pg";

/**
 * Enumerate transaction commands.
 */
enum TransactionSql {
    Begin = "BEGIN",
    Commit = "COMMIT",
    Rollback = "ROLLBACK",
}

/**
 * A builder/facade to make executing queries against the database easier.
 * <p>
 *     This builder currently supports executing a single query against the database.  Optionally, that query can be
 *     wrapped in a transaction.
 * /p>
 */
class QueryBuilder {
    /**
     * @private
     * The SQL template to execute against the database.  This template should be like a "prepared statement" that is
     * ready to substitute parameters in placeholder locations.
     */
    private sqlTemplate = "";

    /**
     * @private
     * An array of parameters that will be substituted into the SQL template's placeholders.
     */
    private sqlParams: unknown[] = [];

    /**
     * @private
     * Indicate if the query should be executed within a transaction.
     */
    private hasTransaction = false;

    /**
     * @private
     * The connection pool for the Postgres database.
     */
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: "node_app_user",
            password: "[redacted]",
            host: "localhost",
            database: "node_psql",
            port: 5432,
        });
    }

    /**
     * Set the SQL template and parameters.
     * @param sql {string} The SQL template to execute.
     * @param params {unknown[]} The array of parameters to use for the query.
     */
    withSql(sql: string, ...params: unknown[]): QueryBuilder {
        this.sqlTemplate = sql;
        this.sqlParams = params;

        return this;
    }

    /**
     * Indicate the query should be wrapped in a transaction.
     */
    useTransaction(): QueryBuilder {
        if (this.hasTransaction) {
            return this;
        }

        this.hasTransaction = true;

        return this;
    }

    /**
     * Execute the query.
     * <p>
     *     If the {@link useTransaction} flag has been set, then wrap the query in a transaction.  If the query executes
     *     successfully, commit the transaction.  Otherwise, call rollback and throw the exception.  Regardless of
     *     success or failure, the client will be released and the {@link QueryBuilder} will be reset for the next
     *     query.
     * </p>
     * @returns {Promise<QueryResult>} A promise containing the results of the query.
     * @throws {Error} The error that was encountered while executing the query.
     */
    async execute(): Promise<QueryResult> {
        const client: PoolClient = await this.pool.connect();
        try {
            if (this.hasTransaction) {
                await client.query(TransactionSql.Begin);
            }

            const result = await client.query(this.sqlTemplate, this.sqlParams);

            if (this.hasTransaction) {
                await client.query(TransactionSql.Commit);
            }

            return result;
        } catch (e) {
            await client.query(TransactionSql.Rollback);
            throw e;
        } finally {
            this.reset(client);
        }
    }

    /**
     * @private
     * Reset the {@link QueryBuilder}.
     * @param client The {@link PoolClient} to release.
     */
    private reset(client: PoolClient): void {
        client.release();
        this.sqlTemplate = "";
        this.sqlParams = [];
        this.hasTransaction = false;
    }
}

export default QueryBuilder;
