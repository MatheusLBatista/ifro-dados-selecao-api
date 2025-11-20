// Interface para definir a estrutura dos códigos de status
interface StatusCode {
  code: number;
  message: string;
}

class HttpStatusCodes {
  static OK: StatusCode = {
    code: 200,
    message: "Requisição bem-sucedida",
  };
  static CREATED: StatusCode = {
    code: 201,
    message: "Recurso criado com sucesso",
  };
  static ACCEPTED: StatusCode = {
    code: 202,
    message: "Requisição aceita para processamento",
  };
  static NO_CONTENT: StatusCode = {
    code: 204,
    message: "Sem conteúdo para retornar",
  };
  static RESET_CONTENT: StatusCode = {
    code: 205,
    message: "Mais dados necessários para processamento",
  };
  static PARTIAL_CONTENT: StatusCode = {
    code: 206,
    message: "Conteúdo parcial retornado",
  };
  static MULTI_STATUS: StatusCode = {
    code: 207,
    message: "Múltiplos recursos associados à resposta",
  };
  static ALREADY_REPORTED: StatusCode = {
    code: 208,
    message: "Conteúdo já relatado",
  };

  static MULTIPLE_CHOICES: StatusCode = {
    code: 300,
    message: "Múltiplas respostas disponíveis, cliente deve escolher uma",
  };
  static MOVED_PERMANENTLY: StatusCode = {
    code: 301,
    message: "Recurso movido permanentemente para um novo endereço",
  };
  static FOUND: StatusCode = {
    code: 302,
    message:
      "Recurso encontrado, mas movido temporariamente para um novo endereço",
  };
  static SEE_OTHER: StatusCode = {
    code: 303,
    message: "Veja outra referência para o recurso",
  };
  static NOT_MODIFIED: StatusCode = {
    code: 304,
    message: "Cliente possui a versão mais recente do recurso",
  };
  static USE_PROXY: StatusCode = {
    code: 305,
    message: "Recurso disponível apenas através de um proxy",
  };
  static TEMPORARY_REDIRECT: StatusCode = {
    code: 307,
    message: "Recurso temporariamente movido para um novo endereço",
  };
  static PERMANENT_REDIRECT: StatusCode = {
    code: 308,
    message: "Recurso movido permanentemente para um novo endereço",
  };

  static BAD_REQUEST: StatusCode = {
    code: 400,
    message: "Requisição com sintaxe incorreta",
  };
  static UNAUTHORIZED: StatusCode = {
    code: 401,
    message: "Não autorizado",
  };
  static FORBIDDEN: StatusCode = { code: 403, message: "Proibido" };
  static NOT_FOUND: StatusCode = {
    code: 404,
    message: "Recurso não encontrado",
  };
  static METHOD_NOT_ALLOWED: StatusCode = {
    code: 405,
    message: "Método HTTP não permitido para o recurso solicitado",
  };
  static REQUEST_TIMEOUT: StatusCode = {
    code: 408,
    message: "Tempo de requisição esgotado",
  };
  static CONFLICT: StatusCode = {
    code: 409,
    message: "Conflito com o estado atual do servidor",
  };
  static GONE: StatusCode = {
    code: 410,
    message: "Recurso não está mais disponível",
  };
  static PAYLOAD_TOO_LARGE: StatusCode = {
    code: 413,
    message: "O corpo da requisição é muito grande",
  };
  static IM_A_TEAPOT: StatusCode = {
    code: 418,
    message: "Eu sou um bule de chá",
  };
  static UNPROCESSABLE_ENTITY: StatusCode = {
    code: 422,
    message: "Falha na validação",
  };
  static LOCKED: StatusCode = {
    code: 423,
    message: "Recurso bloqueado",
  };
  static REQUEST_HEADER_FIELDS_TOO_LARGE: StatusCode = {
    code: 431,
    message: "Cabeçalhos da requisição são muito grandes",
  };
  static UNAVAILABLE_FOR_LEGAL_REASONS: StatusCode = {
    code: 451,
    message: "Acesso negado por motivos legais",
  };
  static INVALID_TOKEN: StatusCode = {
    code: 498,
    message: "O token JWT está expirado!",
  };

  static INTERNAL_SERVER_ERROR: StatusCode = {
    code: 500,
    message: "Erro interno do servidor",
  };
  static NOT_IMPLEMENTED: StatusCode = {
    code: 501,
    message: "Funcionalidade não suportada",
  };
  static BAD_GATEWAY: StatusCode = {
    code: 502,
    message: "Resposta inválida recebida do servidor upstream",
  };
  static SERVICE_UNAVAILABLE: StatusCode = {
    code: 503,
    message: "Serviço temporariamente indisponível",
  };
}

export default HttpStatusCodes;
