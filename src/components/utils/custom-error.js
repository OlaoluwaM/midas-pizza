export default class CustomError extends Error {
  constructor(message, type = 'CustomError', status = 400) {
    super();

    this.message = message;
    this.type = type;

    if (typeof status === 'number') {
      this.status = status;
    } else throw new TypeError('Status should be a number');
  }
}
