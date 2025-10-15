import './scss/styles.scss';
import {apiProducts} from './utils/data.ts'
import {ProductsCatalog} from "./components/Models/ProductCatalog.ts";

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