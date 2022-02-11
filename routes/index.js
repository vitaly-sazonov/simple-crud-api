const person = require("./person");

module.exports = (app) => {
  [person].map((route) => route(app));
  return app;
};
