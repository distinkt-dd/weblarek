import {Card, ICardActions, TCard} from "./Card.ts";
import {IProduct} from "../../types";
import {ensureElement} from "../../utils/utils.ts";
import {categoryMap} from "../../utils/constants.ts";
import {categoryKey} from "./CardCatalog.ts";


export interface ICardPreview {
  buttonText: string;
}

export type TCardPreview = TCard & Pick<IProduct, 'description' | 'image' | 'category'> & ICardPreview

export class CardPreview extends Card<TCardPreview>{
  protected descriptionElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected cardBuyButton: HTMLButtonElement;

  constructor(container: HTMLElement, action?: ICardActions) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container)
    this.cardBuyButton = ensureElement<HTMLButtonElement>('.card__button', this.container)
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container)
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container)

    if(action?.onClick) {
      this.cardBuyButton.addEventListener(
        'click',
        action.onClick
      )
    }
  }

  set description(description: string) {
    this.descriptionElement.textContent = description;
  }

  set category(category: string) {
    this.categoryElement.textContent = category;
    for(const key in categoryMap) {
      this.categoryElement.classList.toggle(categoryMap[key as categoryKey],
        key === category);
    }
  }

  set buttonText(value: string) {
    this.cardBuyButton.textContent = value;
    if(this.cardBuyButton.textContent === 'Недоступно') {
      this.cardBuyButton.disabled = true;
    }

  }

  set image(src: string) {
    this.setImage(this.imageElement, src, this.title)
  }

}