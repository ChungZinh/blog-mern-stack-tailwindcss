markdown

# Blog MERN Stack with TailwindCSS

This repository contains a blog application built using the MERN stack (MongoDB, Express, React, Node.js) and styled with TailwindCSS.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Yarn](https://classic.yarnpkg.com/lang/en/)

### Steps

1. **Clone the repository**

```bash
    git clone https://github.com/ChungZinh/blog-mern-stack-tailwindcss.git
    cd blog-mern-stack-tailwindcss

Install dependencies for the server

```bash

    cd server
    yarn install

Install dependencies for the client

```bash

    cd client
    yarn install

Set up environment variables

Create a .env file in the server directory and add the following variables:

makefile

MONGOURI=your_mongodb_uri
PORT=your_port

    Run the server

```bash

cd server
yarn start

    Run the client

bash

cd client
yarn start

Usage

Open your browser and navigate to http://localhost:3000 to see the application in action.
Features

   User authentication (sign up, login, logout)
   Create, read, update, delete (CRUD) blog posts
   Responsive design using TailwindCSS
   Admin dashboard for managing posts, comments, and users

Folder Structure

Here is an overview of the folder structure of this project:

csharp

blog-mern-stack-tailwindcss
│
├── client
│   ├── public
│   └── src
│       ├── assets
│       ├── api
│       ├── components
│       ├── pages
│       ├── constants
│       ├── redux
│       ├── utils
│       ├── App.js
│       └── index.js
│
├── server
│   ├── src
│   │   ├── auth
│   │   ├── controllers
│   │   ├── core
│   │   ├── db
│   │   │   └── init.mongod...
│   │   ├── helpers
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── app.js
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── yarn.lock
│
├── .gitignore
├── README.md
└── vercel.json

Contributing

Contributions are welcome! Please open an issue or submit a pull request.
License

This project is licensed under the MIT License. See the LICENSE file for details.
```
