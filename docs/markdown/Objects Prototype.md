# Object prototype

This documentation shows the object prototype for the project.

## Commit Object

 It objetc not is a module (class to comand "commit") but is a object to the commit. The object has the following properties:

 ```javascript
 {
    id: 'jk23k',
    parent: "init",
    message: "Initial commit",
    tags: ["master", "HEAD"],
    class: ["commit","checked-out"],
    autor: 'Pepe',
    date: '2021-09-01 12:00:00',
    cx: 50,
    cy: 334,
}
```

> [!NOTE]
>
> - id: commit id
> - parent: commit parent id
> - message: commit message
> - tags: list of tags(branchs)
> - class: list of classes
> - autor: commit autor
> - date: commit date
> - cx: x position
> - cy: y position

## Exercise Object

```JSON
{
 "id": 1,
 "name": "",
 "generator": {
  "1": "git commit",
  "2": "..."
 },
 "level": 1,
 "solution": {
  "1": "git commit",
  "2": "..."
 },
 "files":["README.md","style.css","index.html"]
}
```

> [!NOTE]
>
> - id: Exercise id
> - name: nombre del problema
> - generator: lista de comando que genera la solución problema
> - level: nivel del problema
> - solution: lista de soluciones de problemas

## Room Object

```JSON
{
    "id": 1,
    "name": "",
    "owner": "",
    "members": {
        "1": "user1",
        "2": "user2"
    },
    "challenge":1,
    "status": "active",
    "chat": {
        "1": {
            "user": "user1",
            "message": "message1"
        },
        "2": {
            "user": "user2",
            "message": "message2"
        }
    }
}
```

> [!NOTE]
>
> - id: Room id
> - name: Room name
> - owner: Room owner
> - members: List to members of the room
> - challenge: id of the challenge of the room
> - status: room status(public, private)
> - chat: list of chat messages

## Generator Object

```JSON
{ [
      {
        "id": "e137e9b",
        "tags": [],
        "message": "first commit",
        "parent": "initial",
        "cx": 50,
        "cy": 330,
        "branchless": false
      },
      {
        "id": "84c98fe",
        "parent": "e137e9b",
        "tags": [
          "master",
          "origin/master"
        ],
        "cx": 140,
        "cy": 330,
        "branchless": false
      }
    ]
}
```

> [!NOTE]
>
> It is a list of commits that generate the solution to the problem.
