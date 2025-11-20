import HttpStatusCodes from "./HttpStatusCodes";
import messages from "./messages";

class StatusService {
  static getHttpCodeMessage(code: number): string {
    const status = Object.values(HttpStatusCodes).find(
      (status) => status.code === code
    );
    return status ? status.message : "Status desconhecido.";
  }

  static getErrorMessage(type: string, field: string | null = null): string {
    const errorMessage = (messages.error as any)[type];

    if (errorMessage) {
      if (typeof errorMessage === "function") {
        return errorMessage(field);
      }
      return errorMessage;
    }
    return "Tipo de erro desconhecido.";
  }
}

export default StatusService;
