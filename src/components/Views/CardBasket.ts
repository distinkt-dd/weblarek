import {Card, ICardActions, TCard} from "./Card.ts";

import {ensureElement} from "../../utils/utils.ts";

export interface ICardBasket {
  index: number;
}

export type TCardBasket = TCard & ICardBasket

export class CardBasket extends Card<TCardBasket> {
  protected indexElement: HTMLElement
  protected delButtonElement: HTMLButtonElement;
  constructor(protected container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container)
    this.delButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container)

    if(actions?.onClick) {
      this.delButtonElement.addEventListener('click',actions.onClick)
    }

  }

  set index(value: number) {
    this.indexElement.textContent = String(value + 1);
  }
}