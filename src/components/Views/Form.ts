import { Component } from "../base/Component.ts";
import { ensureElement } from "../../utils/utils.ts";
import { IEvents } from "../base/Events.ts";

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
    protected onSubmit: (data: T) => void
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsContainer = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('submit', this.handleSubmit.bind(this));
    this.container.addEventListener('input', this.handleInput.bind(this));
  }

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.validate()) {
      this.onSubmit(this.getFormData());
    }
  }

  protected handleInput(): void {
    this.validate();
  }

  protected setErrors(messages: string[]): void {
    this.errorsContainer.textContent = messages.join(', ');
  }

  protected setValid(valid: boolean): void {
    this.submitButton.disabled = !valid;
  }

  protected abstract validate(): boolean;
  protected abstract getFormData(): T;
}