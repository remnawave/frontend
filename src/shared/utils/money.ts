import {
  toDecimal,
  dinero,
  add,
  subtract,
  multiply,
  toSnapshot,
  transformScale,
  up,
  isZero,
  isNegative,
  isPositive,
  equal,
  type Dinero,
} from 'dinero.js';
import { USD } from '@dinero.js/currencies';
import { formatCurrency } from './number';

const CURRENCY = USD;

export class Money {
  private readonly dinero: Dinero<number>;

  amountInCents: number;

  amount: number;

  constructor(amountInCents: number | string) {
    this.dinero = dinero({ amount: Number(amountInCents), currency: CURRENCY });
    this.amount = Number(toDecimal(this.dinero));
    this.amountInCents = Number(amountInCents);
  }

  add(m: Money) {
    const { amount } = toSnapshot(add(this.dinero, m.dinero));
    return new Money(amount);
  }

  subtract(m: Money) {
    const { amount } = toSnapshot(subtract(this.dinero, m.dinero));
    return new Money(amount);
  }

  multiply(multiplier: number, scale = 0) {
    const { amount } = toSnapshot(
      transformScale(multiply(this.dinero, { amount: multiplier, scale }), CURRENCY.exponent, up)
    );
    return new Money(amount);
  }

  isGreaterThan(m: Money) {
    return this.amountInCents > m.amountInCents;
  }

  isGreaterThanOrEqual(m: Money) {
    return this.amountInCents >= m.amountInCents;
  }

  isLessThan(m: Money) {
    return this.amountInCents < m.amountInCents;
  }

  isLessThanOrEqual(m: Money) {
    return this.amountInCents <= m.amountInCents;
  }

  percentage(percentage: number) {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }

    const normalize = Math.ceil(percentage * 100);
    return this.multiply(normalize, 4);
  }

  isZero() {
    return isZero(this.dinero);
  }

  isNegative() {
    return isNegative(this.dinero);
  }

  isPositive() {
    return isPositive(this.dinero);
  }

  equal(m: Money) {
    return equal(this.dinero, m.dinero);
  }

  format() {
    return toDecimal(this.dinero, ({ value, currency }) =>
      formatCurrency(value, ` ${currency.code}`)
    );
  }
}

interface Options {
  minorUnit?: boolean;
}

export function money(amount: number | string, options: Options = { minorUnit: true }): Money {
  const arg = options.minorUnit ? amount : Number(amount) * 100;
  return new Money(arg);
}
