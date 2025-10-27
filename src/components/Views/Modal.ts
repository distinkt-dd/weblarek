import {IEvents} from "../base/Events.ts";
import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";


export interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal>{
  protected buttonClose: HTMLButtonElement;
  protected contentElement: HTMLElement;
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.buttonClose = ensureElement<HTMLButtonElement>('.modal__close', this.container)
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container)

    this.buttonClose.addEventListener('click', () => {
      this.close()
    })

    this.container.addEventListener('click', (event: MouseEvent) => {
      if(event.target === this.container) {
        this.close()
      }
    })

  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close')
  }

  protected set content(item: HTMLElement) {
    this.contentElement.replaceChildren(item);
  }



}