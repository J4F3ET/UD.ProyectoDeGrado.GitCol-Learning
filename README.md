# Git-Col Learning

## Why is this project being made?

This project is initiated to help students learn git commands in a more interactive way by providing them with a platform where they can practice git commands and learn how to use them in real-world scenarios.

## Content

1. [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Dependencies](#dependencies)
    - [Usage](#usage)
2. [Commits](#commits)
3. [Documentation](#documentation)
    - [Commands supported by minimun viable product](#commands-supported-by-minimum-viable-product)
    - [Possible commands to be implemented in the future](#possible-commands-to-be-implemented-in-the-future)
4. [Tecnologies](#tecnologies)

## Getting Started

### Installation

In order to install the project, you need to clone the repository and install the dependencies.

```bash
git clone https://github.com/J4F3ET/UD.ProyectoDeGrado.GitCol-Learning
```

> [!CAUTION]
> Is it necessary to install the dependencies of the project and need to have node.js installed on the computer.

```bash
npm install
```

The commands of the project are the following:
| Command | Description |
|---------|-------------|
| `npm run start` | Run the project in production mode :rocket: |
| `npm run dev` | Run the project in development mode :wrench: |
| `npm run docs` | Generate the documentation of the frontend :books: |

### Dependencies

The dependencies of the project are the following:

- **Nodemon**: To restart the server when changes are detected in the code, it speeds up development.
- **Babel**: To transpile the ES6 code to ES5, it allows using the new features of JavaScript. In order for the code to be compatible with older browsers.
- **Babel Node**: To run the code transpiled by Babel.
- **Express**: To create the web server.
- **Morgan**: To display in the console the requests that arrive at the server.
- **EJS**: To render the views.
- **Firebase-admin**: To connect the application with the Firebase database.
- **dotenv**: To load environment variables.
- **Socket.io**: To create the real-time connection between the server and the client.
- **Swagger-jsdoc**: To document the API.
- **Swagger-ui-express**: To visualize the API documentation.
- **jsDoc**: To document the code.

### Usage

## Commits

| Description                          | Type     | Format | Example                                    |
|--------------------------------------|----------|--------|--------------------------------------------|
| **Requirements and Features**        | feat     | `:sparkles:`    | feat: :sparkles: Include new feature       |
| **Change Control**                   | feat     | `:boom:`        | feat: :boom: Service implementation        |
| **Defects and Incidents**            | fix      | `:construction:`| fix: :construction: Mapping is corrected   |
| **Fix bugs**                         | fix      | `:bug:`         | fix: :bug: Mapping order fix               |
| **Immediate correction is required** | fix      | `:ambulance:`   | fix: :ambulance: Fix flow bug              |
| **Phase or sprint implemented**      | feat     | `:package:`     | feat: :package: Feature is included        |
| **Add, update or pass tests**        | test     | `:white_check_mark:` | test: :white_check_mark: New tests added |
| **Add or update documentation**      | docs     | `:memo:`        | docs: :memo: Update doc                    |
| **Add or update UI styles**          | style    | `:lipstick:`    | style: :lipstick: Update UI                |
| **Write bad code needed review**     | refactor | `:poop:`        | refactor: :poop: Fix this please |
| **Remove files**                     | feat     | `:fire:`        | feat: :fire: Remove file                   |
| **Reverting changes**                | revert   | `:rewind:`      | revert: :rewind: I shouldn't do that again |
| **Improving Performance**            | perf     | `:zap:`         | perf: :zap: Optimizing code                |

## Tecnologies

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

## Documentation

The documentation of the project is generated with jsDoc and Swagger-jsdoc.

### Markdown extra documentation

1. [Branching System](./docs/markdown/Branching%20System.md)
2. [Object prototype](./docs/markdown/Objects%20Prototype.md)
3. [Communication Design](./docs/markdown/Communication%20Design.md)
4. [Oauth2](./docs/markdown/Oauth%20Desing.md)
5. [Prototype Design](./docs/markdown/Prototype%20Designs.md)
6. [Exercise](./docs/markdown/exercise.md)

### Url Swagger Documentation API REST

- [Swagger Documentation](http://localhost:3000/api-docs)

> [!NOTE]
> The documentation is generated with Swagger-jsdoc and Swagger-ui-express.
> Is necessary to run the project to see the documentation.
> `http://localhost:3000/api-docs`

### Comand generated documentation frontend

```bash
npm run docs
```

> [!NOTE]
> The documentation is generated with jsDoc.
> Is necessary to run the project to see the documentation.
> Folder: /docs/jsdocs, open index.html

### Commands supported by minimum viable product

1. [x] **git init**: Inicilization a local git repository in the current folder.
    - [x] **git init -h**: Show the help of the command.
2. [x] **git commit**: Create a commit with the files in the staging area and a message.
    - [x] **git commit -h**: Show the help of the command.
    - [x] **git commit -m "Message"**: Create a commit with the files in the staging area and a message.
    - [x] **git commit -am "Message"**: Add the files to the staging area and create a commit with the files in the staging area and a message.
3. [x] **git log**: Show the commit history.
    - [x] **git log -h**: Show the help of the command.
    - [x] **git log -n number**: Show the commit history with the number of commits specified.
4. [x] **git branch**: Show the branches of the repository.
    - [x] **git branch -h**: Show the help of the command.
    - [x] **git branch "BranchName"**: Create a branch with the specified name.
    - [x] **git branch -d "BranchName"**: Delete the branch with the specified name.
    - [x] **git branch -m "BranchName"**: Change the name of the current branch.
    - [x] **git branch -a**: Show all the branches of the repository.
    - [x] **git branch -l**: Show the branches of the repository.
    - [x] **git branch -r**: Show the remote branches of the repository.
5. [x] **git checkout**: Change the branch.
    - [x] **git checkout -h**: Show the help of the command.
    - [x] **git checkout -b "BranchName"**: Create a branch with the specified name and change to it.
    - [x] **git checkout -q "BranchName"**: Change to the branch with the specified name.
6. [x] **git push**: Upload the changes to the remote repository.
    - [x] **git push -h**: Show the help of the command.
7. [x] **git pull**: Download the changes from the remote repository.
    - [x] **git pull -h**: Show the help of the command.
8. [x] **git merge**: Merge two branches.
    - [x] **git merge -h**: Show the help of the command.

### Possible commands to be implemented in the future

1. **git config**: Configura el nombre y el correo electrónico del usuario.
    - **git config --global user.name "Nombre"**: Configura el nombre del usuario de forma global.
    - **git config --global user.email "Correo"**: Configura el correo electrónico del usuario de forma global.
    - **git config user.name "Nombre"**: Configura el nombre del usuario de forma local en el repositorio actual.
    - **git config user.email "Correo"**: Configura el correo electrónico del usuario de forma local en el repositorio actual.
    - **git config --list**: Muestra la configuración actual.
    - **git config --global --unset user.name**: Elimina la configuración del nombre del usuario.
    - **git config --global --unset user.email**: Elimina la configuración del correo electrónico del usuario.
    - **git rm "NombreArchivo"**: Elimina el archivo del área de preparación.
2. **git switch**: Cambia de rama.
