const request = require('supertest');

// O Supertest também pode testar URLs externas, além de servidores Express locais.
const BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';
const api = request(BASE_URL);

module.exports = { api, BASE_URL };
