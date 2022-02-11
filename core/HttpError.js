class HttpError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "HttpError";
    this.code = code;
    this.message = message;
  }
}

module.exports = HttpError;
