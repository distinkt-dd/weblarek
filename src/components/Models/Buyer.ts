import {IBuyer, Validation} from "../../types";

export class Buyer
{
  private payment: string | null;
  private email: string;
  private phone: string;
  private address: string;

  constructor() {
    this.payment = null
    this.email = ''
    this.phone = ''
    this.address = ''
  }

  setPayment(payment: string) {
    this.payment = payment
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPhone(phone: string) {
    this.phone = phone;
  }

  setAddress(address: string) {
    this.address = address;
  }

  getData(): IBuyer {
    return {
      payment: this.payment!,
      email: this.email,
      phone: this.phone,
      address: this.address,
    }
  }

  clear() {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): Validation {
    const errors: Validation['errors'] = {}

    if(!this.payment || this.payment.trim() === '') {
      errors.payment = 'Выберите способ оплаты!'
    }

    if(!this.email || this.email.trim() === '') {
      errors.email = 'Напишите свою почту!'
    }

    if(!this.address || this.address.trim() === '') {
      errors.address = 'Поле адреса обязательно к заполнению!'
    }

    if(!this.phone || this.phone.trim() === '') {
      errors.phone = 'Заполните поле с телефоном!'
    }


    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }

  }

}