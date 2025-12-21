import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatar CNPJ
 * Transforma: 12345678901234 -> 12.345.678/9012-34
 */
@Pipe({
  name: 'cnpj',
  standalone: true
})
export class CnpjPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    
    // Remove tudo que não é dígito
    const cnpj = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (cnpj.length === 14) {
      return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return cnpj;
  }
}
