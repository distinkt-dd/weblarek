import { Form } from "./Form.ts";
import { IEvents } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils.ts";

export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement, onSubmit: (data: IContactsFormData) => void) {
    super(events, container, onSubmit);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.initPhoneMask();
  }

  private initPhoneMask(): void {
    this.phoneInput.addEventListener('input', this.formatPhone.bind(this));
  }

  private formatPhone(): void {
    let value = this.phoneInput.value.replace(/\D/g, '');

    if (value.startsWith('7') || value.startsWith('8')) {
      value = value.substring(1);
    }

    let formattedValue = '+7 (';

    if (value.length > 0) {
      formattedValue += value.substring(0, 3);
    }
    if (value.length > 3) {
      formattedValue += ') ' + value.substring(3, 6);
    }
    if (value.length > 6) {
      formattedValue += '-' + value.substring(6, 8);
    }
    if (value.length > 8) {
      formattedValue += '-' + value.substring(8, 10);
    }

    this.phoneInput.value = formattedValue;
  }

  protected validate(): boolean {
    const errors: string[] = [];

    if (!this.emailInput.value.trim()) {
      errors.push('Введите email');
    } else if (!this.isValidEmail(this.emailInput.value)) {
      errors.push('Введите корректный email');
    }

    if (!this.phoneInput.value.trim()) {
      errors.push('Введите телефон');
    } else if (!this.isValidPhone(this.phoneInput.value)) {
      errors.push('Введите корректный телефон');
    }

    this.setErrors(errors);
    const isValid = errors.length === 0;
    this.setValid(isValid);

    return isValid;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length === 11;
  }

  protected getFormData(): IContactsFormData {
    return {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim()
    };
  }

  clear(): void {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.setErrors([]);
    this.setValid(false);
  }
}