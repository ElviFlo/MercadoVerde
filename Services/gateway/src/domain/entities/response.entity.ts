// Services/gateway/src/domain/entities/response.entity.ts
export class ResponseEntity<T = any> {
  success: boolean;
  message: string;
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }

  static ok<T>(data: T, message = "Operación exitosa"): ResponseEntity<T> {
    return new ResponseEntity<T>(true, message, data);
  }

  static fail(message: string): ResponseEntity<null> {
    return new ResponseEntity<null>(false, message, null);
  }
}
