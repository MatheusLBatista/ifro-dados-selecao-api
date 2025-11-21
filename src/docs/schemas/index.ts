export const schemas = {
  Usuario: {
    type: "object",
    properties: {
      nome: {
        type: "string",
        description: "Nome completo do usuário",
      },
      email: {
        type: "string",
        format: "email",
        description: "Email do usuário",
      },
      senha: {
        type: "string",
        description: "Senha do usuário (mínimo 8 caracteres)",
      },
      data_nascimento: {
        type: "string",
        description: "Data de nascimento (DD/MM/YYYY)",
      },
      telefone: {
        type: "string",
        description: "Telefone do usuário",
      },
      papel: {
        type: "string",
        enum: ["administrador", "avaliador", "coordenador"],
        description: "Papel do usuário no sistema",
      },
    },
    required: [
      "nome",
      "email",
      "senha",
      "data_nascimento",
      "telefone",
      "papel",
    ],
  },
  Inscricao: {
    type: "object",
    properties: {
      nome: {
        type: "string",
        description: "Nome completo do candidato",
      },
      email: {
        type: "string",
        format: "email",
        description: "Email do candidato",
      },
      telefone: {
        type: "string",
        description: "Telefone do candidato",
      },
      data_nascimento: {
        type: "string",
        description: "Data de nascimento (DD/MM/YYYY)",
      },
      background: {
        type: "array",
        items: {
          type: "object",
          properties: {
            certificado: {
              type: "string",
              description: "Nome do certificado",
            },
            descricao: {
              type: "string",
              description: "Descrição do certificado",
            },
          },
        },
        description: "Lista de certificados e formações",
      },
      experiencia: {
        type: "string",
        description: "Experiência profissional",
      },
      area_interesse: {
        type: "string",
        description: "Área de interesse",
      },
      observacao: {
        type: "string",
        description: "Observações adicionais",
      },
    },
    required: [
      "nome",
      "email",
      "telefone",
      "data_nascimento",
      "background",
      "experiencia",
      "area_interesse",
    ],
  },
  Login: {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "Email do usuário",
      },
      senha: {
        type: "string",
        description: "Senha do usuário",
      },
    },
    required: ["email", "senha"],
  },
  AuthResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Login realizado com sucesso",
      },
      data: {
        type: "object",
        properties: {
          user: {
            $ref: "#/components/schemas/Usuario",
          },
          tokens: {
            type: "object",
            properties: {
              accessToken: {
                type: "string",
                description: "Token de acesso JWT",
              },
              refreshToken: {
                type: "string",
                description: "Token de refresh",
              },
            },
          },
        },
      },
    },
  },
  Error: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      message: {
        type: "string",
        description: "Mensagem de erro",
      },
      error: {
        type: "object",
        properties: {
          statusCode: {
            type: "integer",
            description: "Código de status HTTP",
          },
          errorType: {
            type: "string",
            description: "Tipo do erro",
          },
          field: {
            type: "string",
            description: "Campo relacionado ao erro",
          },
          details: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Detalhes do erro",
          },
          customMessage: {
            type: "string",
            description: "Mensagem personalizada do erro",
          },
        },
      },
    },
  },
};
