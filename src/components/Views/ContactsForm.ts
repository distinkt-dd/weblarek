import { Form } from "./Form.ts";
import { IEvents } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils.ts";

export class ContactsForm extends Form<void> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement, eventName: string) {
    super(events, container, eventName);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts:input', {field: 'email', value: this.emailInput.value.trim()});
    });
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:input', {field: 'phone', value: this.phoneInput.value.trim()});
    });
  }


  clear(): void {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    super.clear();
  }
}