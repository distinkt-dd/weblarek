import { Component } from "../base/Component.ts";
import { ensureElement } from "../../utils/utils.ts";
import { IEvents } from "../base/Events.ts";

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export abstract class Form<T> extends Component<IFormState> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
    protected eventName: string
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsContainer = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('submit', this.handleSubmit.bind(this));
  }

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    this.events.emit(this.eventName);
  }

  set valid(value: boolean) {
    this.submitButton.disabled = value
  }


  set errors(value: string[]) {
    this.errorsContainer.textContent = value.join(', ');
  }

  clear(): void {
    this.errors = [];
  }
}