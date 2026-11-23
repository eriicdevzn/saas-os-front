import { Directive, ElementRef, HostListener, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Formata um input de texto como moeda BRL (R$ 1.234,56) enquanto digita,
 * mantendo o valor numérico puro (number) no FormControl associado.
 * Uso: <input type="text" formControlName="valorPadrao" appCurrencyInput />
 */
@Directive({
  selector: '[appCurrencyInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputDirective),
      multi: true,
    },
  ],
})
export class CurrencyInputDirective implements ControlValueAccessor {
  private el = inject(ElementRef<HTMLInputElement>);
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  private formatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  writeValue(value: number | null): void {
    this.el.nativeElement.value = value != null ? this.formatter.format(value) : '';
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event'])
  handleInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const digitsOnly = raw.replace(/\D/g, '');
    const numeric = digitsOnly ? Number(digitsOnly) / 100 : 0;
    this.el.nativeElement.value = this.formatter.format(numeric);
    this.onChange(numeric);
  }

  @HostListener('blur')
  handleBlur(): void {
    this.onTouched();
  }

  @HostListener('focus')
  selectAllOnFocus(): void {
    this.el.nativeElement.select();
  }
}
