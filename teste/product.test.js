import request from "supertest"; // Biblioteca usada para testar rotas HTTP da API
import app from "./app.js"; // Importa o app Express (a API que criamos)

let products; // Lista de produtos que será usada nos testes

// Antes de cada teste, inicializa a lista de produtos com dois exemplos
beforeEach(() => {
  products = [
    {
      code: 12,
      description: "Macbook pro retina 2020",
      buyPrice: 4000,
      sellPrice: 8000,
      tags: ["tecnologia", "computador", "Apple"],
    },
    {
      code: 99,
      description: "Positivo pro retina 2020",
      buyPrice: 1000,
      sellPrice: 2000,
      tags: ["tecnologia", "computador", "Positivo"],
    },
  ];
});

// Testa se é possível adicionar um produto corretamente
test('Deve ser possível adicionar um novo produto', async () => {
  const response = await request(app) // Faz uma requisição para o app
    .post('/products') // Envia uma requisição POST para /products
    .send(products[0]); // Envia o primeiro produto da lista

  // Verifica se a resposta contém os mesmos dados + lovers: 0
  expect(response.body).toMatchObject({
    ...products[0],
    lovers: 0,
  });
});

// Verifica se a criação de um produto retorna status 201 (Created)
test('O status code de um produto criado deverá ser 201', async () => {
  const response = await request(app)
    .post('/products')
    .send(products[0]);

  expect(response.status).toBe(201);
});

// Testa se é possível atualizar um produto existente
test('Deve ser possível atualizar dados de um produto', async () => {
  const response = await request(app) // Cria o produto
    .post('/products')
    .send(products[0]);

  const updatedProduct = {
    ...products[0],
    description: "Dell Vostro", // Altera a descrição
  };

  const responseUpdated = await request(app) // Atualiza usando o ID
    .put(`/products/${response.body.id}`)
    .send(updatedProduct);

  expect(responseUpdated.body).toMatchObject(updatedProduct);
});

// Testa tentativa de atualizar um produto que não existe
test('Não deve ser possível atualizar um produto inexistente', async () => {
  const response = await request(app)
    .put('/products/14196') // ID que não existe
    .send(products[0]);

  expect(response.status).toBe(404); // Espera erro 404
});

// Testa tentativa de deletar um produto que não existe
test('Não deve ser possível remover um produto inexistente', async () => {
  const response = await request(app)
    .delete('/products/14196'); // Código que não existe

  expect(response.status).toBe(404); // Espera erro 404
});

// Testa se deletar um produto retorna status 204
test('Deve retornar o código 204 quando um produto for removido', async () => {
  const response = await request(app)
    .post('/products')
    .send(products[0]); // Cria o produto

  await request(app)
    .delete(`/products/${response.body.code}`) // Deleta pelo código
    .expect(204); // Espera sucesso sem resposta
});

// Testa se é possível listar todos os produtos
test('Deve ser possível listar todos os produtos', async () => { 
  await request(app)
    .post('/products')
    .send(products[0]); // Cria um produto

  const responseList = await request(app)
    .get('/products'); // Busca todos os produtos

  expect(responseList.body).toHaveLength(1); // Deve ter 1 produto na lista
});

// Testa se é possível remover produtos com um código específico
test('Deve ser possível remover um produto pelo código', async () => {
  await request(app).post('/products').send(products[0]); // Produto 1
  const response = await request(app).post('/products').send(products[0]); // Produto 2 com mesmo código
  await request(app).post('/products').send(products[1]); // Produto 3 com outro código

  await request(app)
    .delete(`/products/${response.body.code}`) // Remove todos com mesmo código
    .expect(204);

  const responseAll = await request(app).get('/products'); // Lista o que sobrou

  expect(responseAll.body).toHaveLength(1); // Deve restar só o produto com código diferente
});

// Testa se é possível dar "like" (incrementar lovers) no produto
test('Deve ser possível adicionar um "like" (lovers++) para todos os produtos com determinado código', async () => {
  const response = await request(app)
    .post('/products')
    .send(products[0]); // Cria o produto

  const responseLove = await request(app)
    .post(`/products/${response.body.code}/love`); // Envia "like"

  expect(responseLove.body[0].lovers).toBe(1); // lovers deve ter aumentado para 1
});

