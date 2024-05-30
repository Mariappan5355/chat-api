# Node.js Express TypeScript Project

This is a simple Node.js project using Express and TypeScript. It includes basic CRUD operations for a User entity, demonstrates the use of environment variables, and connects to a MySQL database using Knex.js.

## Prerequisites

- Node.js (>=14.x)
- npm (>=6.x)
- MySQL server

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Mariappan5355/node-practice.git
    cd nodejs-express-ts
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables:

    Create a `.env` file in the root of the project and add the following:

    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    ```

4. Run the database migrations (if using Knex):

    ```bash
    npx knex migrate:latest
    ```

## Usage

1. Start the development server:

    ```bash
    npm run dev
    ```

    This will start the server using `ts-node-dev` for hot-reloading during development.

## Project Structure

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.