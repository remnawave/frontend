interface FormatterOptions {
  precision?: number;
  full?: boolean;
  thousandSeparator?: string;
  decimalSeparator?: string;
  suffix?: string;
  prefix?: string;
}

const defaultOptions: Required<FormatterOptions> = {
  precision: 2,
  thousandSeparator: ',',
  decimalSeparator: '.',
  suffix: '',
  prefix: '',
  full: true,
};

export function formatDecimal(value: number | string, options?: FormatterOptions): string {
  const currentValue = typeof value === 'string' ? parseFloat(value) : value;

  if (Number.isNaN(currentValue)) {
    throw new Error(
      'Invalid value. Please provide a valid number or string representation of a number.'
    );
  }

  const { precision, thousandSeparator, decimalSeparator, prefix, suffix } = {
    ...defaultOptions,
    ...options,
  };

  const parts = currentValue.toFixed(precision).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  const decimalPart = parts[1];

  return `${prefix}${integerPart}`
    .concat(decimalPart ? `${decimalSeparator}${decimalPart}` : '')
    .concat(suffix);
}

export function formatInt(value: number | string, options?: FormatterOptions) {
  return formatDecimal(value, { ...options, precision: 0 });
}

export function formatPercentage(value: number | string, options?: FormatterOptions): string {
  return formatDecimal(value, { ...options, suffix: '%' });
}

export function formatCurrency(
  value: number | string,
  currency = '$',
  options?: FormatterOptions
): string {
  return formatDecimal(value, { ...options, prefix: currency });
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function randomInt({ min, max }: { min: number; max: number }) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
