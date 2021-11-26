const { randomUUID } = require('crypto');

const { isUUID } = require('../utils');
const HttpError = require('../core/HttpError');

module.exports = (app) => {
  app.route('/person', 'GET', (ctx) => {
    try {
      const persons = ctx.db.getAll();
      ctx.res.writeHead(200, { 'Content-Type': 'application/json' });
      ctx.res.end(JSON.stringify(persons));
    } catch (e) {
      app.error(e);
    }
  });

  app.route('/person/:uuid', 'GET', (ctx, { uuid }) => {
    try {
      ctx.res.setHeader('Content-Type', 'application/json');

      if (!isUUID(uuid)) {
        throw new HttpError(400, 'Bad uuid');
      }

      const person = ctx.db.get(uuid);
      if (person) {
        ctx.res.statusCode = 200;
        ctx.res.end(JSON.stringify(person));
        return;
      }
      throw new HttpError(404, 'The record not found');
    } catch (e) {
      app.error(e);
    }
  });

  app.route('/person', 'POST', (ctx) => {
    try {
      const { name, age, hobbies } = JSON.parse(ctx.body);
      ctx.res.setHeader('Content-Type', 'application/json');

      if (!name || !age || !hobbies) {
        throw new HttpError(400, `Fields 'name', 'age' and 'hobby' must be specified`);
      }

      const person = ctx.db.add({ id: randomUUID(), name, age, hobbies });
      if (person) {
        ctx.res.statusCode = 201;
        ctx.res.end(JSON.stringify(person));
        return;
      }

      throw new HttpError(500, `Something went wrong...`);
    } catch (e) {
      app.error(e);
    }
  });

  app.route('/person/:uuid', 'PUT', (ctx, { uuid }) => {
    try {
      ctx.res.setHeader('Content-Type', 'application/json');

      if (!isUUID(uuid)) {
        throw new HttpError(400, 'Bad uuid');
      }
      const { name, age, hobbies } = JSON.parse(ctx.body);
      if (ctx.db.update(uuid, { name, age, hobbies })) {
        ctx.res.statusCode = 200;
        ctx.res.end(JSON.stringify(ctx.db.get(uuid)));
        return;
      }
      throw new HttpError(404, 'The record not found');
    } catch (e) {
      app.error(e);
    }
  });

  app.route('/person/:uuid', 'DELETE', (ctx, { uuid }) => {
    try {
      ctx.res.setHeader('Content-Type', 'application/json');

      if (!isUUID(uuid)) {
        throw new HttpError(400, 'Bad uuid');
      }

      if (ctx.db.delete(uuid)) {
        ctx.res.statusCode = 204;
        ctx.res.end('Record is deleted');
        return;
      }
      throw new HttpError(404, 'The record not found');
    } catch (e) {
      app.error(e);
    }
  });
};
