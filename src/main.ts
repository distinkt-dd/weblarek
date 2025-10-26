import './scss/styles.scss';
import {ProductsCatalog} from "./components/Models/ProductCatalog.ts";
import {Basket} from "./components/Models/Basket.ts";
import {API_URL, CDN_URL} from "./utils/constants.ts";
import {Api} from "./components/base/Api.ts";
import {LarekApi} from "./components/base/LarekApi.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {CardCatalog} from "./components/Views/CardCatalog.ts";
import {cloneTemplate, ensureElement} from "./utils/utils.ts";
import {Gallery} from "./components/Views/Gallery.ts";
import {Modal} from "./components/Views/Modal.ts";
import {CardPreview} from "./components/Views/CardPreview.ts";
import {Header} from "./components/Views/Header.ts";
import {BasketView} from "./components/Views/BasketView.ts";
import {CardBasket} from "./components/Views/CardBasket.ts";
import {IProduct, IOrderRequest} from "./types";
import {Buyer} from "./components/Models/Buyer.ts";
import { OrderForm } from "./components/Views/OrderForm.ts";
import { ContactsForm } from "./components/Views/ContactsForm.ts";
import { Success } from "./components/Views/Success.ts";



// templates & blocks

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
const modalContainer = ensureElement<HTMLElement>('#modal-container')
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


// api & models

const api = new Api(API_URL)
const larekAPI = new LarekApi(api)
const events = new EventEmitter();


const productCatalog = new ProductsCatalog(events)
const basketModel = new Basket(events)
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'))
const header = new Header(events,ensureElement<HTMLElement>('.header'))
const modal = new Modal(modalContainer, events)
const basket = new BasketView(cloneTemplate(basketTemplate), {
  onClick: () => {
    events.emit('basket:orderNew')
  }
})

const buyerModel = new Buyer()
// Получение данных о товарах с сервера

async function getProductsServer() {
  try {
    const products = await larekAPI.getProductList();
    productCatalog.setProducts(products);
  } catch (error) {
    console.error(error);
  }
}

// События

events.on('products:changed', () => {

  const products = productCatalog.getProducts();

  const cards = products.map(product => {
    const cardElement = cloneTemplate(cardCatalogTemplate)
    const card = new CardCatalog(cardElement, {
      onClick: () => {
        events.emit('card:selected', product);
      }
    })
    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: CDN_URL + product.image
    })
  })

  gallery.render({catalog: cards})
})

events.on('card:selected', product => {
  productCatalog.setSelectedProduct(product)
})

events.on('product:selected', () => {
  const modal = new Modal(modalContainer, events)
  const selectedProduct = productCatalog.getSelectedProduct();

  const isInBasket = basketModel.productInCart(selectedProduct?.id)

  // Определяем текст кнопки и действие
  const { buttonText, action } = getButtonConfig(selectedProduct, isInBasket);

  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      modal.close()
      handleProductAction(action, selectedProduct, events);
    }
  })

  const cardRender = card.render({
    title: selectedProduct?.title,
    image: CDN_URL + selectedProduct?.image,
    price: selectedProduct?.price,
    category: selectedProduct?.category,
    description: selectedProduct?.description,
    buttonText: buttonText
  })

  modal.render({content: cardRender})
  modal.open()
})

// Вспомогательные функции
function getButtonConfig(product: IProduct | null, isInBasket: boolean): { buttonText: string; action: 'add' | 'remove' | 'none' } {
  if (!product) return { buttonText: 'Недоступно', action: 'none' };

  if (isInBasket) {
    return { buttonText: 'Удалить из корзины', action: 'remove' };
  } else if (product.price) {
    return { buttonText: 'В корзину', action: 'add' };
  } else {
    return { buttonText: 'Недоступно', action: 'none' };
  }
}

function handleProductAction(action: 'add' | 'remove' | 'none', product: IProduct | null, events: EventEmitter): void {
  switch (action) {
    case 'add':
      events.emit('product:toBasket', product);
      break;
    case 'remove':
      events.emit('basket:deleteProduct', product);
      break;
    case 'none':
      // Ничего не делаем для недоступных товаров
      break;
  }
}

events.on('product:toBasket', product => {
  basketModel.setProductCart(product)
  const counter = basketModel.getProductsCart().length
  header.render({counter: counter})
})

events.on('basket:open', () => {
  const basketList = basketModel.getProductsCart()
  if(basketList.length === 0) {
    modal.render({content: basket.render({content: ['Корзина пуста']})})
  } else {
    modal.render({content: basket.render()})
  }



  modal.open()
})

events.on('basket-list:change', (products: IProduct[]) => {
  const cards = products.map((product, index) => {
    const cardElement = cloneTemplate(cardBasketTemplate);
    const card = new CardBasket(cardElement, {
      onClick: () => {
        events.emit('basket:deleteProduct', product);
      }
    });
    return card.render({
      title: product.title,
      price: product.price,
      index: index
    });
  });

  const isEmpty = cards.length === 0;
  const totalPrice = String(basketModel.basketCost());

  modal.render({
    content: basket.render({
      content: isEmpty ? ['Корзина пуста'] : cards,
      price: totalPrice,
      disabled: isEmpty
    })
  });

  header.render({ counter: basketModel.getProductsCart().length });
});

events.on('basket:deleteProduct', (product: IProduct) => {
  basketModel.removeProduct(product)
})

events.on('modal:close', () => {
  const selectedProduct = productCatalog.getSelectedProduct()
  if(selectedProduct) {
    productCatalog.deleteSelectedProduct()
  }
})





events.on('basket:orderNew', () => {
  const orderFormElement = cloneTemplate(orderTemplate);
  const orderForm = new OrderForm(events, orderFormElement, (orderData) => {
    buyerModel.setPayment(orderData.payment);
    buyerModel.setAddress(orderData.address);

    const contactsFormElement = cloneTemplate(contactsTemplate);
    const contactsForm = new ContactsForm(events, contactsFormElement, async (contactsData) => {
      buyerModel.setEmail(contactsData.email);
      buyerModel.setPhone(contactsData.phone);

      const validation = buyerModel.validate();
      if (validation.isValid) {
        try {
          // Создаем объект заказа согласно структуре из Postman
          const orderRequest: IOrderRequest = {
            ...buyerModel.getData(),
            total: basketModel.basketCost(),
            items: basketModel.getProductsCart().map(item => item.id)
          };


          // Отправляем заказ на сервер
          const result = await larekAPI.submitOrder(orderRequest);

          // Показываем успешное сообщение с ID заказа
          const successElement = cloneTemplate(successTemplate);
          const success = new Success(successElement, events);
          success.render({ total: result.total });

          modal.render({ content: success.container });

          // Очищаем корзину и данные покупателя ПОСЛЕ успешной отправки
          basketModel.clearingCart();
          buyerModel.clear();

          // Обновляем счетчик в хедере
          header.render({ counter: 0 });

        } catch (error) {
          console.error('Ошибка при оформлении заказа:', error);
          alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
        }
      } else {
        const errorMessages = Object.values(validation.errors);
        alert(`Ошибки заполнения формы:\n${errorMessages.join('\n')}`);
      }
    });

    modal.render({ content: contactsForm.container });
  });

  modal.render({ content: orderForm.container });
  modal.open();
});

events.on('success:close', () => {
  modal.close();
});

getProductsServer();


