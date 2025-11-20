// Tipos para as funções de mensagem
type MessageFunction = (param: string) => string;
type MultiMessageFunction = (param1: string, param2: string) => string;
type ArrayMessageFunction = (fieldName: string, values: string[]) => string;

interface Messages {
  info: {
    welcome: string;
    userLoggedIn: MessageFunction;
  };
  success: {
    default: string;
  };
  authorized: {
    default: string;
  };
  error: {
    [key: string]: string | MessageFunction | MultiMessageFunction;
    default: string;
    serverError: string;
    validationError: string;
    invalidRequest: string;
    unauthorizedAccess: string;
    invalidURL: string;
    unsupportedOperation: string;
    dataParsingError: string;
    externalServiceError: string;
    invalidApiKey: string;
    operationCanceled: string;
    internalServerError: MessageFunction;
    unauthorized: MessageFunction;
    resourceConflict: MultiMessageFunction;
    pageIsNotAvailable: MessageFunction;
    pageNotContainsData: MessageFunction;
    duplicateEntry: MessageFunction;
    resourceInUse: MessageFunction;
    authenticationError: MessageFunction;
    permissionError: MessageFunction;
    resourceNotFound: MessageFunction;
  };
  validation: {
    generic: {
      fieldIsRequired: MessageFunction;
      fieldIsRepeated: MessageFunction;
      invalidInputFormat: MessageFunction;
      invalid: MessageFunction;
      notFound: MessageFunction;
      mustBeOneOf: ArrayMessageFunction;
      resourceCreated: MessageFunction;
      resourceUpdated: MessageFunction;
      resourceDeleted: MessageFunction;
      resourceAlreadyExists: MessageFunction;
    };
    reference: {
      resourceWithReference: MultiMessageFunction;
    };
    custom: {
      invalidCPF: { message: string };
      invalidCNPJ: { message: string };
      invalidCEP: { message: string };
      invalidPhoneNumber: { message: string };
      invalidMail: { message: string };
      invalidYear: { message: string };
      invalidDate: { message: string };
      invalidKilometerInitial: { message: string };
      invalidKilometer: { message: string };
      invalidDatePast: { message: string };
      invalidDateFuture: { message: string };
      invalidDateCurrent: { message: string };
      invalidDateMonths: { message: string };
      invalidDataNascimento: { message: string };
      invalidDataAdmissao: { message: string };
      invalidYearSemester: { message: string };
      invalidYearStartSemester: { message: string };
    };
  };
  auth: {
    authenticationFailed: string;
    userNotFound: MessageFunction;
    invalidPermission: string;
    duplicateEntry: MessageFunction;
    accountLocked: string;
    invalidToken: string;
    timeoutError: string;
    databaseConnectionError: string;
    emailAlreadyExists: MessageFunction;
    invalidCredentials: string;
  };
}

