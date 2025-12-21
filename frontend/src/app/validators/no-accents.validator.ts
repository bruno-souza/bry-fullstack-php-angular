import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador que impede caracteres com acentuação
 */
export function noAccentsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString();
    
    // Regex para detectar caracteres acentuados
    const accentRegex = /[áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]/;
    
    if (accentRegex.test(value)) {
      return { hasAccents: true };
    }

    return null;
  };
}
