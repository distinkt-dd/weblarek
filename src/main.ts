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
import {IProduct, IOrderRequest, IBuyer} from "./types";
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

// api & models - создаются один раз
const api = new Api(API_URL)
const larekAPI = new LarekApi(api)
const events = new EventEmitter();

// views - создаются один раз
const productCatalog = new ProductsCatalog(events)
const basketModel = new Basket(events)
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'))
const header = new Header(events, ensureElement<HTMLElement>('.header'))
const modal = new Modal(modalContainer, events)
const basketView = new BasketView(cloneTemplate(basketTemplate), {
  onClick: () => {
    events.emit('basket:orderNew')
  }
})
const buyerModel = new Buyer(events)

// Создаем экземпляры форм заранее
const orderForm = new OrderForm(events, cloneTemplate(orderTemplate), 'order:submit');
const contactsForm = new ContactsForm(events, cloneTemplate(contactsTemplate), 'contacts:submit');
const successView = new Success(cloneTemplate(successTemplate), events);

// Получение данных о товарах с сервера
async function getProductsServer() {
  try {
    const products = await larekAPI.getProductList();
    productCatalog.setProducts(products);
  } catch (error) {
    console.error(error);
  }
}

// События для каталога товаров
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
  const selectedProduct = productCatalog.getSelectedProduct();
  const isInBasket = basketModel.productInCart(selectedProduct?.id)

  const { buttonText, action } = getButtonConfig(selectedProduct, isInBasket);

  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      modal.close();
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

// Вспомогательные функции для товаров
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
      break;
  }
}

// События для корзины
events.on('product:toBasket', product => {
  basketModel.setProductCart(product)
})

events.on('basket:deleteProduct', (product: IProduct) => {
  basketModel.removeProduct(product)
})

events.on('basket:open', () => {
  modal.render({ content: basketView.render()});
  modal.open();
})

events.on('basket:changed', () => {
  const products = basketModel.getProductsCart();
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

  basketView.content = isEmpty ? ['Корзина пуста'] : cards;
  basketView.price = totalPrice;
  basketView.disabled = isEmpty;

  header.render({ counter: products.length });
})

events.on('basket:orderNew', () => {
  const basketList = basketModel.getProductsCart()
  if(basketList && basketList.length > 0) {
    modal.render({content: orderForm.render()})
  }
  // Ничего не отчищаю, так как пользователь может случайно закрыть форму заполнения.
  events.emit('orderForm:validate', {
    data: buyerModel.getData(),
    validate: buyerModel.validate()
  })
})

events.on('orderForm:payments', data => {
  buyerModel.setPayment(data.paymentType)
})

events.on('order:input', data => {
  buyerModel.setAddress(data.value)
})

events.on('contacts:input', data => {
  if(data.field === 'email') {
    buyerModel.setEmail(data.value)
  } else {
    buyerModel.setPhone(data.value)
  }
})

function validator(fields: string[], data) {
  const stringErrors: string[] = []
  let isValid: boolean = false
  fields.forEach(field => {
    if(field in data.validate.errors) {
      stringErrors.push(data.validate.errors[field])
    }
  })

  if(stringErrors.length === 0) {
    isValid = true
  }

  return {
    stringErrors,
    isValid: !isValid
  }

}

events.on('orderForm:validate', data => {
  const validateOrderForm = validator(['payment', 'address'], data)
  orderForm.payment = data.data['payment'];
  orderForm.valid = validateOrderForm.isValid
  orderForm.errors = validateOrderForm.stringErrors
})

events.on('order:submit', () => {
  modal.render({content: contactsForm.render()})
  events.emit('contactsForm:validate', {
    data: buyerModel.getData(),
    validate: buyerModel.validate()
  })
})

events.on('contactsForm:validate', data => {
  const validateContactForm = validator(['email', 'phone'], data)
  contactsForm.valid = validateContactForm.isValid;
  contactsForm.errors = validateContactForm.stringErrors
})

events.on('contacts:submit', async () => {
  const validation = buyerModel.validate()
  // Проверяем валидацию
  if (validation.isValid) {
    try {
      const orderRequest: IOrderRequest = {
        ...buyerModel.getData(),
        total: basketModel.basketCost(),
        items: basketModel.getProductsCart().map(item => item.id)
      };
      const result = await larekAPI.submitOrder(orderRequest);
      modal.render({content: successView.render({total: result.total})})

      basketModel.clearingCart()
      buyerModel.clear()
      orderForm.clear()
      contactsForm.clear()
    } catch (e) {
      console.error('Ошибка при оформлении заказа:', error);
    }
  } else {
    const errorMessages = Object.values(validation.errors);
    alert(`Ошибки заполнения формы:\n${errorMessages.join('\n')}`);
  }

})

events.on('success:close', () => {
  modal.close();
});

// Инициализация корзины
setTimeout(() => {
  events.emit('basket:changed');
}, 0);

getProductsServer();