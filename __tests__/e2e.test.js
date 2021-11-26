const { agent } = require('supertest');
const httpServer = require('../server')(3000);
const request = agent(httpServer);

afterAll((done) => {
  httpServer.close(done);
});

describe('GREEN Test CRUD', () => {
  test('GET /person -> return empty array', async () => {
    const res = await request.get('/person');
    expect(res.body).toEqual(expect.arrayContaining([]));
  });

  let uuid = '';
  const body = { name: 'Vasya', age: '20', hobbies: "['walk','fight','drink']" };

  test('POST /person {name, age, hobbies} -> return {id:uuid, name, age, hobbies} and statusCode 201', async () => {
    const res = await request.post('/person').set('Accept', 'application/json').send(body);
    const { id, ...testObj } = res.body;
    uuid = id;
    expect(res.statusCode).toBe(201);
    expect(JSON.stringify(testObj)).toBe(JSON.stringify(body));
  });

  test('GET /person/:id -> return {id:uuid, name, age, hobbies} and statusCode 200', async () => {
    const res = await request.get(`/person/${uuid}`).set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify({ id: uuid, ...body }));
  });

  test('PUT /person/:id new {name, age, hobbies} -> return renewed {id:uuid, name, age, hobbies}, statusCode 200 and "id" has not changed', async () => {
    const newBody = { name: 'Petya', age: '25', hobbies: "['only drink']" };
    const res = await request
      .put(`/person/${uuid}`)
      .set('Accept', 'application/json')
      .send(newBody);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(uuid);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify({ id: uuid, ...newBody }));
  });

  test('DELETE /person/:id -> return statusCode 204', async () => {
    const res = await request.delete(`/person/${uuid}`).set('Accept', 'application/json');
    expect(res.statusCode).toBe(204);
  });

  test('GET /person/:id -> return {msg:"The record not found"} and statusCode 404', async () => {
    const res = await request.get(`/person/${uuid}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe('The record not found');
  });
});

describe('RED Test CRUD', () => {
  let uuid = '';
  const body = { name: 'Vasya', age: '20', hobbies: "['walk','fight','drink']" };

  test('GET /person/:bad_uuid -> return {msg:"Bad uuid"} and statusCode 400', async () => {
    const res = await request.get(`/person/asde`).set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('Bad uuid');
  });

  test('GET /person/:valid_id "but not record" -> return {msg:"The record not found"} and statusCode 404', async () => {
    const res = await request
      .get(`/person/ad064eab-0129-4dec-9be3-2e259cd65b4e`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe('The record not found');
  });

  test(`POST /person/ {name, age} "no required property" -> return {msg:"Fields 'name', 'age' and 'hobby' must be specified"} and statusCode 400`, async () => {
    const res = await request
      .post(`/person`)
      .set('Accept', 'application/json')
      .send({ name: 'Vasya', age: '20' });
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe(`Fields 'name', 'age' and 'hobby' must be specified`);
  });

  test('PUT /person/:bad_uuid -> return {msg:"Bad uuid"} and statusCode 400', async () => {
    const res = await request.put(`/person/asde`).set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('Bad uuid');
  });

  test('PUT /person/:valid_id "but not record" -> return {msg:"The record not found"} and statusCode 404', async () => {
    const res = await request
      .put(`/person/ad064eab-0129-4dec-9be3-2e259cd65b4e`)
      .set('Accept', 'application/json')
      .send(body);
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe('The record not found');
  });

  test('DELETE /person/:bad_uuid -> return {msg:"Bad uuid"} and statusCode 400', async () => {
    const res = await request.delete(`/person/asde`).set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('Bad uuid');
  });

  test('DELETE /person/:valid_id "but not record" -> return {msg:"The record not found"} and statusCode 404', async () => {
    const res = await request
      .delete(`/person/ad064eab-0129-4dec-9be3-2e259cd65b4e`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe('The record not found');
  });

  test(`POST /person/ {incorrect json} -> return {msg:"Internal server error"} and statusCode 500`, async () => {
    const res = await request
      .post(`/person`)
      .set('Accept', 'application/json')
      .send(`{ name:Vasya age: '20' }`);
    expect(res.statusCode).toBe(500);
    expect(res.body.msg).toBe(`Internal server error`);
  });

  test(`POST /person/ {incorrect json} -> return {msg:"Internal server error"} and statusCode 500`, async () => {
    const res = await request
      .post(`/person`)
      .set('Accept', 'application/json')
      .send(`{ name:Vasya age: '20' }`);
    expect(res.statusCode).toBe(500);
    expect(res.body.msg).toBe(`Internal server error`);
  });

  test(`GET /person/path/to/param/ -> return {msg:"Not Found"} and statusCode 404`, async () => {
    const res = await request.get(`/person/path/to/param/`).set('Accept', 'application/json');
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe(`Not Found`);
  });
});
