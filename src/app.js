/* eslint-disable no-param-reassign */ // Permite modificar parâmetros
/* eslint-disable eqeqeq */ // Permite usar == e !=
/* eslint-disable no-return-assign */ // Permite usar atribuições dentro de return

import express from 'express'; // Importa o framework Express
import cors from 'cors'; // Importa o middleware CORS
import { uuid } from 'uuidv4'; // Importa função para gerar UUIDs únicos

const app = express(); // Cria a aplicação Express

app.use(express.json()); // Permite o uso de JSON no corpo das requisições
app.use(cors()); // Habilita CORS (acesso de outros domínios)

let products = []; // Array de produtos simulando um banco de dados em memória

// **Rota para listar todos os produtos
app.get('/products', (request, response) => {
  return response.json(products); // Retorna todos os produtos
});

// **Rota para criar um novo produto
app.post('/products', (request, response) => {
  const { code, description, buyPrice, sellPrice, tags } = request.body; // Extrai os dados do novo produto
  const p = products.find((v) => v.code == code); // Verifica se já existe um produto com esse código
  const lov = p ? p.lovers : 0; // Se já existe, mantém o valor de lovers

  const product = { // Cria um novo produto com ID único
    id: uuid(),
    code,
    description,
    buyPrice,
    sellPrice,
    tags,
    lovers: lov,
  };

  products.push(product); // Adiciona o novo produto ao array
  return response.status(201).json(product); // Retorna o produto criado com status 201
});

// **Rota para atualizar um produto pelo ID
app.put('/products/:id', (request, response) => {
  const { id } = request.params; // Pega o ID da URL
  const { code, description, buyPrice, sellPrice, tags } = request.body; // Pega os novos dados

  const p = products.find((v) => v.id == id); // Procura produto pelo ID

  if (p) {
    p.code = code; // Atualiza os campos
    p.description = description;
    p.buyPrice = buyPrice;
    p.sellPrice = sellPrice;
    p.tags = tags;

    return response.json(p); // Retorna o produto atualizado
  } else {
    return response.status(404).json({ error: 'Product not found' }); // Produto não encontrado
  }
});

// **Rota para deletar produtos com base no código
app.delete('/products/:code', (request, response) => {
  const { code } = request.params; // Código do produto na URL
  const found = products.find((v) => v.code == code); // Verifica se existe

  if (!found) {
    return response.status(404).send({ error: 'Product not found' }); // Produto não encontrado
  } else {
    products = products.filter((v) => v.code != code); // Remove os produtos com esse código
    return response.status(204).send(); // Sucesso, sem conteúdo
  }
});

// **Rota para adicionar um "like" (lovers++) para todos os produtos com determinado código
app.post('/products/:code/love', (request, response) => {
  const { code } = request.params; // Código do produto na URL
  const matchingProducts = products.filter((v) => v.code == code); // Busca todos os produtos com esse código

  if (matchingProducts.length === 0) {
    return response.status(404).send({ error: 'Product not found' }); // Nenhum encontrado
  }

  matchingProducts.forEach((product) => product.lovers++); // Incrementa lovers de todos os produtos encontrados

  return response.json(matchingProducts); // Retorna os produtos atualizados
});

// **Rota para buscar produtos por código
app.get('/products/:code', (request, response) => {
  const { code } = request.params; // Código do produto na URL
  const matchedProducts = products.filter((v) => v.code == code); // Filtra os produtos

  if (matchedProducts.length === 0) {
    return response.status(204).send(); // Requisito 5.2: status 204 se não encontrar
  }

  return response.json(matchedProducts); // Retorna os produtos encontrados
});

export default app; // Exporta a aplicação para ser usada em outro lugar (ex: server.js)
