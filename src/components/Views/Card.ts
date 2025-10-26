import {ensureElement} from "../../utils/utils.ts";
import {Component} from "../base/Component.ts";
import {IProduct} from "../../types";

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
  onDelete?: (event: MouseEvent) => void;
}

export type TCard = Pick<IProduct, 'price' | 'title'>

export class Card<T extends TCard> extends Component<T> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(protected container: HTMLElement) {
    super(container);
    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container)
  }

  set title(value: string) {
    this.cardTitle.textContent = value
  }

  set price(value: number | null) {
    if(value) {
      this.cardPrice.textContent = String(value) + " " + 'синапсов';
    } else {
      this.cardPrice.textContent = 'Бесценно';
    }
  }
}