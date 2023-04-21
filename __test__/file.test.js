const request = require('supertest');
const app = require('../app');

describe('Test GET /api/file', () => {
  test('Expect a status code of 200', async () => {
    const response = await request(app).get('/api/file');
    expect(response.statusCode).toBe(200);
  });
});
