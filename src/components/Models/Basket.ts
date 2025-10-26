import {IProduct} from "../../types";
import {IEvents} from "../base/Events.ts";

export class Basket {
  private products: IProduct[];

  constructor(protected events: IEvents) {
    this.products = [];
    // Инициализируем корзину при создании
    setTimeout(() => {
      this.events.emit('basket:changed');
    }, 0);
  }

  init() {
    this.events.emit('basket:changed');
  }

  getProductsCart(): IProduct[] {
    return [...this.products]
  }

  setProductCart(product: IProduct) {
    this.products.push(product)
    this.events.emit('basket:changed');
  }

  clearingCart() {
    this.products = []
    this.events.emit('basket:changed');
  }

  removeProduct(product: IProduct) {
    const index = this.products.findIndex(item => item.id === product.id)
    if(index !== -1) {
      this.products.splice(index, 1);
    }
    this.events.emit('basket:changed');
  }

  basketCost(): number {
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