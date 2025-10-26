import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";

export interface IBasketActions {
  onClick: (event: MouseEvent) => void;
}

export interface IBasketView {
  price: string;
  content: HTMLElement[] | string[];
}

export class BasketView extends Component<IBasketView>{
  protected basketList: HTMLUListElement;
  protected basketPrice: HTMLElement
  protected basketNewOrder: HTMLButtonElement;

  constructor(protected container: HTMLElement, actions?: IBasketActions) {
    super(container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container)
    this.basketList = ensureElement<HTMLUListElement>('.basket__list', this.container)
    this.basketNewOrder = ensureElement<HTMLButtonElement>('.basket__button', this.container)

    if(actions?.onClick) {
      this.basketNewOrder.addEventListener('click', actions.onClick);
    }
  }

  protected set price(value: string) {
    this.basketPrice.textContent = value + " " + 'синапсов';
  }

  protected set content(items: HTMLElement[] | string[]) {
    if(items.length > 0) {
      this.basketList.textContent = ''
      this.basketList.replaceChildren(...items)

      if(this.basketList.textContent === items[0]) {
        this.basketNewOrder.disabled = true;
      } else {
        this.basketNewOrder.disabled = false;
      }
    }

  }

}