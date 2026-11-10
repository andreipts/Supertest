# Automação de Testes de API — Supertest (ST)

**Trabalho avaliativo | Grupo com 5 integrantes**  
**Stack:** JavaScript, Node.js, Jest e Supertest  
**API de referência:** https://dummyjson.com

**Repositório:** https://github.com/Eduardosilvarolli/3-trabalho  
**Pipeline CI/CD:** https://github.com/Eduardosilvarolli/3-trabalho/actions

## Objetivo
Demonstrar a automação de testes de API HTTP com Supertest, verificando status, cabeçalhos e dados JSON, com autenticação e integração contínua.

## Requisitos
- Node.js 20 ou superior (recomendado Node.js 22)
- npm
- Conexão com a internet para acessar a DummyJSON

## Como instalar e executar

```bash
npm install     # instala as dependências fixadas no package-lock.json
npm test
```

O `package-lock.json` está commitado no repositório, então todas as máquinas (e o GitHub Actions) instalam exatamente as mesmas versões do Jest e do Supertest. No CI o comando é `npm ci`, que exige esse arquivo e é mais rápido e previsível que `npm install`.

Para mais detalhes: `npm run test:verbose`. Para cobertura: `npm run test:coverage`.

## Testes implementados

| Cenário | Método e rota | Verificações |
| --- | --- | --- |
| Buscar produto existente | GET `/products/1` | 200, header JSON, id, título, preço |
| Buscar produto inexistente | GET `/products/0` | 404, mensagem de erro |
| Adicionar produto (simulado) | POST `/products/add` | 201, id, título e preço |
| Autenticar usuário de demonstração | POST `/auth/login` | 200, accessToken |
| Consultar perfil autenticado | GET `/auth/me` | 200, username e id com Bearer token |
| Login inválido | POST `/auth/login` | 400 e mensagem de erro |
| Acesso sem autenticação | GET `/auth/me` | 401 e mensagem "Access Token is required" |
| Token inválido | GET `/auth/me` | 401 e mensagem de erro |

**Observação:** a DummyJSON simula a criação de produtos; o POST não persiste dados. A API é externa e mudanças/indisponibilidade podem afetar os testes. O token nunca é impresso nos logs.

## Estrutura

```text
supertest-api-grupo5/
├── .github/workflows/testes-api.yml  # CI/CD no GitHub Actions
├── src/api.js                         # Cliente Supertest reutilizável
├── src/auth.js                        # Função reutilizável de login
├── tests/produtos.spec.js             # Testes GET e POST
├── tests/autenticacao.spec.js         # Login e rota autenticada
├── jest.config.js                     # Runner de testes
├── package.json                       # Dependências e comandos
├── package-lock.json                  # Versões fixadas (usado pelo npm ci do CI)
├── .env.example                       # Configurações opcionais
├── .gitignore                         # Ignora node_modules, coverage e .env
└── README.md                          # Guia do projeto
```

## Como funciona
1. `api` usa o Supertest para fazer requisições HTTP à DummyJSON.
2. O Jest executa os arquivos `*.spec.js` e reporta resultados.
3. `.expect(200)`, `.expect(201)`, `.expect(400)`, `.expect(401)` e `.expect(404)` validam o status HTTP.
4. `expect(response.body)` valida os campos do JSON retornado.
5. `login()` faz POST em `/auth/login` e obtém o `accessToken`.
6. O teste de `/auth/me` envia `Authorization: Bearer <token>`.
7. Os testes negativos validam que a rota protegida devolve 401 sem token e com token inválido.
8. O GitHub Actions roda `npm ci` e `npm test` em push, PR e manualmente.

## GitHub e CI/CD
O projeto está publicado em https://github.com/Eduardosilvarolli/3-trabalho (repositório privado).

O workflow `.github/workflows/testes-api.yml` executa a suíte automaticamente em três situações: **push** nas branches `main`/`master`, **pull request** e **execução manual** (aba Actions → *Testes automatizados de API* → *Run workflow*).

Para enviar alterações a partir deste repositório:

```bash
git add .
git commit -m "Descreva a alteração"
git push
```

Depois do push, abra a aba **Actions** e aguarde o check verde. Para o professor acessar o repositório privado, use *Settings → Collaborators and teams → Add people* e convide a conta informada pelo professor (ou torne o repositório público).

## Escalabilidade e manutenção
- Separar testes por recurso (`produtos`, `autenticacao` etc.).
- Reutilizar o cliente HTTP e funções de autenticação.
- Adicionar novos arquivos `*.spec.js` para outros endpoints.
- Rodar a suíte no CI a cada alteração.
- Usar variáveis de ambiente para URL e credenciais de teste, nunca dados pessoais.

## Vantagens e limitações
**Vantagens:** integração natural com Node.js, asserções HTTP diretas, reutilização, automação no CI/CD.  
**Limitações:** exige código e configuração de runner; não oferece interface gráfica completa; depende de API acessível e estável.

## Roteiro para apresentação (5 integrantes)
1. **Integrante 1:** definição de API, Supertest e requisições HTTP.
2. **Integrante 2:** vantagens, limitações, cenários de uso e benefício para a empresa.
3. **Integrante 3:** Node.js, Jest, estrutura do projeto e comandos.
4. **Integrante 4:** executar `npm test`, mostrar GET, POST, login e Bearer token.
5. **Integrante 5:** interpretar resultados, demonstrar GitHub Actions, escalabilidade e conclusão.

## Referências
- Supertest: https://github.com/ladjs/supertest
- Jest: https://jestjs.io/docs/getting-started
- DummyJSON: https://dummyjson.com/docs
- GitHub Actions: https://docs.github.com/en/actions

> Antes da apresentação, execute `npm test` com internet, confirme o resultado e prepare a aba Actions do GitHub. Não exponha tokens ou credenciais reais.
