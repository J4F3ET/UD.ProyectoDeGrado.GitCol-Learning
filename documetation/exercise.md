# Ejercicios del sistema
Los niveles en los que se dividen los ejercicios son los siguientes:
- __Beginner__ : Ejercicios básicos para aprender los comandos básicos de git.
    - `git init`
    - `git config`
    - `git add`
    - `git rm`
    - `git restore`
    - `git commit`
    - `git status`
    - `git log`
    - `git branch`
    - `git checkout`
    - `git switch`
    - `git merge`
    - `git push`
    - `git pull`
    - `git clone`
    - `git remote`
- __Intermediate__ : Ejercicios intermedios para afianzar los conocimientos de comandos básicos de git.
- __Advanced__: Ejercicios avanzados para retar los conocimientos de comandos básicos de git.
## Indice
1. [lista de comandos](#lista-de-comandos)
## Lista de comandos
1. `git init`
2. `git config`
    - `git config --global user.name "Nombre"`
    - `git config --global user.email "Correo"`
    - `git config user.name "Nombre"`
    - `git config user.email "Correo"`
    - `git config --list`
    - `git config --global --unset user.name`
    - `git config --global --unset user.email`
3. `git add`
4. `git rm`
    - `git rm --cached "NombreArchivo"`
5. `git restore`
6. `git commit`
    - `git commit -m "Mensaje"`
    - `git commit -am "Mensaje"`
7. `git status`
8. `git log`
9. `git branch`
    - `git branch "NombreRama"`
    - `git branch -d "NombreRama"`
10. `git checkout`
11. `git switch`
12. `git merge`
13. `git push`
14. `git pull`
15. `git clone`
16. `git remote`
    - `git remote add "NombreRepositorio" "URLRepositorio"`
    - `git remote remove "NombreRepositorio"`
## Beginner
### Ejercicio 1 : Crear un repositorio
1. Crea un repositorio local con el nombre de `git-exercises`.
    - `git init`
2. Configura tu nombre y correo electrónico.
    - `git config --global user.name "Nombre"`
    - `git config --global user.email "Correo"`
3. Crea un archivo con el nombre de `README.md` y escribe una breve descripción del repositorio.
    - `echo "# git-exercises" >> README.md`
4. Agrega el archivo `README.md` al área de preparación.
    - `git add README.md`
5. Realiza un commit con el mensaje `Initial commit`.
    - `git commit -m "Initial commit"`
6. Crea un repositorio remoto con el nombre de `git-exercises`.
    - `git remote add git-exercises
7. Sube los cambios al repositorio remoto.
    - `git push -u git-exercises master`
### Ejercicio 2: Crear un archivo
1. Crea un archivo con el nombre de `index.html` y escribe el siguiente código:
    ```html
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Git Exercises</title>
    </head>
    <body>
        <h1>Git Exercises</h1>
    </body>
    </html>
    ```
2. Agrega el archivo `index.html` al área de preparación.
3. Realiza un commit con el mensaje `Add index.html`.
4. Crea un archivo con el nombre de `style.css` y escribe el siguiente código:
    ```css
    body {
        background-color: #000;
        color: #fff;
    }
    ```
5. Agrega el archivo `style.css` al área de preparación.
6. Realiza un commit con el mensaje `Add style.css`.
7. Crea un archivo con el nombre de `script.js` y escribe el siguiente código:
    ```js
    console.log("Git Exercises");
    ```
8. Agrega el archivo `script.js` al área de preparación.
9. Realiza un commit con el mensaje `Add script.js`.
10. Sube los cambios al repositorio remoto.
    - `git push`
### Ejercicio 3: Modificar un archivo
1. Modifica el archivo `index.html` y agrega el siguiente código:
    ```html
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Git Exercises</title>
    </head>
    <body>
        <h1>Git Exercises</h1>
        <p>Este es un repositorio para aprender los comandos básicos de git.</p>
    </body>
    </html>
    ```
2. Agrega el archivo `index.html` al área de preparación.
3. Realiza un commit con el mensaje `Add description to index.html`.
4. Modifica el archivo `style.css` y agrega el siguiente código:
    ```css
    body {
        background-color: #000;
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
    }
    ```
5. Agrega el archivo `style.css` al área de preparación.
6. Realiza un commit con el mensaje `Add font-family to style.css`.
7. Modifica el archivo `script.js` y agrega el siguiente código:
    ```js
    console.log("Git Exercises");
    console.log("Este es un repositorio para aprender los comandos básicos de git.");
    ```
8. Agrega el archivo `script.js` al área de preparación.
9. Realiza un commit con el mensaje `Add console.log to script.js`.
10. Sube los cambios al repositorio remoto.
    - `git push`
### Ejercicio 4: Eliminar un archivo