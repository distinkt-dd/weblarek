import { IApi, IProduct, IOrderRequest, IOrderResult, IProductListResponse} from '../../types'

export class LarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api
  }

  async getProductList(): Promise<IProduct[]> {
    const response: IProductListResponse = await this.api.get('/product/')
    return response.items
  }

  async submitOrder(orderData: IOrderRequest): Promise<IOrderResult> {
    return await this.api.post('/order/', orderData)
  }

}