import {IProduct} from "../../types";

export class Cart {
  private products: IProduct[];

  constructor(productsList: IProduct[]) {
    this.products = productsList // Для товаров в корзине
  }

  getProductsCart(): IProduct[] {
    return [...this.products]
  }

  setProductCart(product: IProduct) {
    this.products.push(product)
  }

  clearingCart() {
    this.products = []
  }

  removeProduct(product: IProduct) {
    const index = this.products.findIndex(item => item.id === product.id)
    if(index !== -1) {
      this.products.splice(index, 1);
    }
  }

  cartCost(): number {
    return this.products.reduce((acc, product) => {
      return acc + (product.price || 0)
    }, 0)
  }

  quantityProductsCart(): number {
    return this.products.length
  }

  productInCart(productId: string): boolean {
    return this.products.some(product => product.id === productId)
  }

}