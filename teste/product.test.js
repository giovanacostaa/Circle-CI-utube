// ---> A quantidade vendida pode ser de 1 ou mais unidades.

import Product from '../src/model/product/product.js'; 
import sellProduct from '../src/service/sellproduct.js';

test("Deve validar baixa de estoque da venda de uma unidade", () => {
    let product = new Product("Celular", 500.00, 900.00, 10);
    sellProduct(product, 1);
    expect(product.stock).toBe(9); // Agora o teste verifica o valor correto
});

test("Deve validar baixa de estoque da venda de mais de uma unidade", () => {
    let product = new Product("Celular", 500.00, 900.00, 10);
    sellProduct(product, 3);
    expect(product.stock).toBe(7); // Agora o teste verifica o valor correto
});

