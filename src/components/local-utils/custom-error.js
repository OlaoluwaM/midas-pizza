export default class CustomError extends Error {
  constructor(message, status = 400) {
    super();

    this.message = message;
    if (typeof status === 'number') {
      this.status = status;
    } else throw new TypeError('Status should be a number');
  }
}
