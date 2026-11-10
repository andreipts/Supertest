const { api } = require('../src/api');

describe('DummyJSON - Produtos (GET e POST)', () => {
  test('GET /products/1: retorna 200 e dados do produto', async () => {
    const response = await api.get('/products/1').expect(200);

    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toEqual(expect.objectContaining({
      id: 1,
      title: expect.any(String),
      price: expect.any(Number)
    }));
    console.log('GET /products/1:', response.status, response.body.title);
  });

  test('GET /products/0: recurso inexistente retorna 404', async () => {
    const response = await api.get('/products/0').expect(404);
    expect(response.body).toHaveProperty('message');
    console.log('GET /products/0:', response.status, response.body.message);
  });

  test('POST /products/add: cria produto simulado e valida resposta', async () => {
    const novoProduto = { title: 'Produto de teste Supertest', price: 99 };
    const response = await api
      .post('/products/add')
      .set('Content-Type', 'application/json')
      .send(novoProduto)
      .expect(201);

    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: novoProduto.title,
      price: novoProduto.price
    }));
    console.log('POST /products/add:', response.status, response.body.title, 'R$', response.body.price);
    // DummyJSON simula o POST: o recurso não é persistido no servidor.
  });
});
