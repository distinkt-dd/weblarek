export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';



export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
  payment: string;    // 'online' или 'при получении'
  email: string;
  phone: string;
  address: string;
}

export interface Validation {
    isValid: boolean;
    errors: {
        payment?: string;
        email?: string;
        phone?: string;
        address?: string;
    }
}

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IOrderRequest {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IProductListResponse {
    total: number;
    items: IProduct[];
}




