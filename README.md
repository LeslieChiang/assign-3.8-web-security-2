# Web Security 2: Assignment

## Brief

In this assignment, you are challenged to create an end to end node.js application with the following API Endpoints:


|#|Path|Description|
|-|----|-----------|
|1|POST /register | Takes in `email` and `pwd`, hash the value for password and store them in database.|
|2|POST /login | Takes in `email` and `pwd`, verify the hash and returns whether login success or fail. It should produce a JWT that encodes `id` and `email` in a json object and return it in HTTP Response|

The priority of this assignment is to practice hashing and JWT, hence let's split this assignment into two parts.

### Part 1 - Create endpoint with Express and store email and pwd in an array.

We do not wish for you to spend to much time setting up the database and unable to practice hashing and JWT. Therefore, as a start, please store `email` and `pwd` as object in array.

For the JWT signing, simply use algorithm without private keys.

### Part 2 - Create ORM Layer and Database

Once you have produced the two endpoints by storing them in array, you may go ahead to create the ORM layer. You are recommended to use [sqlite::memory](https://sequelize.org/master/manual/getting-started.html).

```
npm install sequelize sqlite3
```

```js
const sequelize = new Sequelize('sqlite::memory:');
```

This way, the ORM model do not have dependency on any database. It will store data in memory. This will become compatible with the next lesson when we perform serverless deployment on free tier.

## Submission Guidelines

- Cite any relevant sources consulted during your research
- Solve the problems using your own code
- Do not copy and paste solutions from the source material
- Submit your assignment to black board.