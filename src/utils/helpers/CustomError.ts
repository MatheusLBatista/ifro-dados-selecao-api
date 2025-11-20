interface CustomErrorOptions {
  statusCode?: number;
  errorType?: string;
  field?: string | null;
  details?: any[];
  customMessage?: string | null;
}

class CustomError extends Error {
  public statusCode?: number | undefined;
  public errorType?: string | undefined;
  public field?: string | null;
  public details?: any[];
  public customMessage?: string | null;
  public isOperational: boolean;

  constructor(message?: string, options: CustomErrorOptions = {}) {
    super(message || options.customMessage || "An error occurred");

    this.name = "CustomError";
    this.statusCode = options.statusCode;
    this.errorType = options.errorType;
    this.field = options.field ?? null;
    this.details = options.details ?? [];
    this.customMessage = options.customMessage ?? null;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
