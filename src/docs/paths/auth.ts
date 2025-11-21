export const authPaths = {
  "/login": {
    post: {
      summary: "Realizar login no sistema e emitir tokens JWT",
      tags: ["Autenticação"],
      description: `
        + Caso de uso: Autenticação de usuários e emissão de tokens JWT.

            + Função de Negócio
                - Permitir que os usuários entrem no sistema e obtenham acesso às funcionalidades internas.
                + Recebe credenciais (email e senha) no corpo da requisição.
                    - Se as credenciais estiverem corretas e o usuário for ativo:
                      - Gera um **accessToken** (expiração: 15 minutos).
                      - Gera um **refreshToken** (expiração: 7 dias) e o armazena em lista de tokens válidos.
                      - Retorna um objeto contendo { accessToken, refreshToken, user }.
            
            + Regras de Negócio Envolvidas:
                - Se o usuário estiver bloqueado ou inativo, retorna 401 Unauthorized.
                - Regra de login com base nas permissões do usuário.
                - Auditoria de login deve registrar sucesso/fracasso sem expor senha.

            + Resultado Esperado:
                - Retorno dos tokens de acesso e refresh.
                - Dados básicos do usuário.
      `,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Login",
            },
            example: {
              email: "carlos.coord@empresa.com",
              senha: "Coordenador$2025",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login realizado com sucesso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
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
          description: "Credenciais inválidas",
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
  "/logout": {
    post: {
      summary: "Encerrar sessão e invalidar access token",
      tags: ["Autenticação"],
      description: `
        + Caso de uso: Encerrar sessão do usuário e invalidar o access token.

            + Função de Negócio
                - Permitir que os usuários encerrem sua sessão de forma segura.
                + Recebe o access token no header Authorization ou no corpo da requisição.
                    - Valida o token:
                      - Se válido, invalida o token (remoção da lista de tokens válidos).
                      - Retorna mensagem de sucesso.
            
            + Regras de Negócio Envolvidas:
                - Se o token não for fornecido ou inválido, retorna 400 Bad Request ou 401 Unauthorized.
                - Auditoria de logout deve registrar a ação sem expor detalhes sensíveis.

            + Resultado Esperado:
                - Confirmação de logout bem-sucedido.
      `,
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                access_token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjA4NmY1ZjZhYzJhZWNmMmM3ODVlYSIsImlhdCI6MTc2Mzc0Nzc3MywiZXhwIjoxNzYzNzQ4NjczfQ.io4n222DRybfOR87CWUlyRh533yHqaVIgF_OEAz9FVM",
                  description:
                    "Token de acesso (opcional, pode ser enviado no header Authorization)",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Logout realizado com sucesso",
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
                    example: "Logout realizado com sucesso",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Token não fornecido",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        401: {
          description: "Token inválido",
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
