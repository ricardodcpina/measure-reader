# MeterScanner

MeterScanner is a RESTful API designed to capture and record measurements from images of utility meters, such as water, gas and eletricity. By scanning images of these meters it automatically extracts measurements via Google Gemini LLM API and logs them into a database for accurate tracking and analysis.

---

## Table of Contents

- [Live Demo](#globe_with_meridians-live-demo)
- [Technologies](#computer-technologies)
- [Architecture](#triangular_ruler-architecture)
- [Features](#star2-features)
- [Pre-requisites](#package-pre-requisites)
- [Running](#hammer_and_wrench-running)
- [Testing](#test_tube-testing)
- [Roadmap](#world_map-roadmap)
- [Contributing](#handshake-contributing)
- [License](#memo-license)

---

## :globe_with_meridians: Live Demo

Access the API documentation and test it with SwaggerUI at https://app.swaggerhub.com/apis-docs/RicardoPina/meter-scanner/1.0.0!

---

## :computer: Technologies

![Node](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TS-NODE](https://img.shields.io/badge/tsnode-3178C6.svg?style=for-the-badge&logo=ts-node&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Mongoose](https://img.shields.io/badge/Mongoose-880000.svg?style=for-the-badge&logo=Mongoose&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=MongoDB&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1.svg?style=for-the-badge&logo=Zod&logoColor=white) ![Google Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D.svg?style=for-the-badge&logo=Swagger&logoColor=black)

<details>
<summary>Expand for details</summary>
<br>

**Node** - non blocking I/O, which allows the server to manage multiple simultaneous requests efficiently; Versatility with fullstack Javascript;

**Typescript** - Static typing provides type safety, better productivity with intellisense, compile-time error checking reducing bugs.

**Express.js** - Facilitates route creation, middlewares and HTTP request management; Faster API development.

**TS-Node** - Allows running Typescript files directly without compiling first. Integrates with Node, enabling fast development and static checking.

**Mongoose** - ODM library for MongoDB and Node. Provides schema-based solution to model and interact with data, simplifying database operatios such as queries, validation and data manipulation.

**MongoDB** - NoSQL, document-oriented database that stores data in JSON-like format. Highly scalable, performant and ideal for handling large volumes of unstructured or semi-structured data.

**Zod** - Schema validation that enables you to define and validate data structures with full Typescript type inference. Ensures data integrity and prevent runtime errors through static type checking.

**Google Gemini** - Suite of AI-driven tools and APIs that integrates machine learning capabilities into applications; Enhances the ability to understand, generate and analyze content using advanced language models and algorithms.

**Jest** - Code coverage reports; Watch mode allows continous testing;

**Docker** - Enables developers to package applications and their dependencies into containers, ensuring consistent environments accross different stages of development, testing and production. Makes application managing and distribuition easier.

**Swagger** - Set of tools for designing, documenting and consuming RESTful APIs. It provides an interactive interface for exploring API endpoints and helps automate the process of generating API documentation in a clear and standardized format.

</details>

---

## :triangular_ruler: Architecture

- [Backend](#backend)
- [Infrastructure](#infrastructure)

A service-oriented Model-View-Controller design was preferred aiming segregation of responsibilities, code reusability, maintenance, scalability and easier external API integrations.

### Backend

<details>
<summary>Expand for details</summary>
<br>

Backend layer runs on port 3000 by default and consists of a RestAPI built with Node.js, Typescript and Express.js. Its contents are the database models, controllers, services, utility functions, customized errors, middlewares and some unit tests.

#### APIs

For complete details about the API, access its documentation at https://app.swaggerhub.com/apis-docs/RicardoPina/meter-scanner/1.0.0.

External API's:

- **Gemini API** - Extracts the measurement from the uploaded base64-encoded image of a meter.

#### Models

Mongoose ODM provides a MongoDB database instance and a Measurement Schema.

- Measurement Schema - stores relevant data about a measurement including customer code, value, date, uuid, type, a temporary URL and if it has been confirmed yet. 

Some basic validations are included on Mongoose's schema before registering and entry into the database and also regex patterns for UUID and URL formats.

#### Controllers

Errors found during service execution in controllers are redirected to the global error handling middleware.

Endpoints:

- `POST /upload`
- `PATCH /confirm`
- `GET /{customer_id}/list/?measurement_type={measurement_type}`

#### Routes

One router was created for the measurement controller.

#### Services

- **uploadService** - validates user input and if a measurement was already registered for the provided month, throwing a DOUBLE_REPORT error if so. Calls saveTemporaryImage helper function to create a temporary link for accessing the uploaded base64 image. Then it calls extractMeasurement function and insert it into the database. Returns the temporary link URL, the measurement value and its UUID.

> [!IMPORTANT]  
> You must provide the base64 with headers included. For image conversions to base64, access the following URL - https://base64.guru/converter/encode/image.

- **confirmationService** - validates user input and if the measurement was already confirmed for the provided month, throwing a CONFIRMATION_DUPLICATE error if so. It measurement provided is not found in database, throws a MEASUREMENT_NOT_FOUND error. Otherwise, updates the measurement entry in database and returns a success message.

- **listMeasurementsService** - validates if a measurement type was provided and if its a valid type (water or gas), throwing a INVALID_TYPE error if so. Validates if there are any measurements for the valid type, throwing a MEASUREMENTS_NOT_FOUND error if so. Returns the customer code with a list of filtered measurements or all of them.

#### Middlewares

A global error handling middleware formats the customized errors with error_code and error_description. Otherwise it shows internal server error with 500 status code as default.

#### Errors

List of customized errors:

- 400 - INVALID_DATA
- 400 - INVALID_TYPE
- 404 - MEASUREMENT_NOT_FOUND
- 404 - MEASUREMENTS_NOT_FOUND
- 409 - DOUBLE_REPORT
- 409 - CONFIRMATION_DUPLICATE

#### Utility functions

- **validateBody** - runs whenever user provides a request body and applies Zod schema validation, returning formatted error messages in case of errors. Besides simple validation such as checking for strings, numbers, it also has a base64-encoding validation for provided images.
- **saveTemporaryImage** - saves the uploaded image as a binary in Express static directory, setting time for its expiration.
- **extractMeasurement** - returns the measurement obtained after Gemini processes the image.

#### Tests

Unit tests covers the following services and utility functions:

- confirmationService
- listMeasurementsService
- uploadService
- validateBody

</details>

### Infrastructure

<details>
<summary>Expand for details</summary>
<br>

The docker-compose file in root directory runs two main services:

- MongoDB official database image on port 27017
- Backend service from Dockerfile on port 3000

Environment variables:

- GEMINI_API_KEY - Access to Google Gemini API.
- DATABASE_URL - Database URL connection string.
- API_URL - Backend API URL. Defaults to 'http://localhost'
- API_PORT - Backend API port. Defaults to 3000.

</details>

---

## :star2: Features

Automatic measurement extraction - Google Gemini extracts the correct measurement from the uploaded meter base64 image.

Temporary link for images - provided for a brief period of time to double-check image sent to Google Gemini for measurement extraction.

Validation for measurements - Prevents duplication and re-confirmation for a given type of measurement in the same month.

Measurement confirmation and update - Confirm the measurement is correctly extracted or correct it and save it on database for keeping track.

List measurements by measurement type - Optionally provide a filter to fetch only entries of a given type or all of them.

---

## :package: Pre-requisites

Both Docker and Node.js are required to run the application locally.

### Docker

Download Docker from https://docs.docker.com/desktop/.

> [!IMPORTANT]  
> For Windows users, WSL2 is also required for running docker commands in terminal - https://learn.microsoft.com/pt-br/windows/wsl/install.

### Node

Download Node from https://nodejs.org/en/download/prebuilt-installer.

---

## :hammer_and_wrench: Running

To run the application locally you can either use docker-compose or node.

### With Docker-Compose

1 - Fork project repository

Create a new fork at https://github.com/ricardodcpina/meter-scanner/fork.

2 - Clone repository with CLI

`git clone https://github.com/ricardodcpina/meter-scanner.git`

3 - Access local cloned repository

`cd meter-scanner`

4 - Create a .env file in root directory with the required environment variables

    GEMINI_API_KEY=[api-key-here]
    DATABASE_URL=mongodb://admin:admin@localhost:27017/meter-scanner?authSource=admin
    API_URL=http://localhost
    API_PORT=3000

5 - Run the application

`docker-compose up`

6 - Now you can consume the API via an HTTP client such as Postman, Insomnia or ThunderClient to http://localhost:3000/.

### With Node

1 - Execute steps 1 to 4 from "running with Docker" alternative above

2 - Create database image using docker command

    docker run --name meter-scanner -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin -d mongo

3 - Install dependencies in root directory

`npm install`

4 - Run the application

`npm run dev`

5 - Now you can consume the API via an HTTP client such as Postman, Insomnia or ThunderClient to http://localhost:3000/.

---

## :test_tube: Testing

Test coverage provided by Jest includes main services and validatation helper functions.

1 - Run npm command in root directory

`npm run test`

---

## :world_map: Roadmap

No further improvements mapped for this project.

---

## :handshake: Contributing

1 - Fork project repository

Create a new fork at https://github.com/ricardodcpina/which-way-now/fork.

2 - Clone repository with CLI

`git clone https://github.com/ricardodcpina/which-way-now.git`

3 - Create a new branch

`git checkout -b [branch-name]`

4 - Make changes and commit

`git commit -m "changes description"`

5 - Push changes to remote repository

`git push origin [branch-name]`

6 - Open PR

Open a pull request for main branch at https://github.com/ricardodcpina/which-way-now/compare.

7 - Report bugs

Create an issue to report a bug at https://github.com/ricardodcpina/which-way-now/issues.

---

## :memo: License

Under construction 🔧 🏗️🏗️🏗️ ⚙️
