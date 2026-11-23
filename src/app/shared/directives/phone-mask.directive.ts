import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Aplica máscara de telefone brasileiro ((11) 91234-5678) enquanto digita.
 * Diretiva puramente visual — o FormControl continua guardando o texto mascarado,
 * que é aceito como está pelo backend (campo telefone é livre).
 * Uso: <input formControlName="telefone" appPhoneMask />
 */
@Directive({
  selector: '[appPhoneMask]',
  standalone: true,
})
export class PhoneMaskDirective {
  private el = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 11);

    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 7) {
      const isCelular = digits.length > 10;
      const splitAt = isCelular ? 7 : 6;
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, splitAt)}-${digits.slice(splitAt)}`;
    }

    input.value = formatted;
  }
}
