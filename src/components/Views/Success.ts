import { Component } from "../base/Component.ts";
import { ensureElement } from "../../utils/utils.ts";
import { IEvents } from "../base/Events.ts";

export interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  private closeButton: HTMLButtonElement;
  private descriptionElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);

    this.closeButton.addEventListener('click', () => {
      events.emit('success:close');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}