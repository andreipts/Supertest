const { api } = require('../src/api');
const { login, username } = require('../src/auth');

describe('DummyJSON - Autenticação', () => {
  test('POST /auth/login: login válido retorna token', async () => {
    const token = await login();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(10);
    console.log('POST /auth/login: 200; token recebido (valor ocultado)');
  });

  test('GET /auth/me: token Bearer permite acessar perfil', async () => {
    const token = await login();
    const response = await api
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      username
    }));
    console.log('GET /auth/me:', response.status, response.body.username);
  });

  test('POST /auth/login: credenciais inválidas são rejeitadas', async () => {
    const response = await api
      .post('/auth/login')
      .send({ username: 'usuario_inexistente_supertest', password: 'senha_incorreta' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    console.log('POST /auth/login inválido:', response.status);
  });

  test('GET /auth/me sem token: acesso negado com 401', async () => {
    const response = await api.get('/auth/me').expect(401);

    expect(response.body).toHaveProperty('message', 'Access Token is required');
    console.log('GET /auth/me sem token:', response.status, response.body.message);
  });

  test('GET /auth/me com token inválido: acesso negado com 401', async () => {
    const response = await api
      .get('/auth/me')
      .set('Authorization', 'Bearer token_invalido_de_teste')
      .expect(401);

    expect(response.body).toHaveProperty('message');
    console.log('GET /auth/me token inválido:', response.status, response.body.message);
  });
});
