class ApiError extends Error {
  public success: boolean;
  public statusCode: number;
  public errors: string[];
  constructor(
    success: boolean,
    statusCode: number,
    message: string,
    errors: string[] = [],
    stack?: string,
  ) {
    super(message);
    this.success = success;
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
