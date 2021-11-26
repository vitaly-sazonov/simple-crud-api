const http = require('http');
const HttpError = require('./HttpError');

module.exports = class App {
  constructor() {
    this.ctx = {};
    //  method : Map (url, handle)
    this.routes = new Map();
  }

  register(name, obj) {
    if (this.ctx.hasOwnProperty(name) || ['req', 'res'].includes(name))
      throw new Error(`Parameter "${name}" is already registered in ctx!`);
    this.ctx = { ...this.ctx, [name]: obj };
    return this;
  }

  createServer(...args) {
    const handle = this.router.bind(this);
    return http
      .createServer(handle)
      .on('error', (e) => this.error(e))
      .listen(...args);
  }

  route(url, method, handle) {
    if (typeof handle !== 'function') throw new Error('handle must be a function!');

    if (!this.routes.has(method)) {
      const pathMap = new Map([[url, handle]]);
      this.routes.set(method, pathMap);
      return this;
    }

    const methodMap = this.routes.get(method);
    if (methodMap.has(url)) {
      throw new Error(`the path "${url}" already exists in the app.route()`);
    }

    this.routes.get(method).set(url, handle);
    return this;
  }

  async router(req, res) {
    this.ctx = { ...this.ctx, req, res };
    if (this.routes.has(req.method)) {
      const urlsMap = this.routes.get(req.method);
      const url = this._matchUrlToPattern(req.url, [...urlsMap.keys()]);
      if (url) {
        const { pathToHandle, params } = url;
        const handleRequest = urlsMap.get(pathToHandle);
        const buffers = [];

        for await (const chunk of req) {
          buffers.push(chunk);
        }
        this.ctx.body = Buffer.concat(buffers).toString().trim();

        handleRequest(this.ctx, params);
        return;
      }
    }
    this.ctx.res.setHeader('Content-Type', 'application/json');
    this.error(new HttpError(404, 'Not Found'));
  }

  _matchUrlToPattern(url, arrayPatterns) {
    const testAndParsing = (pattern) => {
      const array = pattern.split(':');
      if (array.length == 1 && url == pattern) {
        return { pathToHandle: pattern, params: {} };
      }
      if (array.length == 2 && new RegExp(`^${array[0]}`).test(url)) {
        const param = url.replace(array[0], '');
        if (param == '' || param.slice(-1) == '/') return false;
        return { pathToHandle: pattern, params: { [array[1]]: param } };
      }
      return false;
    };

    for (let i = 0, len = arrayPatterns.length; i < len; i++) {
      const result = testAndParsing(arrayPatterns[i]);
      if (result) return result;
    }
    return false;
  }

  error(err) {
    console.error(err);
    if (!(err instanceof HttpError)) {
      this.ctx.res.setHeader('Content-Type', 'application/json');
      err.code = 500;
      err.message = 'Internal server error';
    }

    this.ctx.res.statusCode = err.code;
    this.ctx.res.end(JSON.stringify({ msg: err.message }));
  }
};
