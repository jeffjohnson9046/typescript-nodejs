import glob from "glob";
import fs from "fs";
import path from "path";
import yaml from "yaml";

/**
 * Describe the structure of the SQL YAML file that contains the the SQL templates for a module.
 * <p>
 * The SQLs for the various components are stored in YAML files as templates.  The placeholders are replaced with actual
 * parameters when they are executed.  This provides several advantages:
 * <ol>
 *   <li>The SQL is easy to read and troubleshoot; they can be copied and pasted into an editor</li>
 *   <li>The SQL is treated as a parameterized query in code, minimizing the possibility for SQL injection</li>
 * </ol>
 * </p>
 * Shown here is an example of what a typical SQL YAML file will look like:
 * <pre>
 * sql:
 *   users:
 *     findById: >-
 *       SELECT
 *         id,
 *         first_name AS firstName,
 *         last_name AS lastName,
 *         age
 *       FROM
 *         people
 *       WHERE
 *         id = $1
 * </pre>
 * </p>
 * <p>
 * After the file has been parsed, it will be parsed into JSON, the result will look like this:
 * <pre>
 *   sql: {
 *     users: {
 *       findById: 'SELECT\n' +
 *       '  id,\n' +
 *       '  first_name AS firstName,\n' +
 *       '  last_name AS lastName,\n' +
 *       '  age\n' +
 *       'FROM\n' +
 *       '  people\n' +
 *       'WHERE\n' +
 *       '  id = $1',
 *     }
 *  }
 * </pre>
 * </p>
 */
interface SqlTemplateFile {
    /**
     * The root property of the SQL YAML document
     */
    sql: {
        /**
         * The name of the "module"/feature for the SQL templates (e.g. "users"), a key that represents the name of
         * the SQL template (e.g. "findAllById") and the SQL template itself (e.g. "SELECT id, foo FROM my_table")
         */
        [module: string]: { [key: string]: string };
    };
}

/**
 * Interact with the Postgres database.
 * <p>
 * This class provides helper/convenience methods for interacting with a Postgres database.
 * </p>
 */
class Database {
    /**
     * A collection of all the SQL templates for the application.
     */
    private readonly sqlMap: Map<string, string> = new Map<string, string>();

    /**
     * Initialize the database.
     * @param dir The root directory of the application
     */
    constructor(dir: string) {
        this.init(dir);
    }

    /**
     * Load all the .sql.yml files into a {@link Map} so they can be accessed by other areas of the application.
     *
     * @param dir The root directory of the application.
     */
    private init = (dir: string): void => {
        const sqlFileNames: string[] = glob.sync(`${dir}/**/*.sql.yml`);

        sqlFileNames.forEach((sqlFileName) => {
            const sqlFile: string = fs.readFileSync(sqlFileName, "utf8");
            const sqlYaml: SqlTemplateFile = yaml.parse(
                sqlFile,
            ) as SqlTemplateFile;

            const sqlModuleName: string = path.basename(
                sqlFileName,
                ".sql.yml",
            );

            Object.keys(sqlYaml.sql[sqlModuleName]).forEach((key: string) => {
                this.sqlMap.set(
                    `${sqlModuleName}.${key}`,
                    sqlYaml.sql[sqlModuleName][key],
                );
            });
        });
    };

    /**
     * Get an SQL template for the specified key.
     * @param sqlKey {string} The name of the SQL template to fetch
     * @returns {string} The SQL template for the specified key
     */
    getSql = (sqlKey: string): string => {
        const sql = this.sqlMap.get(sqlKey);
        if (!sql) {
            throw new Error(`Could not find SQL for ${sqlKey}`);
        }

        return sql;
    };
}

const db = new Database(path.dirname(require.main?.filename || ""));

export default db;