const messages: Messages = {
  // Mensagens Informativas
  info: {
    welcome: "Bem-vindo à nossa aplicação!",
    userLoggedIn: (username: string) =>
      `Usuário ${username} logado com sucesso.`,
  },

  // Mensagens de Sucesso
  success: {
    default: "Operação concluída com sucesso.",
  },

  // Mensagens de aviso de atorização
  authorized: {
    default: "autorizado",
  },

  // Mensagens de Erro
  error: {
    default: "Ocorreu um erro ao processar a solicitação.",
    serverError: "Erro interno do servidor. Tente novamente mais tarde.",
    validationError:
      "Erro de validação. Verifique os dados fornecidos e tente novamente.",
    invalidRequest: "Requisição inválida. Verifique os parâmetros fornecidos.",
    unauthorizedAccess: "Acesso não autorizado. Faça login para continuar.",
    invalidURL: "URL inválida. Verifique a URL fornecida.",
    unsupportedOperation: "Operação não suportada neste contexto.",
    dataParsingError: "Erro ao analisar os dados recebidos.",
    externalServiceError: "Erro ao se comunicar com um serviço externo.",
    invalidApiKey: "Chave de API inválida.",
    operationCanceled: "Operação cancelada pelo usuário.",
    internalServerError: (resource: string) =>
      `Erro interno no servidor ao processar ${resource}.`,
    unauthorized: (resource: string) => `Erro de autorização: ${resource}.`,
    resourceConflict: (resource: string, conflictField: string) =>
      `Conflito de recurso em ${resource} contém ${conflictField}.`,
    pageIsNotAvailable: (page: string) =>
      `A página ${page} não está disponível.`,
    pageNotContainsData: (page: string) => `A página ${page} não contém dados.`,
    duplicateEntry: (fieldName: string) =>
      `Já existe um registro com o dado informado no(s) campo(s) ${fieldName}.`,
    resourceInUse: (fieldName: string) => `Recurso em uso em ${fieldName}.`,
    authenticationError: (fieldName: string) =>
      `Erro de autenticação em ${fieldName}.`,
    permissionError: (fieldName: string) =>
      `Erro de permissão em ${fieldName}.`,
    resourceNotFound: (fieldName: string) =>
      `Recurso não encontrado em ${fieldName}.`,
  },

  // Mensagens de Validação
  validation: {
    generic: {
      fieldIsRequired: (fieldName: string) =>
        `O campo ${fieldName} é obrigatório.`,
      fieldIsRepeated: (fieldName: string) =>
        `O campo ${fieldName} informado já está cadastrado.`,
      invalidInputFormat: (fieldName: string) =>
        `Formato de entrada inválido para o campo ${fieldName}.`,
      invalid: (fieldName: string) =>
        `Valor informado em ${fieldName} é inválido.`,
      notFound: (fieldName: string) =>
        `Valor informado para o campo ${fieldName} não foi encontrado.`,
      mustBeOneOf: (fieldName: string, values: string[]) =>
        `O campo ${fieldName} deve ser um dos seguintes valores: ${values.join(
          ", "
        )}.`,
      resourceCreated: (fieldName: string) =>
        `${fieldName} criado(a) com sucesso.`,
      resourceUpdated: (fieldName: string) =>
        `${fieldName} atualizado(a) com sucesso.`,
      resourceDeleted: (fieldName: string) =>
        `${fieldName} excluído(a) com sucesso.`,
      resourceAlreadyExists: (fieldName: string) => `${fieldName} já existe.`,
    },
    reference: {
      resourceWithReference: (resource: string, reference: string) =>
        `${resource} com referência em ${reference}. Exclusão impedida.`,
    },
    custom: {
      invalidCPF: {
        message: "CPF inválido. Verifique o formato e tente novamente.",
      },
      invalidCNPJ: {
        message: "CNPJ inválido. Verifique o formato e tente novamente.",
      },
      invalidCEP: {
        message: "CEP inválido. Verifique o formato e tente novamente.",
      },
      invalidPhoneNumber: {
        message:
          "Número de telefone inválido. Verifique o formato e tente novamente.",
      },
      invalidMail: { message: "Email no formato inválido." },
      invalidYear: {
        message: "Ano inválido. Verifique o formato e tente novamente.",
      },
      invalidDate: {
        message: "Data inválida. Verifique o formato e tente novamente.",
      },
      invalidKilometerInitial: { message: "Quilometragem inicial inválida." },
      invalidKilometer: { message: "Quilometragem inválida." },
      invalidDatePast: {
        message: "Data do início deve ser uma data atual ou futura.",
      },
      invalidDateFuture: {
        message: "A data de conclusão deve ser maior do que a data de início!",
      },
      invalidDateCurrent: {
        message: "Data do início deve ser uma data atual ou passada.",
      },
      invalidDateMonths: {
        message:
          "A data final da vigência não pode ser um período maior que 12 meses após a data de início da vigência.",
      },
      invalidDataNascimento: {
        message:
          "Data de nascimento deve ser uma data passada e maior que 18 anos.",
      },
      invalidDataAdmissao: {
        message: "Data de admissão deve ser uma data atual ou passada.",
      },
      invalidYearSemester: {
        message: "Ano/semestre. Verifique o formato e tente novamente.",
      },
      invalidYearStartSemester: {
        message:
          "Data do início do semestre deve ser menor que a data fim de semestre.",
      },
    },
  },

  // Mensagens de Autenticação
  auth: {
    authenticationFailed: "Falha na autenticação. Credenciais inválidas.",
    userNotFound: (userId: string) =>
      `Usuário com ID ${userId} não encontrado.`,
    invalidPermission: "Permissão insuficiente para executar a operação.",
    duplicateEntry: (fieldName: string) =>
      `Já existe um registro com o mesmo ${fieldName}.`,
    accountLocked: "Conta bloqueada. Entre em contato com o suporte.",
    invalidToken: "Token inválido. Faça login novamente.",
    timeoutError: "Tempo de espera excedido. Tente novamente mais tarde.",
    databaseConnectionError:
      "Erro de conexão com o banco de dados. Tente novamente mais tarde.",
    emailAlreadyExists: (email: string) =>
      `O endereço de email ${email} já está em uso.`,
    invalidCredentials: "Credenciais inválidas. Verifique seu usuário e senha.",
  },
};

export default messages;
