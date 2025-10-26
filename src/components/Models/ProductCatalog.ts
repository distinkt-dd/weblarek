import {IProduct} from "../../types";
import {IEvents} from "../base/Events.ts";


export class ProductsCatalog {

  private products: IProduct[];
  private selectedProduct: IProduct | null;

  constructor(protected events: IEvents) {
    this.products = [];
    this.selectedProduct = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = [...products]; // сохранение массива товаров полученного в параметрах метода.
    this.events.emit('products:changed')
  }

  getProducts(): IProduct[] {
    return [...this.products] // получение массива товаров из модели;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id) // Получение одного товара по id в параметре метода
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product // сохранение товара для подробного отображения;
    this.events.emit('product:selected')
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct // Получение товара для подробного отображения
  }

  deleteSelectedProduct(): void {
    this.selectedProduct = null
  }

}