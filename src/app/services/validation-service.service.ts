// src/app/services/validation.service.ts
import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  // Required field validator
  static requiredField(): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value ? null : { requiredField: true };
    };
  }

  // Email pattern validator
  static emailPattern(): ValidatorFn {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return (control: AbstractControl) => {
      return emailRegex.test(control.value) ? null : { emailPattern: true };
    };
  }

  // Password strength validator
  static strongPassword(): ValidatorFn {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return (control: AbstractControl) => {
      return passwordRegex.test(control.value)
        ? null
        : { strongPassword: true };
    };
  }

  // Custom validator for matching passwords
  static matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.parent &&
        control.parent.value &&
        control.value === (control.parent?.get(matchTo) as AbstractControl)?.value
        ? null
        : { isMatching: true };
    };
  }
}
