# Ejercicios del sistema

Los niveles en los que se dividen los ejercicios son los siguientes:

- __Beginner__ : Ejercicios básicos para aprender los comandos básicos de git.
  - [x] `git init`
    - [x] `git config`
    - [x] `git add`
    - [x] `git rm`
    - [x] `git restore`
    - [x] `git commit`
    - [x] `git status`
    - [x] `git log`
    - [x] `git branch`
    - [x] `git checkout`
    - [x] `git switch`
    - [x] `git merge`
    - [x] `git rebase`
    - [x] `git push`
    - [x] `git pull`
    - [x] `git clone`
    - [x] `git remote`
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

### Ejercicio 1 : Crear un repositorio local

1. Crea un repositorio local

    - `git init`
2. Configura tu nombre y correo electrónico.
    - `git config --global user.name "Nombre"`
    - `git config --global user.email "Correo"`

3. Crea un archivo con el nombre de `README.md`
    >[!NOTE]
    >No debería de crear un archivo si no que de alguna forma ya estar creado solo como que seleccionarlo para agregarlo al stash
4. Agrega el archivo `README.md` al área de preparación.
    - `git add README.md`
5. Realiza un commit con el mensaje `Initial commit`.
    - `git commit -m "Initial commit"`

    >[!NOTE]
    >Tambien puede usar `git commit -am "Initial commit"` evita usar hacer el paso 4
    >Tambien puedes usar `git commit -a` para agregar todos los archivos al stash y hacer el commit
    >Tambien puedes eliminar  archivos del stash con `git rm --cached <<nombre del archivo>>`

### Ejercicio 2: Repositorio remoto

>[!NOTE]
>El archivo ya debería de estar creado por defectos para eventos prácticos. Se debería de representar de alguna forma la creación o el dar a entender que ya existe el archivo solo es agregarlo

1. Agrega el archivo `index.html` al área de preparación.
2. Realiza un commit con el mensaje `Add index.html`.
3. Agrega el archivo `style.css` al área de preparación.
4. Realiza un commit con el mensaje `Add style.css`.
5. Agrega el archivo `script.js` al área de preparación.
6. Realiza un commit con el mensaje `Add script.js`.
7. Crear un repositorio en la nube

    >[!NOTE]
    >Ya deberá tener configuración `git config`

8. Crea la conexión con el repositorio remoto
    - `git remote add <<nombre de conexión>> <<url repositorio>>`
9. Sube los cambios al repositorio remoto.
    - `git push`

### Ejercicio 3:Agrega los archivos faltantes

1. Verifica que esten todos los archivos en el stash
    -`git status`
2. Agrega los archivos faltantes
    -`git add <<nombre del archivo>>`
3. Agrega el commit
    -`git commit -m "Agregando <<nombre de archivos>>"`

    >[!NOTE]
    > Tambien puede usar `git commit -am "Agregando <<nombre de archivos>>"` evita usar hacer el paso 2

### Ejercicio 4: Crear un rama nueva

1. Crea una rama con el nombre de `develop`.
    - `git branch develop`
2. Cambia a la rama `develop`.
    - `git checkout develop` o tambien puede usar `git switch develop`
3. Agrega el archivo `index.html` al área de preparación.
    - `git add index.html`
4. Realiza un commit con el mensaje `Add index.html`.
    - `git commit -m "Add index.html"`

    >[!NOTE]
    > Tambien puede usar `git commit -am "Add index.html"` evita usar hacer el paso 3

### Ejercicio 5: Deshacer un commit

1. Verifica el historial de commits.
    - `git log`
2. Deshacer el último commit.
    - `git reset --soft HEAD~1`
3. Verifica el historial de commits.
    - `git log`

    >[!NOTE]
    > Tambien puede usar `git log --oneline` para ver el historial de commits de una forma mas resumida
    > Tambien puede usar `git log --oneline --graph` para ver el historial de commits de una forma mas resumida y con graficos

### Ejercicio 6: Actualiza repositorio local

1. Actualiza el repositorio local en la rama `master`.
    - `git pull`
    >[!NOTE]
    > También puede usar `git pull origin master` para actualizar el repositorio local, `origin` es el nombre de la conexión y `master` es el nombre de la rama a actualizar
    >
### Ejercicio 7: Clonar un repositorio

1. Clona el repositorio `git-exercises` en la carpeta `git-exercises-clone`.
    - `git clone <<URL>>`

### Ejercicio 8: Restaurar commit

1. Verifica el historial de commits.
    - `git log`
2. Restaura el commit con el mensaje `Add index.html`.
    - `git restore --source=HEAD~1 index.html` el `HEAD~1` es el numero de commit que se quiere restaurar, en este caso es el ultimo commit
3. Verifica el historial de commits.
    - `git log`
    >[!NOTE]
    > Tambien puede usar `git log --oneline` para ver el historial de commits de una forma mas resumida

### Ejercicio 9: Fucionar dos ramas

1. Crea la rama `bugRelease` y la rama `bugHotfix` a partir de la rama `master`.
    - `git branch bugRelease`
    - `git branch bugHotfix`
2. Cambia a la rama `bugRelease`.
    - `git checkout bugRelease` o tambien puede usar `git switch bugRelease`
3. Agrega un commit con el mensaje `Add bugRelease`.
    - `git commit -m "Add bugRelease"`
4. Cambia a la rama `bugHotfix`.
    - `git checkout bugHotfix` o tambien puede usar `git switch bugHotfix`
5. Agrega un commit con el mensaje `Add bugHotfix`
    - `git commit -m "Add bugHotfix"`
6. Cambia a la rama `master`.
    - `git checkout master` o tambien puede usar `git switch master`
7. Fusiona la rama `bugRelease` con la rama `master`.
    - `git merge bugRelease` o tambien puede usar `git merge bugRelease`
    - `git rebase bugRelease` o tambien puede usar `git rebase bugRelease`
8. Fusiona la rama `bugHotfix` con la rama `master`.
    - `git merge bugHotfix` o tambien puede usar `git merge bugHotfix`
    - `git rebase bugHotfix` o tambien puede usar `git rebase bugHotfix`
