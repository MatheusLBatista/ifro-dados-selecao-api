export const usuarioPaths = {
  "/usuario": {
    post: {
      summary: "Criar um novo usuário",
      tags: ["Usuários"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Usuario",
            },
            example: {
              nome: "João Silva",
              email: "joao.silva@ifro.edu.br",
              senha: "Senha123",
              data_nascimento: "01/01/1990",
              telefone: "(69) 99999-9999",
              papel: "avaliador",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Usuário criado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  message: {
                    type: "string",
                    example: "Usuário criado com sucesso",
                  },
                  data: {
                    $ref: "#/components/schemas/Usuario",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Dados inválidos",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        401: {
          description: "Não autorizado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        403: {
          description: "Permissão insuficiente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
    get: {
      summary: "Listar usuários com paginação",
      tags: ["Usuários"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            minimum: 1,
          },
          description: "Número da página",
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
          },
          description: "Número de itens por página",
        },
        {
          in: "query",
          name: "nome",
          schema: {
            type: "string",
          },
          description: "Filtrar por nome",
        },
        {
          in: "query",
          name: "email",
          schema: {
            type: "string",
          },
          description: "Filtrar por email",
        },
        {
          in: "query",
          name: "papel",
          schema: {
            type: "string",
            enum: ["administrador", "avaliador", "coordenador"],
          },
          description: "Filtrar por papel",
        },
      ],
      responses: {
        200: {
          description: "Lista de usuários",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  message: {
                    type: "string",
                    example: "Usuários encontrados",
                  },
                  data: {
                    type: "object",
                    properties: {
                      docs: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Usuario",
                        },
                      },
                      totalDocs: {
                        type: "integer",
                        example: 25,
                      },
                      limit: {
                        type: "integer",
                        example: 10,
                      },
                      totalPages: {
                        type: "integer",
                        example: 3,
                      },
                      page: {
                        type: "integer",
                        example: 1,
                      },
                      pagingCounter: {
                        type: "integer",
                        example: 1,
                      },
                      hasPrevPage: {
                        type: "boolean",
                        example: false,
                      },
                      hasNextPage: {
                        type: "boolean",
                        example: true,
                      },
                      prevPage: {
                        type: "integer",
                        nullable: true,
                        example: null,
                      },
                      nextPage: {
                        type: "integer",
                        example: 2,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Não autorizado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        403: {
          description: "Permissão insuficiente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },
  "/usuario/{id}": {
    get: {
      summary: "Obter usuário por ID",
      tags: ["Usuários"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID do usuário",
        },
      ],
      responses: {
        200: {
          description: "Usuário encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  message: {
                    type: "string",
                    example: "Usuário encontrado",
                  },
                  data: {
                    $ref: "#/components/schemas/Usuario",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Não autorizado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        403: {
          description: "Permissão insuficiente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        404: {
          description: "Usuário não encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
    delete: {
      summary: "Excluir usuário por ID",
      tags: ["Usuários"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID do usuário",
        },
      ],
      responses: {
        200: {
          description: "Usuário excluído com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  message: {
                    type: "string",
                    example: "Usuário excluído com sucesso",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Não autorizado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        403: {
          description: "Permissão insuficiente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        404: {
          description: "Usuário não encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },
};
