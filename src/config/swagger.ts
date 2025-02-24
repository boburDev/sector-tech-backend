import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { Express } from "express";

const createSwaggerConfig = (title: string, url: string, apis: string[]) => ({
  definition: {
    openapi: "3.0.0",
    info: {
      title,
      version: "1.0.0",
      description: `API documentation for ${title}`,
    },
    servers: [
      { url: `http://${baseUrl}` }, 
      { url: `https://${baseUrl}` }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis,
});

const baseUrl = process.env.BASE_URL || "localhost:4000/"

const userSwaggerSpec = swaggerJSDoc(
  createSwaggerConfig("User API", baseUrl, [
    "./src/routers/user/*.ts",
  ])
);

const adminSwaggerSpec = swaggerJSDoc(
  createSwaggerConfig("Admin API", baseUrl, [
    "./src/routers/admin/*.ts",
  ])
);


export const setupSwagger = (app: Express) => {
  app.use(
    "/api-docs",
    swaggerUI.serveFiles(userSwaggerSpec),
    swaggerUI.setup(userSwaggerSpec)
  );

  app.use(
    "/admin-docs",
    swaggerUI.serveFiles(adminSwaggerSpec),
    swaggerUI.setup(adminSwaggerSpec)
  );
};
