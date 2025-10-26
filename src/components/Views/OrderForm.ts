import { Form } from "./Form.ts";
import { IEvents } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils.ts";

export class OrderForm extends Form<void> {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;
  private selectedPayment: string = '';

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
        this.selectPayment(button.name);
      });
    });
  }

  private initAddressInput(): void {
    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:input');
    });
  }

  private selectPayment(payment: string): void {
    // Сбрасываем все кнопки
    this.paymentButtons.forEach(btn => {
      btn.classList.remove('button_alt-active');
    });

    // Активируем выбранную кнопку
    const selectedButton = this.paymentButtons.find(btn => btn.name === payment);
    if (selectedButton) {
      selectedButton.classList.add('button_alt-active');
    }

    this.selectedPayment = payment;
    this.events.emit('order:payment:changed');
  }

  get payment(): string {
    return this.selectedPayment;
  }

  get address(): string {
    return this.addressInput.value.trim();
  }

  clear(): void {
    this.selectedPayment = '';
    this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
    this.addressInput.value = '';
    super.clear();
  }
}