# Overview
This project is for learning NodeJS, Express, React and all that entails.  This is very much a living project that I will continue to tinker with as I learn new things.

# Pre-Requisites

* NodeJS
* Postgres

Both of the pre-requisites cited above can be installed via [homebrew](https://brew.sh/), but I've found that since I need to manage multiple versions of NodJS, I use [nvm](https://github.com/nvm-sh/nvm) to install/manage Node.

# Setup

## Database
This application relies on a Postgres database for storing/fetching data.  The steps below are what I would take to set up a production-like Postgres database.  To that end, it may seem like there are quite a few extra steps (i.e. there's more to it than just standing up a database and letting our sysadmin-level user account talk to it).  A Postgres DBA may have additional insight or recommendations on the steps to take.  However, I have found the steps below to be a pretty good start for what a production Postgres database might look like.

For this test application, all our database objects will end up in the `node_psql` schema.  Our application does not need access to the `public` schema.

To set up the database, take the following steps:

1. Connect to your postgres instance `psql postgres`
2. Create a user account that will serve as the database owner:
```sql
CREATE USER node_test WITH CREATEROLE ENCRYPTED PASSWORD '[choose a password]';
```
3. Create the database, setting the owner to be the account created in the previous step
```sql
CREATE DATABASE node_psql OWNER node_test;
```
4. Switch your connection to the `node_psql` database: `\c node_psql`
5. Revoke access to the `public` schema:
```sql
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE node_psql FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
```
6. Close the connection; all other operations can be conducted as the `node_test` database owner
7. Change your connection to use the `node_test` user and connect to the `node_psql` database: `psql -U node_test -d node_psql`
8. Create a `node_app` group - this group will provide the read/write privileges for any application-level user that our application might need:
```sql
CREATE ROLE node_app NOINHERIT;
GRANT CONNECT ON DATABASE node_psql TO node_app;
GRANT USAGE ON SCHEMA node_psql TO node_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA node_psql TO node_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA node_psql TO node_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA node_psql GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO node_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA node_psql GRANT USAGE ON SEQUENCES TO node_app;
```
9. Create an application user and assign it to the `node_app` group - this is the user account our application will use to connect to the database
```sql
CREATE USER node_app_user WITH ENCRYPTED PASSWORD '[choose a password]' IN ROLE node_app;
ALTER USER node_app_user SET SEARCH_PATH TO node_psql;
```
10.  Create the `people` table:
```sql
CREATE TABLE people(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

# Configuration
After creating the database, update the `database.ts` file to use the `app_user` password you chose while setting up the database.
