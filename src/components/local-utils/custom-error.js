const errorTypes = ['ValidationError', 'ServerConnectionError', 'ServerResponseError'];

export default class CustomError extends Error {
  constructor(message, type, status = 400) {
    super(message);
    if (!errorTypes.includes(type)) throw new TypeError('Invalid Error Type');

    this.name = type;
    this.status = status;
    this.message = message;
  }
}
