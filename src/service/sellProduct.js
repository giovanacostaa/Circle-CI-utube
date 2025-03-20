
/* A quantidade vendida pode ser 1 ou mais quantidades
--> Se estoque ficar negativo, uma exception deve ser lançada
--> O valor de venda não pode ser maio que o valor de compra
*@param {*} product 
* @param {*} quantity
*/


export default function sellProduct(product, quantity) {
    product.stock -= quantity;
    return product
}
