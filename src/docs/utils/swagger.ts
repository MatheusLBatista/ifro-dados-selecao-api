import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { schemas } from "../schemas/index.js";
import { authPaths } from "../paths/auth.js";
import { usuarioPaths } from "../paths/usuario.js";
import { inscricaoPaths } from "../paths/inscricao.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Inscrição IFRO",
      version: "1.0.0",
      description: "API para gerenciamento de inscrições e usuários do IFRO",
    },
    servers: [
      {
        url: "http://localhost:5011",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: schemas,
    },
    paths: {
      ...authPaths,
      ...usuarioPaths,
      ...inscricaoPaths,
    },
  },
  apis: [], // Não precisamos mais dos arquivos de rotas pois estamos definindo tudo aqui
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
