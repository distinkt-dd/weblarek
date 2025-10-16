import './scss/styles.scss';
import {apiProducts} from './utils/data.ts'
import {ProductsCatalog} from "./components/Models/ProductCatalog.ts";
import {Cart} from "./components/Models/Cart.ts";
import {Buyer} from "./components/Models/Buyer.ts";
import {API_URL} from "./utils/constants.ts";
import {Api} from "./components/base/Api.ts";
import {LarekApi} from "./components/base/LarekApi.ts";

// Тесты модели Product catalog

const productsModel = new ProductsCatalog()
const data = apiProducts.items

console.log("Тестовые данные(псевдо api): ", apiProducts )

// Добавление данных о товаре в модель

productsModel.setProducts(data)
console.log("Добавление данных в массив products: ", productsModel)

// Получение данных о товарах из модели

const newData = productsModel.getProducts()
console.log("Полученный массив данных из модели: ", newData)

// Получение данных о товаре по id

const getProductDataById = productsModel.getProductById('b06cde61-912f-4663-9751-09956c0eed67')
console.log('Получение данных о товаре по id "b06cde61-912f-4663-9751-09956c0eed67": ', getProductDataById)

// сохранение товара для подробного отображения

productsModel.setSelectedProduct(data[2])
console.log('Сохраненные данные о выбранном товаре: ', productsModel)

// Получение данных о выбранном товаре

const dataSelected = productsModel.getSelectedProduct()
console.log('Данные о выбранном товаре', dataSelected)

// Тесты модели Cart

// Создание экземпляра cart с мок данными
const cartModel = new Cart(productsModel.getProducts()) // Помещаю в корзину хоть какие то мок данные
console.log('Тест данные для корзины: ', cartModel)

// Получение данных из корзины

const cartData = cartModel.getProductsCart()
console.log('Полученные данные из корзины: ', cartData)

// Добавление продукта в список

cartModel.setProductCart({
  id: '123',
  description: 'test',
  image: 'fake src/',
  title: 'test title',
  category: 'test category',
  price: 123
})
console.log('Список товаров в корзине после добавления внутрь нового товара', cartModel.getProductsCart())

// Удаление определенного товара из корзины

cartModel.removeProduct({
  id: '123',
  description: 'test',
  image: 'fake src/',
  title: 'test title',
  category: 'test category',
  price: 123
})
console.log('Список товаров в корзине после удаления элемента с id 123', cartModel.getProductsCart())

// расчет суммы всех товаров в корзине

const sum = cartModel.cartCost()
console.log('Сумма товаров в корзине', sum)

// Определение кол-ва товаров в корзине

const quantity = cartModel.quantityProductsCart()
console.log('Кол-во товаров в корзине: ', quantity)

// определение наличия товара в корзине по его идентификатору

const hasProduct = cartModel.productInCart('b06cde61-912f-4663-9751-09956c0eed67')
console.log('Товар с id b06cde61-912f-4663-9751-09956c0eed67 найден?: ', hasProduct)

// Очистка корзины

cartModel.clearingCart()
console.log('Массив товаров после полной очистки: ', cartModel.getProductsCart())

// Тест модели buyer

// Создание экземпляра класса Buyer
const buyer = new Buyer()
console.log('Объект buyer со стоковыми/пустыми данными', buyer)

// Добавление email, phone, address, payment для buyer

buyer.setPhone('+79393939393')
console.log('Добавили телефон: ',buyer)

buyer.setEmail('sddss@yandex.ru')
console.log('Добавили email: ', buyer)

buyer.setPayment('online')
console.log('Добавили способ оплаты: ',buyer)

buyer.setAddress('Пушкина 34')
console.log('Добавили адрес: ',buyer)

// Получение объекта с данными

const buyerObj = buyer.getData()
console.log('Объект с заполненными данными',buyerObj)

// Валидация

const validateObj1 = buyer.validate()
console.log('Полностью валидные данные', validateObj1)

// Удаление данных

buyer.clear()
console.log('Данные удалились: ', buyer)


// Валидация - тест ошибок

const validateObj2 = buyer.validate()
console.log('Вернулся объект с ошибками',validateObj2)


// Получение данных по API


const api = new Api(API_URL)
const larekApi = new LarekApi(api)
const newProductCatalog = new ProductsCatalog()

try {
  const products = await larekApi.getProductList()
  newProductCatalog.setProducts(products)
} catch (e) {
  console.log(e)
}

console.log('Массив товаров полученных по API', newProductCatalog.getProducts())



