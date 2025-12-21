import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Diretiva para aplicar máscara de CNPJ durante a digitação
 * Formata visualmente: 12.345.678/9012-34
 * Remove a máscara do FormControl (envia apenas números para o backend)
 */
@Directive({
  selector: '[cnpjMask]',
  standalone: true
})
export class CnpjMaskDirective {
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    // Limita a 14 dígitos
    if (value.length > 14) {
      value = value.substring(0, 14);
    }
    
    // Aplica a máscara progressivamente
    let maskedValue = value;
    if (value.length > 12) {
      maskedValue = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
    } else if (value.length > 8) {
      maskedValue = value.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
    } else if (value.length > 5) {
      maskedValue = value.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (value.length > 2) {
      maskedValue = value.replace(/(\d{2})(\d{0,3})/, '$1.$2');
    }
    
    // Atualiza o campo visual com a máscara
    event.target.value = maskedValue;
    
    // Atualiza o FormControl com apenas números (sem máscara)
    if (this.control && this.control.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any): void {
    // Garante que o valor do FormControl esteja sem máscara
    const value = event.target.value.replace(/\D/g, '');
    if (this.control && this.control.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }
  }
}
