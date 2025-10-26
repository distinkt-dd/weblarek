import { Form } from "./Form.ts";
import { IEvents } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils.ts";

export interface IOrderFormData {
  payment: string;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;
  private selectedPayment: string = '';

  constructor(events: IEvents, container: HTMLElement, onSubmit: (data: IOrderFormData) => void) {
    super(events, container, onSubmit);

    this.paymentButtons = Array.from(this.container.querySelectorAll('button[name]'));
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.initPaymentButtons();
  }

  private initPaymentButtons(): void {
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectPayment(button.name);
      });
    });
  }

  private selectPayment(payment: string): void {
    // Преобразуем в значения, которые ожидает сервер
    let serverPayment: string;
    if (payment === 'card') {
      serverPayment = 'online';
    } else if (payment === 'cash') {
      serverPayment = 'при получении';
    } else {
      serverPayment = payment;
    }

    this.selectedPayment = serverPayment;

    // Обновляем стили кнопок
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.name === payment);
    });

    this.validate();
  }

  protected validate(): boolean {
    const errors: string[] = [];

    if (!this.selectedPayment) {
      errors.push('Выберите способ оплаты');
    }

    if (!this.addressInput.value.trim()) {
      errors.push('Введите адрес доставки');
    }

    this.setErrors(errors);
    const isValid = errors.length === 0;
    this.setValid(isValid);

    return isValid;
  }

  protected getFormData(): IOrderFormData {
    return {
      payment: this.selectedPayment,
      address: this.addressInput.value.trim()
    };
  }

  clear(): void {
    this.selectedPayment = '';
    this.addressInput.value = '';
    this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
    this.setErrors([]);
    this.setValid(false);
  }
}