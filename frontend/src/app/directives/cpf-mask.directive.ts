import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Diretiva para aplicar máscara de CPF durante a digitação
 * Formata visualmente: 123.456.789-01
 * Remove a máscara do FormControl (envia apenas números para o backend)
 */
@Directive({
  selector: '[cpfMask]',
  standalone: true
})
export class CpfMaskDirective {
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Aplica a máscara progressivamente
    let maskedValue = value;
    if (value.length > 9) {
      maskedValue = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      maskedValue = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      maskedValue = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
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
