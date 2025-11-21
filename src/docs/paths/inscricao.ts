export const inscricaoPaths = {
  "/inscricao": {
    post: {
      summary: "Criar uma nova inscrição",
      tags: ["Inscrições"],
      description: `
        + Caso de uso: Permitir que um usuário crie uma nova inscrição fornecendo os dados necessários.

            + Função de Negócio
              - Facilitar o processo de inscrição para novos candidatos.
            
            + Requisitos:
              - Validação do formato dos dados.
              - Armazenamento seguro das informações no banco de dados.
              - Não permitir inscrições duplicadas com o mesmo email ou nome.

            + Fluxo:
              - Receber dados da inscrição via request body.
              - Validar os dados recebidos.
              - Salvar a inscrição no banco de dados.
              - Retornar confirmação de criação com detalhes da inscrição.

            + Resultado Esperado:
              - Confirmação de que a inscrição foi criada com sucesso.
      `,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Inscricao",
            },
            example: {
              nome: "Maria Silva",
              email: "maria.silva@email.com",
              telefone: "69999999999",
              data_nascimento: "15/05/1995",
              background: [
                {
                  certificado: "Certificado de Inglês",
                  descricao: "Proficiência em inglês nível intermediário",
                },
              ],
              experiencia: "2 anos de experiência em desenvolvimento web",
              area_interesse: "Desenvolvimento de software",
              observacao: "Disponível para trabalhar remotamente",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Inscrição criada com sucesso",
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
                    example: "Inscrição criada com sucesso",
                  },
                  data: {
                    $ref: "#/components/schemas/Inscricao",
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
      },
    },
    get: {
      summary: "Listar inscrições com paginação",
      tags: ["Inscrições"],
      description: `
        + Caso de uso: Permitir que coordenadores, avaliadores e administradores listem todas as inscrições com suporte à paginação e filtros.

            + Função de Negócio
              - Facilitar a gestão e avaliação das inscrições recebidas.
              + Recebe como query parameters (opcionais):
                • filtros: nome, status, email.
            
            + Requisitos:
              - Autenticação e permissão de usuários.

            + Fluxo:
              - Receber parâmetros de paginação e filtros via query parameters (opcionais).
              - Validar permissões do usuário.
              - Consultar o banco de dados aplicando filtros e paginação.
              - Retornar a lista paginada de inscrições.

            + Resultado Esperado:
              - Lista paginada e detalhe das inscrições.
      `,
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
          name: "limite",
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
          name: "status",
          schema: {
            type: "string",
            enum: ["APROVADO", "REPROVADO", "PENDENTE"],
          },
          description: "Filtrar por status",
        },
      ],
      responses: {
        200: {
          description: "Lista de inscrições",
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
                    example: "Inscrições encontradas",
                  },
                  data: {
                    type: "object",
                    properties: {
                      docs: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Inscricao",
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
  "/inscricao/avaliadas": {
    get: {
      summary: "Listar inscrições avaliadas para coordenadores",
      tags: ["Inscrições"],
      description: `
        + Caso de uso: Permitir que coordenadores listem todas as inscrições avaliadas com suporte à paginação e filtros.

            + Função de Negócio
              - Facilitar a gestão das aprovações das inscrições, pois elas precisam estar avaliadas antes de serem aprovadas.
              + Recebe como query parameters (opcionais):
                • filtros: nome, status, email, pontuacaoMin, pontuacaoMax.
            
            + Requisitos:
              - Autenticação e permissão de coordenador.

            + Fluxo:
              - Receber parâmetros de paginação e filtros via query parameters (opcionais).
              - Validar permissões do usuário.
              - Consultar o banco de dados aplicando filtros e paginação.
              - Retornar a lista paginada de inscrições avaliadas.

            + Resultado Esperado:
              - Lista paginada e detalhe das inscrições avaliadas.
      `,
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
          name: "limite",
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
          name: "status",
          schema: {
            type: "string",
            enum: ["APROVADO", "REPROVADO", "PENDENTE"],
          },
          description: "Filtrar por status",
        },
        {
          in: "query",
          name: "pontuacaoMin",
          schema: {
            type: "number",
            minimum: 0,
            maximum: 10,
          },
          description: "Filtrar por pontuação mínima",
        },
        {
          in: "query",
          name: "pontuacaoMax",
          schema: {
            type: "number",
            minimum: 0,
            maximum: 10,
          },
          description: "Filtrar por pontuação máxima",
        },
      ],
      responses: {
        200: {
          description: "Lista de inscrições avaliadas",
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
                    example: "Inscrições avaliadas encontradas",
                  },
                  data: {
                    type: "object",
                    properties: {
                      docs: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Inscricao",
                        },
                      },
                      totalDocs: {
                        type: "integer",
                        example: 15,
                      },
                      limit: {
                        type: "integer",
                        example: 10,
                      },
                      totalPages: {
                        type: "integer",
                        example: 2,
                      },
                      page: {
                        type: "integer",
                        example: 1,
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
  "/inscricao/avaliadas/{id}": {
    get: {
      summary: "Obter inscrição avaliada por ID",
      tags: ["Inscrições"],
      description: `
        + Caso de uso: Permitir que coordenadores obtenham os detalhes de uma inscrição avaliada específica pelo seu ID.

            + Função de Negócio
              - Facilitar a revisão detalhada das inscrições avaliadas antes da aprovação ou reprovação.
            
            + Requisitos:
              - Autenticação e permissão de coordenador.
              - Validação do ID da inscrição.

            + Fluxo:
              - Receber o ID da inscrição via path parameter.
              - Validar permissões do usuário.
              - Consultar o banco de dados para obter os detalhes da inscrição avaliada.
              - Retornar os detalhes da inscrição avaliada.

            + Resultado Esperado:
              - Detalhes completos da inscrição avaliada.
      `,
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
          description: "ID da inscrição",
        },
      ],
      responses: {
        200: {
          description: "Inscrição encontrada",
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
                    example: "Inscrição encontrada",
                  },
                  data: {
                    $ref: "#/components/schemas/Inscricao",
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
          description: "Inscrição não encontrada",
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
  "/inscricao/{id}": {
    get: {
      summary: "Obter inscrição por ID",
      tags: ["Inscrições"],
      description: `  
        + Caso de uso: Permitir que usuários autenticados obtenham os detalhes de uma inscrição específica pelo seu ID.

            + Função de Negócio
              - Permitir que avaliadores ou coordenadores acessem inscrições específicas.
            
            + Requisitos:
              - Autenticação do usuário.
              - Validação do ID da inscrição.

            + Fluxo:
              - Receber o ID da inscrição via path parameter.
              - Validar permissões do usuário.
              - Consultar o banco de dados para obter os detalhes da inscrição.
              - Retornar os detalhes da inscrição.
              
            + Resultado Esperado:
              - Detalhes completos da inscrição.
      `,
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
          description: "ID da inscrição",
        },
      ],
      responses: {
        200: {
          description: "Inscrição encontrada",
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
                    example: "Inscrição encontrada",
                  },
                  data: {
                    $ref: "#/components/schemas/Inscricao",
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
          description: "Inscrição não encontrada",
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
  "/inscricao/{id}/avaliar": {
    patch: {
      summary: "Avaliar inscrição",
      tags: ["Inscrições"],
      description: `
        + Caso de uso: Permitir que avaliadores avaliem uma inscrição específica fornecendo uma pontuação.

            + Função de Negócio
              - Permitir que avaliadores registrem suas avaliações nas inscrições recebidas.
            
            + Requisitos:
              - Autenticação e permissão de avaliador.
              - Validação do ID da inscrição.
              - Validação dos dados de avaliação (pontuação e observação).

            + Fluxo:
              - Receber o ID da inscrição via path parameter.
              - Validar permissões do usuário.
              - Atualizar pontuação da inscrição no banco de dados.
              - Retornar confirmação da avaliação.

            + Resultado Esperado:
              - Confirmação de que a inscrição foi avaliada com sucesso.
      `,
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
          description: "ID da inscrição",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                pontuacao: {
                  type: "number",
                  minimum: 0,
                  maximum: 10,
                  description: "Pontuação da avaliação",
                },
                observacao: {
                  type: "string",
                  description: "Observações da avaliação",
                },
              },
              required: ["pontuacao"],
            },
            example: {
              pontuacao: 8,
              observacao: "Candidato com bom perfil técnico",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Inscrição avaliada com sucesso",
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
                    example: "Inscrição avaliada com sucesso",
                  },
                  data: {
                    $ref: "#/components/schemas/Inscricao",
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
        404: {
          description: "Inscrição não encontrada",
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
  "/inscricao/{id}/aprovar": {
    patch: {
      summary: "Aprovar inscrição",
      tags: ["Inscrições"],
      description: `
        + Caso de uso: Permitir que coordenadores aprovem ou reprovem uma inscrição específica após a avaliação.

            + Função de Negócio
              - Permitir que coordenadores finalizem o processo de inscrição aprovando ou reprovando candidatos.
            
            + Requisitos:
              - Autenticação e permissão de coordenador.
              - Validação do ID da inscrição.
              - A inscrição deve estar previamente avaliada.

            + Fluxo:
              - Receber o ID da inscrição via path parameter.
              - Validar permissões do usuário.
              - Verificar se a inscrição foi avaliada.
              - Atualizar o status da inscrição para "APROVADO" ou "REPROVADO" no banco de dados.
              - Retornar confirmação da aprovação.

            + Resultado Esperado:
              - Confirmação de que a inscrição foi aprovada ou reprovada com sucesso.
      `,
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
          description: "ID da inscrição",
        },
      ],
      responses: {
        200: {
          description: "Inscrição aprovada com sucesso",
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
                    example: "Inscrição aprovada com sucesso",
                  },
                  data: {
                    $ref: "#/components/schemas/Inscricao",
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
          description: "Inscrição não encontrada",
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
