# Northcoders News API
## Getting Started
### Dependencies Needed
Ensure you have the following installed:

* Node
* PostgreSQL
* Express
* Supertest
* Jest

#### You can install all dependencies by typing in your terminal:
    npm install

In order to access the databases, create the files:

* #### .env.* (for your test database)

* #### .env.* (for your development database)

#### Inside your test .env file add the line:
    PGDATABASE=test_database_name

Change the name to your database name for testing (a smaller database)

#### Inside your development .env file add the line:
    PGDATABASE=development_database_name

Change the name to your development database (a larger database)

### Set up the database
    npm run setup-dbs

### Run the seed
    npm run seed

### Run tests
    npm test

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
