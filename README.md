# Northcoders News API
## Hosted version of this API:
    [Janilee's NC News Project](https://janilees-northcoders-project.onrender.com/api/)

---

## API Description:
This project is a back-end project created by Janilee Svaerdstaal at the Northcoders Full-Stack Development Bootcamp in 2024/2025. It is an example API showcasing a news page, including articles, topics, registered users and comments that you can GET, PATCH, POST and DELETE.

---
## Getting Started
To use this project as your own please fork this repo at [GitHub project](https://github.com/PiX3L-NoMAD/my_nc_news)
Once forked, copy the link from your forked repo and in your computer's terminal input:
    git clone <link-to-your-repo>
    cd <repo-folder>
    code .

### Dependencies Needed
Ensure you have the following installed:

* Node
* PostgreSQL
* PF-Format
* Express
* DotEnv

#### You can install all dependencies by typing in your terminal:
    npm install

In order to access the databases, create the files:

* #### .env.* (for your test database)

* #### .env.* (for your development database)

Ensure you add these .env. files to your .gitignore file for security reasons.

#### Inside your test .env file add the line:
    PGDATABASE=test_database_name

Change the name to your database name for testing (a smaller database)

#### Inside your development .env file add the line:
    PGDATABASE=development_database_name

Change the name to your development database (a larger test database)

### Set up the database
    npm run setup-dbs

### Run the seed
    npm run seed

### Start the server
    npm start

## Test Instructions
You will also need to ensure you install some devDependencies for testing purposes:

## Dev Dependencies Needed
    * Jest
    * Jest-extended
    * Jest-sorted
    * Supertest

To check which dependencies are installed, in your terminal input:
    npm list

The end of your package.json file should look like this:

    "dependencies": {
        "dotenv": "^16.0.0",
        "express": "^4.21.1",
        "pg": "^8.13.1",
        "pg-format": "^1.0.4"
    },
    "devDependencies": {
        "husky": "^8.0.2",
        "jest": "^27.5.1",
        "jest-extended": "^2.0.0",
        "jest-sorted": "^1.0.15",
        "supertest": "^7.0.0"
    },
    "jest": {
        "setupFilesAfterEnv": [
        "jest-extended/all",
        "jest-sorted"
        ]
    }

Ensure the jest-sorted is added at the very end of "setupFilesAfterEnv", for testing to work smoothly.

### Run tests
Now that tests are set up run this command in your terminal to start testing:
    npm test

--- 

## Hosting
If you want to host this API project you must add .env.production to your project, copy the link to your IaaS, PaaS or SaaS and add it to this project by:

#### Inside your production .env file, add the line:
    PGDATABASE=<link-to-your-web-service>

Don't forget to add this .env. file to your .gitignore for safety reasons.

#### Run the production seed
In the terminal put:
    npm run seed-prod

####
Start the server:
    npm start

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
