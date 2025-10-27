import { IBuyer, Validation } from "../../types";
import { IEvents } from "../base/Events.ts";

export class Buyer {
  private payment: string = '';
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor(private events: IEvents) {}

  setPayment(payment: string) {
    this.payment = payment;
    this.events.emit('orderForm:validate', {
      data: this.getData(),
      validate: this.validate()
    });
  }

  setEmail(email: string) {
    this.email = email;
    this.events.emit('contactsForm:validate', {
      data: this.getData(),
      validate: this.validate()
    });
  }

  setPhone(phone: string) {
    this.phone = phone;
    this.events.emit('contactsForm:validate', {
      data: this.getData(),
      validate: this.validate()
    });
  }

  setAddress(address: string) {
    this.address = address;
    this.events.emit('orderForm:validate', {
      data: this.getData(),
      validate: this.validate()
    });
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear() {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit('buyer:changed', this.getData());
    this.events.emit('buyer:cleared');
  }

  validate(): Validation {
    const errors: Validation['errors'] = {};

    if (!this.payment || this.payment.trim() === '') {
      errors.payment = 'Выберите способ оплаты!';
    }

    if (!this.email || this.email.trim() === '') {
      errors.email = 'Напишите свою почту!';
    }

    if (!this.address || this.address.trim() === '') {
      errors.address = 'Поле адреса обязательно к заполнению!';
    }

    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Заполните поле с телефоном!';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}