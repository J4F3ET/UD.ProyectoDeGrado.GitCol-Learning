import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
const theme = new SwaggerTheme();
const optionsSwagger = {
    explorer: false,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK)
  };
// Metadatos de la api
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "GitCol-Learning",
			version: "1.0.0",
			description: "Documentación de la API de GitCol-Learning",
		},
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				BearerAuth: [],
			},
		],
	},
	apis: ["./src/controller/*.js", "./src/model/*.js"],
};


// Doc en formato json
const swaggerSpec = swaggerJSDoc(options);
export const swaggerDoc = async (app,port) => {
    // Ruta para ver la documentacion
    app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec,optionsSwagger));
    app.get("/api-docs.json",(req,res) => {
        res.setHeader("Content-Type","application/json");
        res.send(swaggerSpec);
    });
}
