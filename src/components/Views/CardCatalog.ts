import {Card, TCard, ICardActions} from "./Card.ts";
import {ensureElement} from "../../utils/utils.ts";
import {categoryMap} from "../../utils/constants.ts";
import {IProduct} from "../../types";


export type categoryKey = keyof typeof categoryMap;

export type TCardCatalog = TCard & Pick<IProduct, 'category' | 'image'>

export class CardCatalog extends Card<TCardCatalog>{
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(protected container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container)
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container)


    if(actions?.onClick) {
      this.container.addEventListener('click', actions.onClick)
    }
  }

  set category(category: string) {
    this.categoryElement.textContent = category;
    for(const key in categoryMap) {
      this.categoryElement.classList.toggle(categoryMap[key as categoryKey],
        key === category);
    }
  }

  set image(src: string) {
    this.setImage(this.imageElement, src, this.title)
  }
}