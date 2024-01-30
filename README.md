# Todo-App with Remix.js, Prisma ORM, and PostgreSQL

## Overview

This is a full-stack Todo application built using Remix.js for the frontend, Prisma ORM for database interactions, and PostgreSQL as the database. The app allows users to register, log in, create todos, categories, and subtodos. It also supports pagination and filtering of todos by category and status. Additionally, the app implements optimistic UI for a seamless user experience.

## Features

- User authentication (register and login)
- Create, Read, Update, and Delete (CRUD) operations for todos, categories, and subtodos
- Pagination for todos
- Filter todos by category and status
- Toggle status of todo and subtodo (on_hold, completed, in progress)
- Optimistic UI for a smoother user experience

## Tech Stack

- [Remix.js](https://remix.run/) - Web framework for building modern web applications
- [Prisma ORM](https://www.prisma.io/) - Database toolkit for TypeScript and Node.js
- [PostgreSQL](https://www.postgresql.org/) - Open-source relational database

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL database set up

### Installation

1. Clone the repository:

```bash
git clone https://github.com/rushibelkunde/remix-todo-app.git
cd remix-todo-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root of the project and add the following variables:

```dotenv
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
SESSION_SECRET="your_session_secret"
```

Make sure to replace the placeholder values with your actual database connection details and a secure session secret.

4. Run the migrations:

```bash
npx prisma migrate dev
```

5. Start the application:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to access the application.

## Usage

- Register a new user or log in with existing credentials.
- Create, update, and delete todos, categories, and subtodos.
- Toggle the status of todos and subtodos.
- Use pagination and filters to organize and view your todos efficiently.

## Contributing

Feel free to contribute to the development of this Todo app. Follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request
