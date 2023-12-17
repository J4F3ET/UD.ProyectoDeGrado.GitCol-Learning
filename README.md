# UD.ProyectoDeGrado.GitCol-Learning

## Indice

1. [Mokaps](#mokaps)
2. [Diseño UI/UX](#diseño-uiux)
3. [Assets](#assets)
4. [Dependencias](#dependencias)
5. [Scripts](#scripts)
6. [Arquitectura](#arquitectura)

## Mokaps

### [Mokap Screens](https://excalidraw.com/#room=aa8cb898b51ca15e7332,cJnn7SoDPItVCLnpyTbKOA)

![ImagenMokaps](./documetation/img/MokapsScreens.png)

### [Mokap Menus](https://excalidraw.com/#room=799f024d570de905f1eb,IKaxeORRUyZTSAEUkV_AiQ)

![ImagenMokaps](./documetation/img/MokapsMenus.png)

### [Mokap Diseño](https://excalidraw.com/#room=f02156652a490656904a,aEEX4YXh5ZaQrA5-SQWIhg)

## Diseño UI/UX

### Paleta de colores

![Static Badge](https://img.shields.io/badge/%23D45050%20-%23D45050?style=for-the-badge)![Static Badge](https://img.shields.io/badge/%23FA8E5F%20-%23FA8E5F?style=for-the-badge)![Static Badge](https://img.shields.io/badge/%23FACA89%20-%23FACA89?style=for-the-badge)![Static Badge](https://img.shields.io/badge/%2383BD86%20-%2383BD86?style=for-the-badge)![Static Badge](https://img.shields.io/badge/%2354C6B8%20-%2354C6B8?style=for-the-badge)

![Static Badge](https://img.shields.io/badge/%236A95D6%20-%236A95D6%20?style=for-the-badge)![Static Badge](https://img.shields.io/badge/%23C398C8%20-%23C398C8?style=for-the-badge)![Static Badge](https://img.shields.io/badge/%23E891BD%20-%23E891BD?style=for-the-badge)![Static Badge](https://img.shields.io/badge/%23C4BDB7-%23C4BDB7?style=for-the-badge)![Static Badge](https://img.shields.io/badge/%23FFFDF9%20-%23FFFDF9?style=for-the-badge)

## Assets

### Tipografía

- [Virgil](https://virgil.excalidraw.com/)
- [Roboto](https://fonts.google.com/specimen/Roboto?query=Rob)

### Iconos

### Logo

#### JSON PROTOTYPE

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
	}
}
```

challenge: Problema
id: identificador del problema
name: nombre del problema
generator: lista de comando que genera la solución problema
level: nivel del problema
solution: lista de soluciones de problemas

# Dependencias
## Dependencias de desarrollo
- __Nodemon__: Para reiniciar el servidor cuando se detectan cambios en el código, permite agilizar el desarrollo.
```bash
npm install -g nodemon
```
- __Babel__: Para transpilar el código de ES6 a ES5, permite utilizar las nuevas características de JavaScript. Con el fin de que el código sea compatible con navegadores antiguos.
```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```
- __Babel Node__: Para ejecutar el código transpilado por Babel.
```bash
npm install -g @babel/node
```

## Dependencias de producción
- __Express__: Para crear el servidor web.
```bash
npm install express
```
- __Morgan__: Para mostrar en consola las peticiones que llegan al servidor.
```bash
npm install morgan
```
- __Firebase__: Para conectar la aplicación con la base de datos de Firebase.
```bash
npm install firebase
```
# Scripts
- __start__: Ejecuta el servidor en modo producción.
```bash
npm run start
```
# Arquitectura
## Estructura
```
└── 📁UD.ProyectoDeGrado.GitCol-Learning
    └── .babelrc
    └── 📁documetation
        └── 📁img
            └── MokapsMenus.png
            └── MokapsScreens.png
    └── package-lock.json
    └── package.json
    └── README.md
    └── server.js
    └── 📁src
        └── 📁controller
        └── 📁model
        └── 📁view
            └── 📁collaborativeViews
            └── 📁singleViews
            └── teaser.html
```
## Estructura de carpetas
- __src__: Contiene el código fuente de la aplicación.
```
└── 📁src
    └── 📁controller
    └── 📁model
    └── 📁view
        └── 📁collaborativeViews
        └── 📁singleViews
        └── teaser.html
```
- __documetation__: Contiene la documentación del proyecto.
```
└── 📁documetation
    └── 📁img
        └── MokapsMenus.png
        └── MokapsScreens.png
```