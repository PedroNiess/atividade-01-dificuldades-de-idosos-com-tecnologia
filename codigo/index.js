const jsonServer = require('json-server');
const server = jsonServer.create();

// Aponta o router para seu arquivo de banco de dados
const router = jsonServer.router('db/db.json');

// Configura os middlewares do servidor. A opção 'static' serve os arquivos da pasta 'public'
const middlewares = jsonServer.defaults({
  static: './public'
});

// Usa os middlewares e o router no servidor
server.use(middlewares);
server.use(router);

// Inicia o servidor na porta 3000
server.listen(3000, () => {
  console.log('JSON Server está rodando em http://localhost:3000');
});