import { Component } from "../base/Component.ts";
import { ensureElement } from "../../utils/utils.ts";

export interface IBasketActions {
  onClick: (event: MouseEvent) => void;
}

export interface IBasketView {
  price: string;
  content: HTMLElement[] | string[];
  disabled: boolean;
}

export class BasketView extends Component<IBasketView> {
  protected basketList: HTMLUListElement;
  protected basketPrice: HTMLElement;
  protected basketNewOrder: HTMLButtonElement;

  constructor(protected container: HTMLElement, actions?: IBasketActions) {
    super(container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketList = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this.basketNewOrder = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    if (actions?.onClick) {
      this.basketNewOrder.addEventListener('click', actions.onClick);
    }
  }

  set price(value: string) {
    this.basketPrice.textContent = value + " синапсов";
  }

  set content(items: HTMLElement[] | string[]) {
    if (items.length > 0) {
      this.basketList.innerHTML = '';
      if (typeof items[0] === 'string') {
        this.basketList.textContent = items[0] as string;
      } else {
        this.basketList.replaceChildren(...(items as HTMLElement[]));
      }
    } else {
      this.basketList.textContent = 'Корзина пуста';
    }
  }

  set disabled(value: boolean) {
    this.basketNewOrder.disabled = value;
    if (value) {
      this.basketNewOrder.classList.add('button_disabled');
    } else {
      this.basketNewOrder.classList.remove('button_disabled');
    }
  }
}