class ApiResponse<T> {
  public success: boolean;
  public message: string | undefined;
  public data: unknown;

  constructor(success: boolean, message?: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
