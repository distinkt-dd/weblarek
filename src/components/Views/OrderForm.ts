import { Form } from "./Form.ts";
import { IEvents } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils.ts";

export interface  IOrderForm {
  payment: string;
}

export class OrderForm extends Form<IOrderForm> {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement, eventName: string) {
    super(events, container, eventName);
    this.paymentButtons = Array.from(this.container.querySelectorAll('button[name]'));
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.initPaymentButtons();
    this.initAddressInput();
  }

  private initPaymentButtons(): void {
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.events.emit('orderForm:payments', {paymentType: button.name})
      });
    });
  }

  private initAddressInput(): void {
    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:input', {field: 'address', value: this.addressInput.value.trim()});
    });
  }

  set payment(payment: string) {
    this.paymentButtons.forEach(btn => {
      btn.classList.remove('button_alt-active');
    });

    const selectedButton = this.paymentButtons.find(btn => btn.name === payment);
    if (selectedButton) {
      selectedButton.classList.add('button_alt-active');
    }

  }

  clear(): void {
    this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
    this.addressInput.value = '';
    super.clear();
  }
}