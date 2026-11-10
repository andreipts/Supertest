const { api } = require('./api');

// Conta de demonstração pública documentada pela DummyJSON; não usar contas pessoais.
const username = process.env.DUMMYJSON_USERNAME || 'emilys';
const password = process.env.DUMMYJSON_PASSWORD || 'emilyspass';

async function login() {
  const response = await api
    .post('/auth/login')
    .set('Content-Type', 'application/json')
    .send({ username, password, expiresInMins: 30 });

  if (response.status !== 200 || !response.body.accessToken) {
    throw new Error(`Falha na autenticação: HTTP ${response.status}`);
  }
  return response.body.accessToken;
}

module.exports = { login, username };
