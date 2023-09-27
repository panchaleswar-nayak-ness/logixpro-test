import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorService {

  

  specialCharValidator(control: FormControl): any {
    const nameRegexp: RegExp = /[='"]/;
    if (control.value && nameRegexp.test(control.value)) {
       return { invalidInput: true };
    }
  }

  specialCharValidatorExceptSlash(control: FormControl): any {
    const nameRegexp: RegExp = /^[a-zA-Z0-9_\/][a-zA-Z0-9_\/ ]*[a-zA-Z0-9_]$/;
    if (control.value && !nameRegexp.test(control.value)) {
       return { invalidInput: true };
    }
  }




  noWhitespaceValidator(control: FormControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? { 'whitespace': true } : null;
  }

  customTrim(control: FormControl){
    const isSpace = (control.value || '').trim() === '' ;
    return isSpace ? { 'whitespace': true } : null
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
